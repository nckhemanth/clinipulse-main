package cloud.nckhemanth.clinipulse.document;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
public class MedicalDocumentService {

    private final MedicalDocumentRepository repository;
    private final DocumentStorage storage;
    private final PdfDocumentValidator validator;
    private final RagDocumentIndexer indexer;
    private final Clock clock;

    public MedicalDocumentService(MedicalDocumentRepository repository,
                                  DocumentStorage storage,
                                  PdfDocumentValidator validator,
                                  RagDocumentIndexer indexer) {
        this(repository, storage, validator, indexer, Clock.systemUTC());
    }

    MedicalDocumentService(MedicalDocumentRepository repository,
                           DocumentStorage storage,
                           PdfDocumentValidator validator,
                           RagDocumentIndexer indexer,
                           Clock clock) {
        this.repository = repository;
        this.storage = storage;
        this.validator = validator;
        this.indexer = indexer;
        this.clock = clock;
    }

    @Transactional(noRollbackFor = DocumentIndexingException.class)
    public UploadedDocument upload(String originalName, String contentType, byte[] content, String actor) {
        validator.validate(originalName, content);

        UUID id = UUID.randomUUID();
        String normalizedContentType = "application/pdf";
        String blobName = actor + "/" + id + ".pdf";
        String sha256 = sha256(content);

        if (repository.existsBySha256(sha256)) {
            throw new DuplicateDocumentException(originalName);
        }

        storage.store(blobName, content, normalizedContentType);

        MedicalDocument document = new MedicalDocument(
                id,
                originalName,
                blobName,
                sha256,
                normalizedContentType,
                content.length,
                DocumentStatus.STORED,
                actor,
                Instant.now(clock));

        MedicalDocument saved = repository.save(document);
        try {
            int chunks = indexer.index(saved.getId(), saved.getOriginalName(), content);
            saved.markReady();
            repository.save(saved);
            return new UploadedDocument(
                    DocumentResponse.from(saved, storage.location(saved.getBlobName())), chunks);
        } catch (RuntimeException exception) {
            saved.markFailed();
            repository.save(saved);
            throw new DocumentIndexingException(saved.getOriginalName(), exception);
        }
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> list() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(document -> DocumentResponse.from(document, storage.location(document.getBlobName())))
                .toList();
    }

    @Transactional
    public long clear() {
        List<MedicalDocument> documents = repository.findAll();
        documents.forEach(document -> {
            indexer.delete(document.getId());
            storage.delete(document.getBlobName());
        });
        repository.deleteAllInBatch();
        return documents.size();
    }

    @Transactional(readOnly = true)
    public long count() {
        return repository.count();
    }

    private String sha256(byte[] content) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(content));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }

    public record UploadedDocument(DocumentResponse document, int chunks) {}
}

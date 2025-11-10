package cloud.nckhemanth.clinipulse.document;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class MedicalDocumentController {

    private final MedicalDocumentService service;

    public MedicalDocumentController(MedicalDocumentService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    UploadResponse upload(@RequestPart("files") List<MultipartFile> files,
                          @RequestParam(name = "session_id", defaultValue = "default") String sessionId,
                          Authentication authentication) {
        String actor = authentication == null ? "local-user" : authentication.getName();
        List<StoredDocument> uploaded = new ArrayList<>();
        List<FailedUpload> failed = new ArrayList<>();
        int totalChunks = 0;

        for (MultipartFile file : files) {
            try {
                MedicalDocumentService.UploadedDocument result = service.upload(
                        file.getOriginalFilename(), file.getContentType(), file.getBytes(), actor);
                uploaded.add(StoredDocument.from(result.document()));
                totalChunks += result.chunks();
            } catch (DuplicateDocumentException duplicate) {
                failed.add(new FailedUpload(file.getOriginalFilename(), duplicate.getMessage()));
            } catch (IOException | IllegalArgumentException | DocumentIndexingException exception) {
                failed.add(new FailedUpload(file.getOriginalFilename(), exception.getMessage()));
            }
        }

        boolean success = !uploaded.isEmpty() && failed.isEmpty();
        String message = uploaded.size() + " document(s) stored securely in Azure Blob Storage";
        if (!failed.isEmpty()) {
            message += "; " + failed.size() + " file(s) could not be uploaded";
        }
        return new UploadResponse(success, uploaded, List.of(), failed, totalChunks, message, sessionId);
    }

    @GetMapping("/list")
    List<DocumentInfo> list() {
        return service.list().stream().map(DocumentInfo::from).toList();
    }

    @DeleteMapping("/clear")
    ClearResponse clear(@RequestParam(name = "session_id", defaultValue = "default") String sessionId) {
        return new ClearResponse(true, service.clear(), sessionId);
    }

    @PostMapping("/process-storage")
    ProcessStorageResponse processStorage(
            @RequestParam(name = "session_id", defaultValue = "default") String sessionId) {
        return new ProcessStorageResponse(true, service.count(), 0, sessionId);
    }

    record StoredDocument(
            String filename,
            @JsonProperty("storage_key") String storageKey,
            @JsonProperty("storage_url") String storageUrl) {
        static StoredDocument from(DocumentResponse response) {
            return new StoredDocument(response.originalName(), response.storageKey(), response.storageUrl());
        }
    }

    record FailedUpload(String filename, String error) {}

    record UploadResponse(
            boolean success,
            @JsonProperty("uploaded_to_storage") List<StoredDocument> uploadedToStorage,
            @JsonProperty("already_in_storage") List<StoredDocument> alreadyInStorage,
            @JsonProperty("failed_uploads") List<FailedUpload> failedUploads,
            @JsonProperty("total_chunks") int totalChunks,
            String message,
            @JsonProperty("session_id") String sessionId) {}

    record DocumentInfo(
            String filename,
            String key,
            long size,
            @JsonProperty("last_modified") String lastModified,
            @JsonProperty("storage_url") String storageUrl) {
        static DocumentInfo from(DocumentResponse response) {
            return new DocumentInfo(
                    response.originalName(), response.storageKey(), response.sizeBytes(),
                    response.createdAt().toString(), response.storageUrl());
        }
    }

    record ClearResponse(boolean success, @JsonProperty("documents_cleared") long documentsCleared,
                         @JsonProperty("session_id") String sessionId) {}

    record ProcessStorageResponse(boolean success,
                                  @JsonProperty("documents_processed") long documentsProcessed,
                                  @JsonProperty("total_chunks") int totalChunks,
                                  @JsonProperty("session_id") String sessionId) {}
}

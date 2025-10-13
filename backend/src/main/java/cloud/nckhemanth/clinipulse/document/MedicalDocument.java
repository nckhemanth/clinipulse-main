package cloud.nckhemanth.clinipulse.document;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "medical_documents")
public class MedicalDocument {

    @Id
    private UUID id;

    @Column(name = "original_name", nullable = false, length = 255)
    private String originalName;

    @Column(name = "blob_name", nullable = false, unique = true, length = 512)
    private String blobName;

    @Column(name = "sha256", nullable = false, length = 64)
    private String sha256;

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Column(name = "size_bytes", nullable = false)
    private long sizeBytes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DocumentStatus status;

    @Column(name = "created_by", nullable = false, length = 200)
    private String createdBy;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected MedicalDocument() {
    }

    public MedicalDocument(UUID id, String originalName, String blobName, String sha256,
                           String contentType, long sizeBytes, DocumentStatus status,
                           String createdBy, Instant createdAt) {
        this.id = id;
        this.originalName = originalName;
        this.blobName = blobName;
        this.sha256 = sha256;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getOriginalName() { return originalName; }
    public String getBlobName() { return blobName; }
    public String getSha256() { return sha256; }
    public String getContentType() { return contentType; }
    public long getSizeBytes() { return sizeBytes; }
    public DocumentStatus getStatus() { return status; }
    public String getCreatedBy() { return createdBy; }
    public Instant getCreatedAt() { return createdAt; }

    public void markReady() {
        this.status = DocumentStatus.READY;
    }

    public void markFailed() {
        this.status = DocumentStatus.FAILED;
    }
}

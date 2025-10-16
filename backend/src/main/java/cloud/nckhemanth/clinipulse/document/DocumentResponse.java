package cloud.nckhemanth.clinipulse.document;

import java.time.Instant;
import java.util.UUID;

public record DocumentResponse(
        UUID id,
        String originalName,
        String storageKey,
        String storageUrl,
        long sizeBytes,
        DocumentStatus status,
        Instant createdAt) {

    static DocumentResponse from(MedicalDocument document, String storageUrl) {
        return new DocumentResponse(
                document.getId(),
                document.getOriginalName(),
                document.getBlobName(),
                storageUrl,
                document.getSizeBytes(),
                document.getStatus(),
                document.getCreatedAt());
    }
}

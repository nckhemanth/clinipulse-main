package cloud.nckhemanth.clinipulse.document;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, UUID> {
    boolean existsBySha256(String sha256);
}

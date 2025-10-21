package cloud.nckhemanth.clinipulse.document;

public interface DocumentStorage {
    void store(String blobName, byte[] content, String contentType);

    void delete(String blobName);

    String location(String blobName);
}

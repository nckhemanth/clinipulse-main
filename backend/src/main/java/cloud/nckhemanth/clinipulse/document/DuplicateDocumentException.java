package cloud.nckhemanth.clinipulse.document;

public class DuplicateDocumentException extends RuntimeException {

    public DuplicateDocumentException(String filename) {
        super("A document with the same content already exists: " + filename);
    }
}

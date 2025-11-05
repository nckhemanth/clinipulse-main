package cloud.nckhemanth.clinipulse.document;

public class DocumentIndexingException extends RuntimeException {

    public DocumentIndexingException(String filename, Throwable cause) {
        super("The document was stored but could not be indexed: " + filename, cause);
    }
}

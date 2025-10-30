package cloud.nckhemanth.clinipulse.document;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@Component
public class PdfDocumentValidator {

    static final long MAX_DOCUMENT_BYTES = 25L * 1024 * 1024;
    private static final byte[] PDF_SIGNATURE = "%PDF-".getBytes(StandardCharsets.US_ASCII);

    public void validate(String filename, byte[] content) {
        if (filename == null || !filename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF documents are accepted");
        }
        if (content.length == 0) {
            throw new IllegalArgumentException("The document is empty");
        }
        if (content.length > MAX_DOCUMENT_BYTES) {
            throw new IllegalArgumentException("The document exceeds the 25 MB limit");
        }
        if (content.length < PDF_SIGNATURE.length
                || !Arrays.equals(PDF_SIGNATURE, Arrays.copyOf(content, PDF_SIGNATURE.length))) {
            throw new IllegalArgumentException("The uploaded file is not a valid PDF");
        }
    }
}

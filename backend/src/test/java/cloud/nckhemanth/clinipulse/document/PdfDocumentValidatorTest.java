package cloud.nckhemanth.clinipulse.document;

import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PdfDocumentValidatorTest {

    private final PdfDocumentValidator validator = new PdfDocumentValidator();

    @Test
    void acceptsPdfSignature() {
        validator.validate("report.pdf", "%PDF-1.7\ncontent".getBytes(StandardCharsets.US_ASCII));
    }

    @Test
    void rejectsRenamedNonPdfContent() {
        assertThatThrownBy(() -> validator.validate(
                "report.pdf",
                "plain text".getBytes(StandardCharsets.US_ASCII)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("The uploaded file is not a valid PDF");
    }
}

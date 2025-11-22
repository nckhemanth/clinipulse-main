package cloud.nckhemanth.clinipulse.chat;

import cloud.nckhemanth.clinipulse.document.MedicalDocumentService;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final MedicalRagService rag;
    private final MedicalDocumentService documents;

    public ChatController(MedicalRagService rag, MedicalDocumentService documents) {
        this.rag = rag;
        this.documents = documents;
    }

    @PostMapping
    ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        MedicalRagService.RagAnswer answer = rag.ask(request.message());
        long totalDocuments = documents.count();
        int relevantCount = answer.relevantDocuments().size();
        return new ChatResponse(
                answer.content(),
                answer.relevantDocuments(),
                new Insights(
                        totalDocuments,
                        relevantCount,
                        String.format("%.2f", answer.duration().toMillis() / 1000.0),
                        relevantCount == 0 ? "low" : "context-grounded",
                        relevantCount + " of " + totalDocuments + " documents",
                        List.of()),
                Instant.now());
    }

    record ChatRequest(
            @NotBlank @Size(max = 4000) String message,
            @JsonProperty("session_id") String sessionId) {}

    record ChatResponse(
            String response,
            @JsonProperty("relevant_docs") List<String> relevantDocuments,
            Insights insights,
            Instant timestamp) {}

    record Insights(
            @JsonProperty("total_documents") long totalDocuments,
            @JsonProperty("relevant_docs_count") int relevantDocumentsCount,
            @JsonProperty("response_time") String responseTime,
            @JsonProperty("confidence_score") String confidenceScore,
            @JsonProperty("document_coverage") String documentCoverage,
            @JsonProperty("medical_keywords") List<String> medicalKeywords) {}
}

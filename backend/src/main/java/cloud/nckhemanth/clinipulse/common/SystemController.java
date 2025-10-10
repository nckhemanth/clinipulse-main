package cloud.nckhemanth.clinipulse.common;

import cloud.nckhemanth.clinipulse.document.MedicalDocumentService;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
public class SystemController {

    private final MedicalDocumentService documents;

    public SystemController(MedicalDocumentService documents) {
        this.documents = documents;
    }

    @GetMapping("/health")
    HealthResponse health() {
        return new HealthResponse("healthy", "clinipulse-api", Instant.now());
    }

    @GetMapping("/api/analytics")
    AnalyticsResponse analytics(
            @RequestParam(name = "session_id", defaultValue = "default") String sessionId) {
        long count = documents.count();
        return new AnalyticsResponse(count, 0, count > 0, false, List.of(), sessionId);
    }

    @GetMapping("/api/ai-status")
    AiStatus aiStatus() {
        return new AiStatus(true);
    }

    record HealthResponse(String status, String service, Instant timestamp) {}

    record AnalyticsResponse(
            @JsonProperty("document_count") long documentCount,
            @JsonProperty("message_count") long messageCount,
            @JsonProperty("vectorstore_ready") boolean vectorStoreReady,
            @JsonProperty("email_configured") boolean emailConfigured,
            @JsonProperty("recent_messages") List<Object> recentMessages,
            @JsonProperty("session_id") String sessionId) {}

    record AiStatus(@JsonProperty("ai_enabled") boolean aiEnabled) {}
}

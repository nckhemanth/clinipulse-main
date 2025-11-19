package cloud.nckhemanth.clinipulse.chat;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
public class MedicalRagService {

    private static final String SYSTEM_PROMPT = """
            You are CliniPulse, a medical-document assistant. Answer only from the retrieved
            clinical context. Clearly say when the documents do not support an answer. Do not
            diagnose, prescribe, or replace a licensed clinician. Keep protected health
            information out of unnecessary detail.
            """;

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public MedicalRagService(ChatClient.Builder builder, VectorStore vectorStore) {
        this.vectorStore = vectorStore;
        this.chatClient = builder
                .defaultSystem(SYSTEM_PROMPT)
                .defaultAdvisors(QuestionAnswerAdvisor.builder(vectorStore).build())
                .build();
    }

    public RagAnswer ask(String question) {
        Instant startedAt = Instant.now();
        SearchRequest search = SearchRequest.builder()
                .query(question)
                .topK(5)
                .similarityThreshold(0.6)
                .build();
        List<Document> context = vectorStore.similaritySearch(search);
        String response = chatClient.prompt().user(question).call().content();
        Duration duration = Duration.between(startedAt, Instant.now());
        List<String> filenames = context.stream()
                .map(document -> String.valueOf(document.getMetadata().getOrDefault("filename", "Medical document")))
                .distinct()
                .toList();
        return new RagAnswer(response, filenames, duration);
    }

    public record RagAnswer(String content, List<String> relevantDocuments, Duration duration) {}
}

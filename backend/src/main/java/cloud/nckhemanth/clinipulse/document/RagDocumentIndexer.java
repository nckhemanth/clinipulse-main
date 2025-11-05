package cloud.nckhemanth.clinipulse.document;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class RagDocumentIndexer {

    private final VectorStore vectorStore;
    private final TokenTextSplitter splitter = new TokenTextSplitter();

    public RagDocumentIndexer(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public int index(UUID documentId, String filename, byte[] pdf) {
        ByteArrayResource resource = new ByteArrayResource(pdf) {
            @Override
            public String getFilename() {
                return filename;
            }
        };

        List<Document> pages = new PagePdfDocumentReader(resource).get();
        List<Document> chunks = splitter.apply(pages).stream()
                .map(chunk -> chunk.mutate()
                        .metadata("documentId", documentId.toString())
                        .metadata("filename", filename)
                        .build())
                .toList();
        vectorStore.add(chunks);
        return chunks.size();
    }

    public void delete(UUID documentId) {
        vectorStore.delete("documentId == '" + documentId + "'");
    }
}

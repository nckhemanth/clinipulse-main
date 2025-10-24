package cloud.nckhemanth.clinipulse.document;

import cloud.nckhemanth.clinipulse.config.StorageProperties;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobContainerClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;

@Component
public class AzureBlobDocumentStorage implements DocumentStorage {

    private final BlobContainerClient container;

    public AzureBlobDocumentStorage(StorageProperties properties) {
        this.container = new BlobContainerClientBuilder()
                .connectionString(properties.connectionString())
                .containerName(properties.container())
                .buildClient();
        this.container.createIfNotExists();
    }

    @Override
    public void store(String blobName, byte[] content, String contentType) {
        BlobClient blob = container.getBlobClient(blobName);
        blob.upload(new ByteArrayInputStream(content), content.length, true);
        blob.setHttpHeaders(new BlobHttpHeaders().setContentType(contentType));
    }

    @Override
    public void delete(String blobName) {
        container.getBlobClient(blobName).deleteIfExists();
    }

    @Override
    public String location(String blobName) {
        return container.getBlobClient(blobName).getBlobUrl();
    }
}

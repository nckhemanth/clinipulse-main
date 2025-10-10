package cloud.nckhemanth.clinipulse.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("clinipulse.storage")
public record StorageProperties(String connectionString, String container) {
}

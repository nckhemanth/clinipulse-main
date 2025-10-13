CREATE TABLE medical_documents (
    id UUID PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    blob_name VARCHAR(512) NOT NULL UNIQUE,
    sha256 VARCHAR(64) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_by VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_medical_documents_created_at
    ON medical_documents (created_at DESC);

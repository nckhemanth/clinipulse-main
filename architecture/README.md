# CliniPulse Architecture

This package explains how the clinical workspace, Spring Boot API, storage services, and retrieval pipeline fit together.

![CliniPulse system architecture](diagrams/system-architecture.svg)

## Read in this order

1. [High-level design](HLD.md) — boundaries, responsibilities, data ownership, security, and operations.
2. [Primary sequence](SEQUENCE.md) — PDF ingestion and grounded clinical question answering.
3. [System diagram source](diagrams/system-architecture.dot) — editable Graphviz source for the picture above.
4. [Sequence diagram source](diagrams/document-rag-sequence.dot) — editable Graphviz source for the runtime flow.

## Code map

| Area | Implementation |
|---|---|
| Clinical workspace | `frontend/app`, `frontend/components`, `frontend/lib/api.ts` |
| REST boundary | `backend/.../document/MedicalDocumentController.java`, `backend/.../chat/ChatController.java` |
| Document lifecycle | `MedicalDocumentService`, `PdfDocumentValidator`, `AzureBlobDocumentStorage` |
| Retrieval pipeline | `RagDocumentIndexer`, `MedicalRagService` |
| Security | `SecurityConfiguration`, OAuth 2.0 JWT scopes, CORS configuration |
| Metadata | PostgreSQL entity/repository plus Flyway migration |
| Local topology | `compose.yaml` |

The diagrams describe the implemented stack; production HIPAA compliance still depends on organizational controls, managed identity, key management, audit retention, monitoring, and signed service agreements.


# CliniPulse AI

CliniPulse AI is a secure medical-document intelligence platform for clinical report analysis and retrieval-augmented question answering. The application combines a Spring Boot API, a React interface, Azure Blob Storage, PostgreSQL, ChromaDB, and an OpenAI-compatible Llama endpoint.

## Architecture

- **Backend:** Java 21, Spring Boot, Spring Security, Spring Data JPA, and Spring AI
- **Frontend:** React, Next.js, and TypeScript
- **Application data:** PostgreSQL with Flyway migrations
- **Document storage:** Azure Blob Storage (Azurite for local development)
- **Retrieval:** PDF parsing, token-aware chunking, embeddings, and ChromaDB through Spring AI
- **Inference:** OpenAI-compatible Llama endpoint suitable for an Azure GPU deployment
- **Packaging:** production multi-stage Docker images and Docker Compose

The application validates PDF content, records SHA-256 integrity metadata, stores source documents in Azure Blob Storage, and indexes document chunks in ChromaDB. The medical assistant retrieves relevant chunks before generating a grounded response and clearly instructs the model not to diagnose or prescribe.

The security design uses OAuth 2.0 JWT validation, scope-based authorization, restricted CORS, upload validation, document hashing, audit metadata, and PHI-aware prompting. Production compliance also requires organizational policies, access reviews, agreements, encryption/key-management configuration, monitoring, and incident-response controls.

## Local development

Copy `.env.example` to `.env`, then start the full application:

```bash
docker compose up --build
```

The interface is available at `http://localhost:3000`, and the API health endpoint is at `http://localhost:8080/health`.

For development without containers:

```bash
cd backend
./mvnw spring-boot:run

cd ../frontend
npm ci
npm run dev
```

Set `SECURITY_ENABLED=false` only for local development. Authentication must remain enabled in deployed environments.

## Verification

```bash
cd backend && ./mvnw test
cd ../frontend && npm run lint && npm run build
```

# AI Contract Management System — Architecture & Documentation

Comprehensive system documentation covering both **Non-Technical (Business, Product, and Functional)** and **Technical (Software Architecture, Data Flow, AI/RAG Pipeline, Database, and API Specification)** perspectives.

---

# Table of Contents
1. [Part I: Non-Technical Documentation](#part-i-non-technical-documentation)
   - [1. Executive Summary & Vision](#1-executive-summary--vision)
   - [2. Problems Solved & Business Value](#2-problems-solved--business-value)
   - [3. Key Features & User Workflows](#3-key-features--user-workflows)
   - [4. Target Audience & Business Use Cases](#4-target-audience--business-use-cases)
   - [5. Security, Privacy & Data Compliance](#5-security-privacy--data-compliance)
2. [Part II: Technical Architecture](#part-ii-technical-architecture)
   - [6. High-Level Architecture Diagram](#6-high-level-architecture-diagram)
   - [7. Frontend Architecture](#7-frontend-architecture)
   - [8. Backend Architecture & Service Layer](#8-backend-architecture--service-layer)
   - [9. Database & Vector Storage (pgvector)](#9-database--vector-storage-pgvector)
   - [10. AI & RAG Engine (LangChain + LangGraph + Groq)](#10-ai--rag-engine-langchain--langgraph--groq)
   - [11. End-to-End Execution Flows](#11-end-to-end-execution-flows)
   - [12. API Reference & Endpoint Specifications](#12-api-reference--endpoint-specifications)
   - [13. Environment Configuration & Operational Guide](#13-environment-configuration--operational-guide)

---

# Part I: Non-Technical Documentation

## 1. Executive Summary & Vision

The **AI Contract Management System (ContractAI)** is an enterprise-grade legal intelligence platform designed to transform complex, static legal documents (PDF agreements, NDAs, master services agreements, amendments, and vendor contracts) into searchable, interactive, and structured digital assets.

By marrying high-speed **Large Language Models (LLMs)** with **Retrieval-Augmented Generation (RAG)** and semantic vector search, ContractAI enables business professionals, procurement managers, and legal teams to:
- Instantly extract critical contract terms, renewal dates, and governing obligations.
- Automatically identify liabilities, ambiguous clauses, and high-risk terms.
- Query agreements in natural human language and receive factual answers with exact citations.
- Set automated reminders for renewal windows, notice periods, and expiration dates.

---

## 2. Problems Solved & Business Value

### The Traditional Contract Problem
1. **Unread & Forgotten Commitments**: Contracts are saved in static PDF silos, leading to missed auto-renewal deadlines and expensive unplanned extensions.
2. **Hidden Liability Traps**: Commercial agreements often hide aggressive indemnity clauses, unlimited liability terms, and strict penalty conditions that standard teams overlook.
3. **Slow Legal Turnaround**: Finding specific answers (e.g., *"What is our termination notice period?"* or *"Is there a non-compete clause?"*) requires hours of manual legal review.
4. **Disorganized Workflows**: Scattered spreadsheets and calendar invites fail to centralize contractual compliance across departments.

### The ContractAI Solution & ROI
| Problem | Traditional Way | ContractAI Solution |
| :--- | :--- | :--- |
| **Contract Ingestion** | Manual re-keying of contract metadata | Drag-and-drop PDF upload with automatic OCR/text extraction and vectorization |
| **Risk Detection** | Tedious manual reading by legal specialists | Automated AI categorization (LOW, MEDIUM, HIGH) with specific clause warnings |
| **Agreement Q&A** | Emailing legal counsel and waiting days | Real-time AI Assistant answering questions in seconds with exact source chunks |
| **Deadline Tracking** | Unsynchronized spreadsheets and missed renewals | Centralized dashboard with status pills (`ACTIVE`, `EXPIRING`, `EXPIRED`) and customizable datetime alerts |
| **Operational Speed** | Days to review a 30-page agreement | Instant executive summary and clause breakdown in under 10 seconds |

---

## 3. Key Features & User Workflows

### 1. Unified Contract Dashboard
- **Dynamic KPI Cards**: Visual metrics tracking Total Contracts, Active Contracts, Contracts Expiring Soon (within 30 days), and Expired Agreements.
- **Drag-and-Drop Ingestion**: Frictionless upload card supporting agreements up to 10MB.
- **Instant Search & Status Filtering**: Real-time filtering by keyword and status (`ALL`, `ACTIVE`, `EXPIRING`, `EXPIRED`).

### 2. Deep Contract Inspection Workspace
- **Contract Information**: Quick-reference cards displaying agreement type, start date, expiry date, and status.
- **Executive Summary**: Plain-English AI summary capturing the fundamental intent and obligations of the agreement.
- **Clause Extraction**: Automatic parsing of key clauses (e.g., Confidentiality, Termination, Indemnification, Governing Law).
- **Risk Assessment**: Clear color-coded severity cards (Green = Low Risk, Amber = Medium Risk, Red = High Risk) detailing specific contractual hazards.

### 3. Dedicated AI RAG Assistant Panel
- Fixed interactive side panel connected directly to the active contract.
- Natural language chat allowing users to ask specific questions:
  - *"What are the payment terms and late penalties?"*
  - *"Can either party terminate for convenience?"*
  - *"What are the data protection warranties?"*
- Factual verification: Responses cite the exact contract chunk retrieved, preventing AI hallucinations.

### 4. Automated Date Reminders
- Schedule review alerts and notice dates directly from the contract workspace.
- Centralized reminder hub tracking pending and executed notifications.

---

## 4. Target Audience & Business Use Cases

1. **In-House Legal Teams & General Counsel**:
   - Accelerate contract triage and surface non-standard terms before signing.
2. **Procurement & Vendor Management**:
   - Monitor vendor expiry dates, SLA benchmarks, and price escalations.
3. **Sales Operations & Commercial Leaders**:
   - Verify customer commitments, liability caps, and renewal milestones without bottlenecking legal.
4. **Founders & Small Business Executives**:
   - Gain enterprise-level contract intelligence without the cost of a full-time legal department.

---

## 5. Security, Privacy & Data Compliance

- **Isolated Tenant Data**: Every contract, chunk, vector embedding, and reminder is scoped strictly to the authenticated `userId`.
- **Stateless PDF Processing**: Uploaded PDF files are processed directly in-memory and converted into vectorized text chunks. Static files are not permanently exposed via public URLs.
- **Secure Authentication**: Encrypted password hashing with `bcryptjs` (salt rounds: 12) and cryptographically signed JWT tokens with 7-day expiration.
- **Responsible AI Guardrails**: System prompts enforce strict grounding, preventing the LLM from fabricating terms or providing unauthorized legal counsel.

---

# Part II: Technical Architecture

## 6. High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["Frontend Client (React 19 + Vite + Tailwind v4)"]
        UI["UI Layer: ThemeProvider & Layout"]
        Pages["Pages: Dashboard | ContractDetails | Reminders | Auth"]
        Chat["AI Assistant Panel (RAG Interaction)"]
        APIClient["Fetch API Client (JWT Bearer Auth)"]
    end

    subgraph API["Backend Server (Node.js + Express)"]
        AuthCtrl["Auth Controller (/api/auth)"]
        ContractCtrl["Contract Controller (/api/contracts)"]
        AnalysisCtrl["Analysis Controller (/api/contracts/:id/analyze)"]
        AICtrl["AI RAG Controller (/api/contracts/:id/ask)"]
        ReminderCtrl["Reminder Controller (/api/reminders)"]
    end

    subgraph Services["Services & AI Processing Layer"]
        PDFSvc["PDF Service (pdf-parse)"]
        ChunkSvc["Chunk Service (Character Sliding Window)"]
        EmbedSvc["FastEmbed (BAAI/bge-small-en-v1.5 - 384 Dim)"]
        AnalysisSvc["Groq LLM Analysis (openai/gpt-oss-120b)"]
        LangGraph["LangGraph StateGraph (4-Stage RAG Pipeline)"]
    end

    subgraph Storage["Persistence Layer (PostgreSQL + pgvector)"]
        UserTable[("User Table")]
        ContractTable[("Contract Table")]
        ChunkTable[("ContractChunk + 384d Vector")]
        AnalysisTable[("ContractAnalysis (JSONB)")]
        ReminderTable[("Reminder Table")]
    end

    UI --> Pages --> Chat
    Pages --> APIClient
    Chat --> APIClient
    APIClient -->|HTTP / JSON + JWT| API

    ContractCtrl --> PDFSvc --> ChunkSvc --> EmbedSvc
    EmbedSvc -->|pgvector INSERT| ChunkTable
    AnalysisCtrl --> AnalysisSvc -->|JSON Upsert| AnalysisTable
    AICtrl --> LangGraph
    LangGraph -->|1. Generate Query Vector| EmbedSvc
    LangGraph -->|2. Cosine Similarity Query <=>| ChunkTable
    LangGraph -->|3. Groq LLM Generation| AnalysisSvc

    API --> UserTable
    API --> ContractTable
    API --> ReminderTable
```

---

## 7. Frontend Architecture

The frontend is engineered with **React 19**, **Vite 8**, and **Tailwind CSS v4**, using the open-source **Lilex** typography.

### Component Hierarchy
```
src/
├── context/
│   └── ThemeContext.jsx        # Dark/Light theme state, colorScheme sync, localStorage persistence
├── components/
│   ├── Layout.jsx              # Application shell (Desktop sidebar + Header + Responsive content)
│   ├── Sidebar.jsx             # User profile, Workspace routes, status indicators, theme toggle, logout
│   ├── Header.jsx              # Minimal sticky header with mobile menu trigger and user badge
│   ├── ThemeToggle.jsx         # Sun/Moon mode switcher
│   ├── StatusBadge.jsx         # Visual indicator for ACTIVE, EXPIRING, EXPIRED, PENDING, SENT
│   ├── RiskBadge.jsx           # Severity badge for LOW, MEDIUM, HIGH risk levels
│   ├── ContractCard.jsx        # Reusable contract summary card with action triggers
│   ├── DragDropUpload.jsx      # Drag-and-drop PDF upload component with progress feedback
│   └── AIAssistant.jsx         # Sticky right-hand chat panel with RAG status, history, and source chunks
├── pages/
│   ├── Home.jsx                # Marketing landing page with hero and feature showcase
│   ├── Login.jsx               # Centered authentication page
│   ├── Register.jsx            # User registration page
│   ├── Dashboard.jsx           # KPI metrics, upload area, contract listing, search & filtering
│   ├── ContractDetail.jsx      # 3-column workspace: metadata, AI analysis, clauses, risks, Q&A
│   └── Remainder.jsx           # Scheduled contract date reminder management
├── api/
│   ├── api.js                  # Centralized fetch wrapper with automatic JWT header injection
│   ├── auth.api.js             # loginUser, registerUser
│   ├── contract.api.js         # getContracts, getContract, uploadContract, deleteContract, analyze, ask
│   └── remainder.api.js        # getReminders, createReminder, deleteReminder
├── index.css                   # Tailwind v4 configuration, @theme font setup, custom scrollbars
└── App.jsx                     # Browser router, protected route wrapper, theme provider
```

### Design System & Theming Engine
- **Dark Mode (Default)**: Deep charcoal surfaces (`bg-zinc-950`, `bg-zinc-900`), subtle borders (`border-zinc-800`), muted typography (`text-zinc-400`), and electric blue highlights (`bg-blue-600`).
- **Light Mode**: Crisp white and pale zinc surfaces (`bg-zinc-50`, `bg-white`), borders (`border-zinc-200`), dark typography (`text-zinc-900`).
- **Standard Tailwind Class Architecture**: Light mode utilizes clean base classes (e.g., `bg-white text-zinc-900 border-zinc-200`), while dark mode is triggered via the `dark:` prefix (`dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800`).
- **Native Browser Integration**: `root.style.colorScheme` synchronizes native browser date inputs, scrollbars, and select menus.

---

## 8. Backend Architecture & Service Layer

The backend is built with **Node.js (ESM)** and **Express.js**, following clean separation of concerns:

- **Routing Layer** (`routes/`): Declares endpoints, attaches authentication middlewares, and routes requests.
- **Middleware Layer** (`middlewares/`):
  - `auth.middleware.js`: Verifies JWT from the `Authorization: Bearer <token>` header, extracts `req.userId`, and rejects unauthorized calls with HTTP 401.
  - `upload.middleware.js`: Uses `multer` with memory storage (`multer.memoryStorage()`) to handle PDF file buffers without writing unencrypted documents to disk.
- **Controller Layer** (`controllers/`): Handles request validation, error handling, status code responses, and database transactions.
- **Service Layer** (`services/`): Pure business logic encapsulating PDF parsing, text chunking, local vector embeddings, vector searching, and LLM orchestration.

---

## 9. Database & Vector Storage (pgvector)

The persistence tier runs on **PostgreSQL** configured with the **`vector`** extension via **Prisma ORM**.

### Entity-Relationship Model

```mermaid
erDiagram
    User ||--o{ Contract : "owns"
    Contract ||--o| ContractAnalysis : "has"
    Contract ||--o{ ContractChunk : "split into"
    Contract ||--o{ Reminder : "scheduled for"

    User {
        string id PK
        string name
        string email UK
        string passwordHash
        datetime createdAt
    }

    Contract {
        string id PK
        string userId FK
        string title
        string fileUrl
        string type
        datetime startDate
        datetime expiryDate
        enum status "ACTIVE | EXPIRING | EXPIRED"
        datetime createdAt
        datetime updatedAt
    }

    ContractAnalysis {
        string id PK
        string contractId FK,UK
        string summary
        json clauses "array of {name, description}"
        string riskLevel "LOW | MEDIUM | HIGH"
        json risks "array of {title, description}"
        datetime createdAt
        datetime updatedAt
    }

    ContractChunk {
        string id PK
        string contractId FK
        string content
        int chunkIndex
        vector embedding "384-dimensional dense vector"
        datetime createdAt
    }

    Reminder {
        string id PK
        string contractId FK
        datetime reminderDate
        enum status "PENDING | SENT | CANCELLED"
        datetime createdAt
    }
```

### Vector Indexing & Similarity Math
- **Embedding Model**: `BAAI/bge-small-en-v1.5` (via `fastembed`).
- **Dimensionality**: **384 dimensions**.
- **Distance Metric**: Cosine Distance (`<=>` operator in PostgreSQL).
- **Similarity Formula**:
  $$\text{Similarity} = 1 - (\text{embedding} \Leftrightarrow \text{queryEmbedding})$$
- **Vector SQL Execution**:
  ```sql
  SELECT
    id,
    "contractId",
    content,
    "chunkIndex",
    1 - (embedding <=> $2::vector) AS similarity
  FROM "ContractChunk"
  WHERE "contractId" = $1
    AND embedding IS NOT NULL
  ORDER BY embedding <=> $2::vector
  LIMIT $3;
  ```

---

## 10. AI & RAG Engine (LangChain + LangGraph + Groq)

### A. Document Ingestion Pipeline
1. **PDF Extraction**: `pdf-parse` extracts raw text and total page count from the in-memory buffer.
2. **Chunking Engine** (`chunk.service.js`):
   - Chunks text into segments of ~1,000 characters with a 200-character overlap.
   - Prevents clause severance across chunk boundaries.
3. **Local Dense Embeddings** (`embedding.service.js`):
   - Employs ONNX-accelerated FastEmbed (`EmbeddingModel.BGESmallENV15`).
   - Generates 384-dimensional float arrays stored directly in the `ContractChunk` table.

### B. Automated Contract Analysis Engine
- **Model**: `openai/gpt-oss-120b` via `@langchain/groq` (Temperature: 0 for strict determinism).
- **Prompt Architecture**: Enforces structured JSON output matching:
  ```json
  {
    "summary": "Concise summary...",
    "type": "Contract type or Unknown",
    "startDate": "YYYY-MM-DD or null",
    "expiryDate": "YYYY-MM-DD or null",
    "clauses": [{ "name": "...", "description": "..." }],
    "riskLevel": "LOW | MEDIUM | HIGH",
    "risks": [{ "title": "...", "description": "..." }]
  }
  ```
- **Automatic Status Inference**:
  - If `expiryDate < now` $\rightarrow$ `status = "EXPIRED"`
  - If `daysUntilExpiry <= 30` $\rightarrow$ `status = "EXPIRING"`
  - Otherwise $\rightarrow$ `status = "ACTIVE"`

### C. LangGraph Interactive RAG Q&A Workflow

The RAG pipeline is implemented as a state machine using `@langchain/langgraph`:

```mermaid
flowchart LR
    START([User Question]) --> retrieveChunks[1. retrieveChunksNode]
    retrieveChunks --> checkRelevance[2. checkRelevanceNode]
    checkRelevance --> buildContext[3. buildContextNode]
    buildContext --> generateAnswer[4. generateAnswerNode]
    generateAnswer --> END([Verified Answer + Sources])
```

1. **`retrieveChunksNode`**: Embeds the user question (384d vector) and executes top-5 cosine search on `ContractChunk` records belonging to the contract.
2. **`checkRelevanceNode`**: Enforces a strict relevance filter:
   $$\text{similarity} \ge 0.45$$
   If no chunks meet the threshold, context is cleared to avoid hallucinations.
3. **`buildContextNode`**: Assembles numbered chunk snippets (`[Contract Chunk 1] ... [Contract Chunk 2]`).
4. **`generateAnswerNode`**: Invokes the Groq LLM with strict grounding constraints:
   - *"Answer using ONLY the provided context."*
   - *"If not present, state that information was not found."*
   - *"Do not provide legal advice."*

---

## 11. End-to-End Execution Flows

### Contract Upload & Ingestion Flow
```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (DragDropUpload)
    participant API as Express API (/api/contracts/upload)
    participant PDF as PDF Service
    participant Embed as FastEmbed
    participant DB as PostgreSQL (pgvector)

    User->>FE: Selects or Drops PDF (max 10MB)
    FE->>API: POST /api/contracts/upload (Multipart/form-data)
    API->>API: Verify JWT Auth
    API->>PDF: extractTextFromPdf(buffer)
    PDF-->>API: Returns raw text + page count
    API->>API: createChunks(text, 1000, 200)
    API->>DB: INSERT into Contract
    API->>DB: INSERT ContractChunk records
    API->>Embed: generateEmbeddings(chunks)
    Embed-->>API: Returns 384d Float vectors
    API->>DB: UPDATE ContractChunk SET embedding = $vector
    API-->>FE: 201 Created (contract ID, pages, chunks count)
    FE-->>User: Visual success & dashboard refresh
```

### AI RAG Question & Answer Flow
```mermaid
sequenceDiagram
    actor User
    participant FE as AIAssistant Panel
    participant API as Express API (/api/contracts/:id/ask)
    participant LG as LangGraph RAG Graph
    participant Embed as FastEmbed
    participant DB as pgvector
    participant Groq as Groq LLM (gpt-oss-120b)

    User->>FE: "What is the penalty for late termination?"
    FE->>API: POST /api/contracts/:id/ask { question }
    API->>LG: contractRagGraph.invoke({ question, contractId })
    LG->>Embed: generateEmbedding(question)
    Embed-->>LG: 384d Query Vector
    LG->>DB: Cosine Search (<=> operator, topK: 5)
    DB-->>LG: Matching chunks + similarity scores
    LG->>LG: Filter chunks (similarity >= 0.45)
    LG->>Groq: Generate answer grounded in filtered context
    Groq-->>LG: Grounded answer text
    LG-->>API: { answer, sources }
    API-->>FE: 200 OK { answer, sources }
    FE-->>User: Renders assistant bubble + cited chunk references
```

---

## 12. API Reference & Endpoint Specifications

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No | `{ name, email, password }` | `{ success, token, user }` |
| `POST` | `/api/auth/login` | Authenticate user & get JWT | No | `{ email, password }` | `{ success, token, user }` |

### Contract Management Endpoints
| Method | Endpoint | Description | Auth Required | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/contracts` | Fetch all user contracts | Yes | None | `{ success, count, contracts[] }` |
| `GET` | `/api/contracts/:id` | Fetch single contract with analysis & chunks | Yes | None | `{ success, contract }` |
| `POST` | `/api/contracts/upload` | Upload & vectorize PDF contract | Yes | `multipart/form-data` (`file`) | `{ success, contract }` |
| `DELETE` | `/api/contracts/:id` | Delete contract and associated data | Yes | None | `{ success, message }` |

### AI Analysis & RAG Endpoints
| Method | Endpoint | Description | Auth Required | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/contracts/:id/analyze` | Run deep AI clause & risk analysis | Yes | None | `{ success, contract, analysis }` |
| `POST` | `/api/contracts/:id/ask` | Ask natural language question via RAG | Yes | `{ question: string }` | `{ success, answer, sources[] }` |

### Reminder Endpoints
| Method | Endpoint | Description | Auth Required | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/reminders` | Fetch all scheduled reminders | Yes | None | `{ success, reminders[] }` |
| `POST` | `/api/reminders/contracts/:id/reminders` | Schedule reminder for contract | Yes | `{ reminderDate: ISO string }` | `{ success, reminder }` |
| `DELETE` | `/api/reminders/:id` | Delete scheduled reminder | Yes | None | `{ success, message }` |

---

## 13. Environment Configuration & Operational Guide

### Backend Environment Variables (`backend/.env`)
```ini
# Server Port
PORT=5000

# PostgreSQL Connection String (must support pgvector)
DATABASE_URL="postgresql://username:password@localhost:5432/contract_ai?schema=public"

# JWT Secret Key for token signing
JWT_SECRET="your-super-secure-jwt-secret-key"

# Groq Cloud API Key for LLM Inference
GROQ_API_KEY="gsk_your_groq_api_key_here"
```

### Troubleshooting & Common Gotchas
1. **Vector Dimension Mismatch (`Code: 22000`)**:
   - `pgvector` requires exact dimension alignment.
   - Model `BAAI/bge-small-en-v1.5` outputs **384 dimensions**.
   - Ensure the database column is defined as `vector(384)`.
   - When using batch embeddings in FastEmbed, ensure batch iteration yields individual 384-element arrays and not a flattened multi-chunk buffer.
2. **PostgreSQL pgvector Extension**:
   - Ensure the extension is enabled in PostgreSQL:
     ```sql
     CREATE EXTENSION IF NOT EXISTS vector;
     ```
3. **CORS Configuration**:
   - Backend `cors()` must permit the Vite frontend origin (`http://localhost:5173` or `http://localhost:5174`).
4. **Tailwind CSS v4 Dark Mode**:
   - Tailwind v4 uses standard base classes for light mode and `@custom-variant dark (&:where(.dark, .dark *));` for `.dark` styling. Never use unsupported prefixes like `light:`.

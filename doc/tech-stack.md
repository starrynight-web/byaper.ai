# ⚙️ BYAPAR AI — UPDATED TECH STACK (v1.1)

AI Growth & Operations System for Bangladeshi SMEs

---

# 1. FRONTEND (USER DASHBOARD LAYER)

### Core Stack

* Next.js 16.2.6 (App Router, latest stable)
* React 19.x
* TypeScript 5.x
* Tailwind CSS v4
* Shadcn/UI (latest registry-based system)
* Zustand (UI state only)
* TanStack Query v5+ (server state)

---

### Frontend Architecture Rules

* Fully **workspace-aware UI**
* All API calls include `business_id`
* Role-based UI rendering (Owner / Manager / Viewer)
* No global user-only views

---

### Hosting (FREE MVP)

* Vercel Free Tier (primary)
* GitHub Pages fallback (static demo fallback)

---

# 2. BACKEND (CORE SYSTEM ENGINE)

### Core Stack

* FastAPI (latest stable)
* Python 3.12+
* Pydantic v2
* Uvicorn (ASGI server)

---

### Architecture Pattern

* Multi-tenant API (business_id scoped)
* Role-based access control (RBAC middleware)
* Event-driven automation system

---

### Hosting (FREE MVP)

* Hugging Face Spaces (Docker) — PRIMARY
* Railway Free Tier — BACKUP
* Render Free Tier — FALLBACK

---

# 3. AUTHENTICATION & IDENTITY SYSTEM (NEW CORE LAYER)

### Authentication

* Google OAuth 2.0 (primary login method)
* Supabase Auth (session + JWT management)

---

### Identity Model

* Google OAuth → User Identity
* Supabase → Auth Session
* Internal DB → User Profile + Roles

---

### Workspace System

* Multi-business support (critical SaaS layer)
* Every request scoped by:

  * user_id
  * business_id

---

# 4. AI ENGINE (LOCAL-FIRST, FREE MVP)

### Local LLM Runtime

* Ollama (local machine execution)

---

### Models (FREE-FIRST STACK)

* Llama 3.1 8B (primary content generation)
* Mistral 7B (messaging + replies)
* Phi-3 Mini (fallback ultra-fast model)

---

### AI Framework Layer

* Minimal LangChain usage (only if needed)
* Prompt-template-first architecture (preferred)

---

### AI Design Rule

* NO external LLM dependency in MVP path
* AI must work offline locally for demo safety

---

# 5. IMAGE GENERATION SYSTEM (FREE + FALLBACK SAFE)

### Primary (FREE)

* Pollinations.ai API (no key required)

---

### Backup Layers

* Hugging Face Inference API (free tier models)
* Stable Diffusion public endpoints (rate limited)

---

### Critical Strategy

* Pre-generate image cache in Supabase Storage
* Never rely on real-time generation during demo
* Fallback to stored images if API fails

---

# 6. DATABASE & STORAGE LAYER

### Core Database

* Supabase PostgreSQL (FREE tier MVP)

---

### Data Model Scope

* users
* businesses (workspaces)
* roles
* posts
* messages
* reviews
* automations
* analytics events

---

### Extensions

* pgvector (optional, low usage only)

---

### File Storage

* Supabase Storage (images, media assets)

---

# 7. QUEUE & AUTOMATION ENGINE

### Stack

* Upstash Redis (FREE tier)
* Upstash QStash (FREE tier)

---

### Responsibilities

* Scheduled posts
* Messenger reply queue
* Review response pipeline
* GBP automation jobs

---

### Design Rule

* All automation is async + retry-safe
* No blocking API calls in UI flow

---

# 8. SOCIAL MEDIA & EXTERNAL INTEGRATIONS

### Meta Ecosystem

* Meta Graph API (Facebook Pages)
* Messenger Platform API (webhooks)

---

### Google Ecosystem

* Google Business Profile API (reviews + profile data)

---

### Integration Rule

* All APIs are OPTIONAL at runtime
* System must support “simulation mode”

---

### WhatsApp

* NOT included in MVP (post-launch only)

---

# 9. DEVOPS & OBSERVABILITY (FREE MVP)

### CI/CD

* GitHub Actions

---

### Hosting Observability

* Vercel Analytics (free tier)
* Basic logs via FastAPI stdout

---

### Error Tracking (optional)

* Sentry Free Tier

---

# 10. SYSTEM ARCHITECTURE (FINAL MVP FLOW)

```text id="byapar_flow_final"
Google OAuth Login
        ↓
Supabase Session Created
        ↓
Workspace Selection (business_id)
        ↓
Next.js Dashboard (workspace-scoped)
        ↓
User Action:
   → Generate Post
        ↓
Ollama (local AI)
        ↓
Pollinations AI (image)
        ↓
Supabase storage + DB save
        ↓
Queue (Upstash)
        ↓
Meta / Google API OR Simulation Mode
        ↓
Dashboard Update
```

---

# 11. CRITICAL SYSTEM RULES

### Rule 1 — Workspace Isolation

Everything must be scoped:

* user_id
* business_id

---

### Rule 2 — Local-first AI

* AI must work without internet dependency

---

### Rule 3 — API Failure Safety

Every external API must have:

* fallback response
* cached output
* simulation mode

---

### Rule 4 — Demo Stability Priority

System must NEVER break during presentation

---

# 12. FINAL ARCHITECTURE POSITIONING

This is no longer:

> “AI tool for small businesses”

It is:

> “Multi-tenant AI automation SaaS with local-first intelligence + cloud execution layer”

---

# 13. KEY STRATEGIC WARNING (IMPORTANT)

Your biggest risk is NOT stack complexity.

It is:

> real-time dependency on external APIs during live demo

So your architecture is correctly designed ONLY if:

* 70% system works offline (Ollama + Supabase)
* 30% is API-enhanced (Meta / Google / image APIs)

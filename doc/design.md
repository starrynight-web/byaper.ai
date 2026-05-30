# 📘 BYAPAR AI — PRODUCT DESIGN DOCUMENT (UPDATED)

AI Growth & Operations System for Bangladeshi SMEs
Version 1.1 — May 2026

---

# 1. AUTHENTICATION & WORKSPACE MODEL (NEW CORE SYSTEM)

This replaces the previous simple login model.

---

## 1.1 Authentication System

### Provider:

* Google OAuth 2.0 (primary login method)

### Identity Layer:

* Supabase Auth handles session management

### What Google provides:

* User identity only (email, name, avatar)

### What system adds:

* Internal user profile
* Business workspace mapping

---

## 1.2 Core Concept: WORKSPACE MODEL

Every user belongs to one or more **Business Workspaces**.

```text
User
  ↓
User Profile
  ↓
Business Workspaces (1 → many)
  ↓
All data scoped per business_id
```

---

## 1.3 Data Isolation Rule (CRITICAL)

Every system component must be scoped by:

> business_id

Applies to:

* Posts
* Messages
* Reviews
* Analytics
* Automations

---

## 1.4 Roles & Permissions (NEW RBAC SYSTEM)

Each user inside a workspace has a role:

| Role    | Permissions                            |
| ------- | -------------------------------------- |
| Owner   | Full control, billing, API connections |
| Manager | Posts, replies, automation control     |
| Viewer  | Analytics only                         |

---

# 2. UPDATED INFORMATION ARCHITECTURE

```text
Google OAuth Login
        ↓
User Session (Supabase)
        ↓
Workspace Selector Page
        ↓
Business Dashboard
   ├── Posts
   ├── Messages
   ├── Reviews
   ├── GBP Manager
   ├── Automations
   ├── Analytics
   ├── Settings
   └── Team (NEW)
```

---

# 3. UPDATED AUTH PAGES

---

## 3.1 LOGIN PAGE (SIMPLIFIED)

### Design:

Single action screen.

### Components:

* Logo: BYAPAR AI
* Button:

  * “Continue with Google”

### Behavior:

* On success → redirect to workspace check

---

## 3.2 WORKSPACE SELECTOR PAGE (NEW CRITICAL PAGE)

### Purpose:

Choose or create business context.

---

### Layout:

#### Section 1: Existing Workspaces

Card list:

Each card shows:

* Business name
* Category (Restaurant / Clinic / etc.)
* Location
* Role badge (Owner / Manager / Viewer)

Button:

* “Enter Workspace”

---

#### Section 2: Create New Business

Button:

* “+ Create New Business”

---

### Behavior:

* Selecting workspace sets active business_id
* All dashboards load under that scope

---

# 4. UPDATED ONBOARDING FLOW

## Step 1: Google Login

→ Identity created

## Step 2: Workspace Creation

→ Business profile created

## Step 3: Business Setup Wizard

* Name
* Category
* Services/Menu
* Tone
* Location

## Step 4: Optional Integrations

* Facebook Page
* Google Business Profile

## Step 5: Dashboard Entry

---

# 5. UPDATED DASHBOARD SYSTEM

No change in UI layout—but now EVERYTHING is scoped.

---

## 5.1 DASHBOARD RULE (NEW)

Every page must always display:

> Active Workspace: [Business Name]

Dropdown allows switching workspace.

---

# 6. NEW TEAM PAGE (RBAC CONTROL PANEL)

## Purpose:

Manage users inside a business.

---

### Layout:

#### Member List

Each row:

* Name
* Email
* Role badge
* Status (Active / Invited)

---

#### Actions:

* Invite member
* Change role
* Remove access

---

### Rules:

* Only Owner can manage roles
* Manager cannot invite new users

---

# 7. UPDATED SYSTEM BEHAVIOR

---

## 7.1 Data Flow Rule

Every request must include:

```text
user_id + business_id
```

No exception.

---

## 7.2 API RULE

Backend must always validate:

* User belongs to business_id
* Role has permission for action

---

## 7.3 SECURITY MODEL

* Google OAuth = identity proof
* Supabase session = authentication state
* business_id = authorization boundary

---

# 8. UPDATED UX FLOW

```text
Login → Google OAuth
        ↓
User Session Created
        ↓
Workspace Check
        ↓
If no business → Onboarding
If multiple → Workspace Selector
        ↓
Dashboard (business-scoped)
```

---

# 9. UPDATED DESIGN PRINCIPLES

Additions:

### 9.1 Workspace-first UI

Every screen assumes:

> “Which business am I working on?”

---

### 9.2 Role-aware UI

Buttons must be hidden based on role:

* Viewer → cannot post
* Manager → cannot change billing

---

### 9.3 Context persistence

Last used workspace must auto-load

---

# 10. CRITICAL ARCHITECTURAL INSIGHT

Your system is no longer:

> “AI tool for SMEs”

It is now:

> “Multi-tenant AI operations platform”

That is a real SaaS architecture.

---

# 11. WHAT THIS FIXES (IMPORTANT)

Before:

* Flat user system
* No scaling structure
* Risk of data mixing between businesses

Now:

* Clean SaaS isolation
* Agency-ready system
* Scalable to thousands of SMEs
* Ready for investors (this matters a lot in CloudCamp)

---

# 12. FINAL WARNING (IMPORTANT)

Your biggest hidden risk now is NOT code.

It is:

> confusing workspace context in UI

If users ever feel:

* “Which business am I in?”
* “Why did this post go to wrong page?”

Your product fails instantly.

So workspace clarity is now your #1 UX priority.

---

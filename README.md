# 🌟 AspAIre – Technical and Functional Specification

---

## 1. Project Overview

### Purpose & Vision

**AspAIre** is an intelligent, AI-powered job search assistant designed to transform how professionals find and secure new roles. It goes beyond aggregating job listings by proactively matching opportunities to each user’s skills, career goals, and preferred locations. By integrating AI summarization, personalized recommendations, and smart search term suggestions, AspAIre reduces job-hunting fatigue and improves the chances of landing the right role.

AspAIre fits into the larger ecosystem under the **sAIgely** brand—your suite of AI-driven tools to enhance work and personal productivity.

---

### Target Audience

- Individual job seekers seeking:
  - Efficient job discovery.
  - Personalized career insights.
  - Tools to streamline applications.
- Future expansions:
  - Demo accounts for showcasing to employers.
  - Multi-user environments for recruiting teams.

---

### Project Scope

- **Phase 1: MVP**
  - Core features for a single user.
  - Focused on practical job search assistance.
- **Late Phase 1**
  - Financial insights and market trends.
- **Phase 2**
  - Integration with premium job boards.
  - Multi-user expansion.

---

## 2. Branding & Identity

### Project Name: **AspAIre**

- Combines:
  - “Aspire” → ambition, growth, forward motion.
  - Embedded “AI” → signals intelligent, modern tech.
- Flexible for personal or commercial branding.
- Feels positive, future-oriented.

---

### Ecosystem Branding

AspAIre is part of the growing **sAIgely** ecosystem:

> sAIgely – Your intelligent AI companion for work and life.  
> **AspAIre** – _Your AI-powered career and job search assistant._

---

### Visual Identity Suggestions

- **Color palette**:
  - Blues/greens for trust and technology.
  - Pops of vibrant colors for energy and ambition.
- **Logo concept**:
  - Subtle AI iconography (nodes, circuits).
  - Upward motion symbolizing career growth.

---

## 3. Features & Functionality

### ✅ Core MVP (Phase 1)

- **Resume Upload & Parsing**
  - Secure file upload (S3)
  - Text extraction and formatting
- **Cover Letter Generation**
  - Tailored per-job using OpenAI
- **Suggested Search Terms**
  - AI parses resume to recommend roles, skills, industries
- **Resume Summary**
  - AI generates concise 2–3 sentence profile summaries
- **Streaming AI Interaction**
  - `interviewChatStream` supports token-based live reply
- **GraphQL & REST Coverage**
  - All OpenAI services available in both
- **Preferences**
  - PostgreSQL-backed storage of user job preferences

---

## 4. Technical Architecture

- **Backend**: Node.js, Yoga (GraphQL), REST routes, OpenAI
- **Frontend**: Next.js (planned integration)
- **Data**:
  - PostgreSQL → user data, preferences
  - MongoDB (planned) → job listings, summaries
  - Blob Storage (S3) → resumes

---

## 5. Security Considerations

- Signed S3 uploads
- Encrypted PostgreSQL data
- Rate-limiting and API key control for OpenAI
- JWT-auth integration (under development)

---

## 6. Third-Party Integrations

- OpenAI
- S3-compatible Blob Storage
- PostgreSQL (via Neon)
- SerpAPI & Remotive (planned ingestion)

---

## 7. Cost Considerations

- OpenAI token usage controlled and stream-limited
- S3/Blob pay-per-storage model
- API rate tiers (SerpAPI, OpenAI)

---

## 8. Deployment & Operations

- Vercel (frontend)
- GitHub Actions (CI/CD)
- Local or Dockerized backend (Node.js)

---

## 9. Future Roadmap

---

### 🧠 AI Personalization & Control

- Support user-defined `customPrompt` overrides for chat interactions.
- Add interview `style` presets:
  - `behavioral`, `technical`, `casual`, etc.
- Persist preferred prompt style in user Preferences.
- Expose and persist `temperature` control in Preferences for OpenAI response tuning.

---

### 💬 Advanced Interview Experience

- Extend `interviewChat` to include:
  - Streaming with user persona injection.
  - Real-time memory model for short-term context.
  - Persistent history thread support.
- Allow users to review, edit, or export chat sessions.

---

### 📊 Resume & Matching Intelligence

- Add `resumeSummary` scoring and AI feedback.
- Provide resume-specific suggestions (keywords, formatting tips).
- Build job fit scoring system:
  - Match resume content against job listings using AI.
  - Rank matches based on relevance.

---

### 📦 Job Search Automation

- Enhance saved search flows with daily auto-runs.
- Store and rank AI-suggested search terms.
- Add context-aware suggestions based on past application behavior.

---

### 🧰 Infrastructure & Monitoring

- Log OpenAI usage per user (tokens, prompts, latency).
- Show estimated API usage and cost projections.
- Create admin dashboard for managing prompt templates and presets.

---

# 🎯 **Summary**

AspAIre stands poised to become an intelligent, user-focused job search assistant—moving beyond keyword searches to deliver genuinely personalized career guidance. Paired with the soon to be released sAIgely, it’s the next step in creating a cohesive suite of AI-powered tools for work and life.

---

# ✅ AspAIre Backend Completion Tracker

Tracks backend system completion across database models, API routes, and GraphQL schema.

---

## 🧱 Relational (PostgreSQL) Tables

| Table              | Status      | Notes                                         |
| ------------------ | ----------- | --------------------------------------------- |
| `users`            | ✅ Complete | User identity/auth                            |
| `preferences`      | ✅ Complete | Search/filter settings                        |
| `resumes`          | ✅ Complete | Resume upload + paste                         |
| `job_listings`     | ❌ Missing  | Aggregated jobs from APIs                     |
| `job_applications` | ❌ Missing  | Pipeline stages: Saved, Applied, Offer        |
| `job_notes`        | ❌ Missing  | Notes and reminders                           |
| `search_queries`   | ❌ Missing  | Stores daily rotated search input             |
| `ai_outputs`       | ❌ Missing  | Optionally caches summaries, bullets, letters |

---

## 🍃 Document (MongoDB) Collections

| Collection         | Status      | Notes                                  |
| ------------------ | ----------- | -------------------------------------- |
| `ai_conversations` | ✅ Partial  | Stores WebSocket-based OpenAI chats    |
| `ai_summaries`     | ❌ Missing  | AI summaries of job posts              |
| `ai_search_terms`  | ❌ Missing  | Suggested search terms by resume       |
| `ai_cover_letters` | ❌ Missing  | Generated letters for caching or audit |
| `job_cache`        | ❌ Optional | Mongo cache of external job posts      |

---

## 🔌 GraphQL Resolvers

### ✅ Implemented

- `user`, `userByAuth`, `createUser`
- `preferences`, `setPreferences`
- `resume`, `resumesByUser`, full CRUD

### ❌ Still Needed

#### Jobs

- [ ] `Query.jobs(userId, filters)`
- [ ] `Mutation.ingestDailyJobs`

#### Applications

- [ ] `Query.pipelineJobs(userId, stage)`
- [ ] `Mutation.saveJob(jobId, stage)`

#### Notes

- [ ] `Query.jobNotes(jobId)`
- [ ] `Mutation.addJobNote(jobId, content)`
- [ ] `Mutation.setReminder(jobId, datetime)`

#### AI

- [ ] `Mutation.generateCoverLetter(jobId)`
- [ ] `Mutation.generateSearchTerms(userId)`
- [ ] `Query.aiSummary(jobId)`

---

## 📡 REST / WebSocket Routes (Confirmed via `.rest`)

| Group          | Status      | Notes                         |
| -------------- | ----------- | ----------------------------- |
| `/user`        | ✅ Complete | Full auth + creation          |
| `/preferences` | ✅ Complete | Reads/writes                  |
| `/resumes`     | ✅ Complete | Upload, paste, edit, delete   |
| `/remotive`    | ✅ Complete | Aggregator tested             |
| `/serpapi`     | ✅ Complete | Aggregator tested             |
| `/openai/ws`   | ✅ Working  | WebSocket AI stream confirmed |

---

## 🗂️ Backend Task Prioritization

### Core MVP (Next Up)

- [ ] `job_listings` table + ingestion persistence
- [ ] `job_applications` + resolvers
- [ ] `job_notes` (notes + reminders)
- [ ] AI-generated summaries + storage in `ai_summaries`
- [ ] Cover letter generation + `ai_cover_letters` storage

### Optional Enhancements

- [ ] Deduplication metadata in `job_cache`
- [ ] Query caching via `search_queries`

---

_Updated: {{TODAY’S DATE}}_

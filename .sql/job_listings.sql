CREATE TABLE aspire.job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT,
  location TEXT,
  job_type TEXT NOT NULL,
  salary TEXT,
  publication_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[],
  job_highlights TEXT[],
  external_id TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('remotive', 'serpapi')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  raw_payload JSONB,
  UNIQUE (
    source,
    external_id
  )
);

INSERT INTO aspire.job_listings (
  user_id,
  title,
  company,
  company_logo,
  location,
  job_type,
  salary,
  publication_date,
  description,
  tags,
  job_highlights,
  external_id,
  source,
  raw_payload
)
VALUES (
  -- your values here
)
ON CONFLICT (source, external_id)
DO UPDATE SET
  salary = EXCLUDED.salary,
  publication_date = EXCLUDED.publication_date,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  job_highlights = EXCLUDED.job_highlights,
  company_logo = EXCLUDED.company_logo,
  raw_payload = EXCLUDED.raw_payload;
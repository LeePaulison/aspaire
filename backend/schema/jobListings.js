export const jobListingsTypeDefs = /* GraphQL */ `
  enum sourceType {
    REMOTIVE
    SERPAPI
  }

  input JobFiltersInput {
    search: String
    location: String
  }

  input JobListingInput {
    user_id: ID!
    title: String!
    company: String!
    company_logo: String
    location: String
    job_type: String!
    salary: String
    publication_date: DateTime!
    description: String!
    tags: [String!]
    job_highlights: [String!]
    external_id: String!
    source: sourceType!
    raw_payload: JSON!
  }

  extend type JobListing {
    id: ID!
    user_id: ID!
    title: String!
    company: String!
    company_logo: String
    location: String
    job_type: String!
    salary: String
    publication_date: String!
    description: String!
    tags: [String!]
    job_highlights: [String!]
    external_id: String!
    source: sourceType!
    created_at: String!
    raw_payload: JSON!
  }

  extend type Mutation {
    createJobListing(input: JobListingInput!): JobListing
    bulkCreateJobListings(jobListings: [JobListingInput!]!): [JobListing!]!
    ingestJobs(userId: ID!, filters: JobFiltersInput!): [JobListing!]!
  }

  extend type Query {
    jobListing(id: ID!): JobListing
    jobListings(limit: Int = 10, offset: Int = 0): [JobListing]
    jobListingsByUser(user_id: ID!, limit: Int = 10, offset: Int = 0): [JobListing]
    jobListingsBySource(source: sourceType!, limit: Int = 10, offset: Int = 0): [JobListing]
    jobListingsByExternalId(external_id: String!, source: sourceType!): JobListing
    jobListingsByCompany(company: String!, limit: Int = 10, offset: Int = 0): [JobListing]
    jobListingsByLocation(location: String!, limit: Int = 10, offset: Int = 0): [JobListing]
  }
`;

export const remotiveTypeDefs = /* GraphQL */ `
  type Job {
    id: ID!
    url: String
    title: String
    company_name: String
    job_type: String
    salary: String
  }

  extend type Query {
    remotiveJobs: [Job!]!
  }
`;

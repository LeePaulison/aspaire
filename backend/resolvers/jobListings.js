import * as JobListings from '../dal/jobListings.js';
import { ingestJobs } from '../actions/ingestJobs.js';

export const jobListingsResolvers = {
  Query: {
    jobListing: (_, { id }) => JobListings.getJobListing(id),
    jobListings: (_, { limit = 10, offset = 0 }) => {
      const safeLimit = Math.max(1, Math.min(limit, 50));
      const safeOffset = Math.max(offset, 0);
      return JobListings.getJobListings(safeLimit, safeOffset);
    },
    jobListingsByUser: (_, { user_id, limit = 10, offset = 0 }) => {
      const safeLimit = Math.max(1, Math.min(limit, 50));
      const safeOffset = Math.max(offset, 0);
      return JobListings.getJobListingsByUserId(user_id, safeLimit, safeOffset);
    },
    jobListingsBySource: (_, { source, limit = 10, offset = 0 }) => {
      const safeLimit = Math.max(1, Math.min(limit, 50));
      const safeOffset = Math.max(offset, 0);
      return JobListings.getJobListingsBySource(source, safeLimit, safeOffset);
    },
    jobListingsByExternalId: (_, { external_id, source }) =>
      JobListings.getJobListingsByExternalId(external_id, source),
    jobListingsByCompany: (_, { company, limit = 10, offset = 0 }) => {
      const safeLimit = Math.max(1, Math.min(limit, 50));
      const safeOffset = Math.max(offset, 0);
      return JobListings.getJobListingsByCompany(company, safeLimit, safeOffset);
    },
    jobListingsByLocation: (_, { location, limit = 10, offset = 0 }) => {
      const safeLimit = Math.max(1, Math.min(limit, 50));
      const safeOffset = Math.max(offset, 0);
      return JobListings.getJobListingsByLocation(location, safeLimit, safeOffset);
    },
  },
  Mutation: {
    createJobListing: (_, { input }) => JobListings.createJobListing(input),
    bulkCreateJobListings: (_, { jobListings }) => JobListings.bulkCreateJobListings(jobListings),
    ingestJobs: (_, { userId, filters }) => ingestJobs(_, { userId, filters }),
  },
};

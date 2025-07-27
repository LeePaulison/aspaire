// backend/resolvers/remotive.js
import fetch from 'node-fetch';

const REMOTIVE_API = 'https://remotive.io/api/remote-jobs';

export const remotiveResolvers = {
  Query: {
    remotiveJobs: async () => {
      try {
        const res = await fetch(REMOTIVE_API);
        const json = await res.json();
        return json.jobs?.slice(0, 3) || [];
      } catch (err) {
        throw new Error(`Remotive fetch failed: ${err.message}`);
      }
    },
  },
};

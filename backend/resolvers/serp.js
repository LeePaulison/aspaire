// backend/resolvers/serpAPI.js
import fetch from 'node-fetch';

const SERP_API_KEY = process.env.SERP_API_KEY;

export const serpResolvers = {
  Query: {
    serpSearch: async (_, { query }) => {
      try {
        const res = await fetch(
          `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}`
        );
        const json = await res.json();
        return json.organic_results?.slice(0, 3) || [];
      } catch (err) {
        throw new Error(`SerpAPI error: ${err.message}`);
      }
    },
  },
};

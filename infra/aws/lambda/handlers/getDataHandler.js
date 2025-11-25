import { fetchLatestProfiles } from '../services/supabaseClient.js';

export const handler = async (event) => {
  if (event.httpMethod && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const limit = Number(event?.queryStringParameters?.limit) || 10;
    const data = await fetchLatestProfiles(limit);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    console.error('[Lambda:getDataHandler] ', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Failed to fetch data', details: error.message }),
    };
  }
};



import { saveJson } from '../services/s3Client.js';

const bucket = process.env.S3_BUCKET;

export const handler = async (event) => {
  if (event.httpMethod && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const payload = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {};
    const key =
      event?.queryStringParameters?.key ||
      `records/${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

    await saveJson({
      bucket,
      key,
      body: payload,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Saved to S3', key }),
    };
  } catch (error) {
    console.error('[Lambda:saveToS3Handler] ', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Failed to save to S3', details: error.message }),
    };
  }
};



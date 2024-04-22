const findConsent = require('./methods/findConsent');

/**
 * Handles an array of URLs.
 * 
 * @param {string[]} urls - The array of URLs to process.
 * @returns {Promise<any>} - A promise that resolves with the processed values.
 */
const handleUrls = async (urls) => {
  console.log('Processing', urls.length, 'URL(s)');
  const values = [];
  for (const url of urls) {
    try {
      const result = await findConsent(url);
      values.push(result);
    } catch (error) {
      console.error(error);
      return ['Error processing URL(s)'];
    }
  }
  return values;
};

/**
 * AWS handler
 * @param {*} event
 * @returns 
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const urls = JSON.parse(event.body);
    const scalpedValues = await handleUrls(urls);
    return {
      statusCode: 200,
      body: JSON.stringify(scalpedValues)
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};
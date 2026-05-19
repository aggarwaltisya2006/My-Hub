module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  async function parseJsonBody(req) {
    if (req.body) return req.body;
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (error) {
          reject(error);
        }
      });
      req.on('error', reject);
    });
  }

  const { text } = await parseJsonBody(request);
  if (!text || typeof text !== 'string') {
    return response.status(400).json({ error: 'Request body must include a text field.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'Gemini API key is not configured on the server.' });
  }

  try {
    const apiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text }]
            }
          ]
        })
      }
    );

    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      return response.status(apiResponse.status).json({ error: data.error || 'Gemini API request failed.', details: data });
    }

    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({ error: 'Failed to reach Gemini API.', details: error.message });
  }
};

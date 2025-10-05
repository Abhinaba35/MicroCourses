const express = require('express');
const router = express.Router();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function limitWords(text, maxWords = 60) {
  if (!text) return '';
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

// POST /api/ai-helper
router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }
  try {
    // Use a supported Gemini model
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
    res.json({ response: limitWords(aiText, 60) });
  } catch (error) {
    res.status(500).json({ error: 'AI helper error', details: error.response?.data || error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const HrefLangChecker = require('../services/hreflang-checker');

router.post('/check', async (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.send({
      statusCode: 422,
      message: 'URL is required'
    });
  }
  
  res.send(await HrefLangChecker.analyze(url))
})

module.exports = router;

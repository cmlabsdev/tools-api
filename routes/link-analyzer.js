const express = require('express');
const router = express.Router();
const LinkAnalyzer = require('../services/link-analyzer');

router.post('/analyze', async (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.send({
      statusCode: 422,
      message: 'URL is required'
    });
  }
  
  res.send(await LinkAnalyzer.analyze(url))
})

module.exports = router;

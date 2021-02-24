const express = require('express');
const router = express.Router();
const RedirectChainChecker = require('../services/redirect-chain-checker');

router.post('/check', async (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.send({
      statusCode: 422,
      message: 'URL is required'
    });
  }
  
  try {
    const redirectChain = await RedirectChainChecker.analyze(url);
    return res.send({
      statusCode: 200,
      message: 'Checker complete',
      data: redirectChain
    })
  } catch (e){
    return res.send({
      statusCode: 500,
      message: e.message,
      data: []
    })
  }
})

module.exports = router;

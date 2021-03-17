const express = require('express');
const router = express.Router();
const SSLCheckerService = require('../services/ssl-checker');

router.post('/check', async(req, res) => {
  const {url} = req.body
  if (!SSLCheckerService.checkUrl(url)) {
    return res.send({
      statusCode: 400,
      message: 'URL is Invalid',
      data: null
    })
  }
  
  res.send(await SSLCheckerService.check(url))
});


module.exports = router;

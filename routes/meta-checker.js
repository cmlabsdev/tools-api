const express = require('express');
const router = express.Router();
const MetaCheckerService = require('../services/meta-checker');

router.post('/check', async(req, res) => {
  const {url} = req.body
  if (!MetaCheckerService.checkUrl(url)) {
    return res.send({
      statusCode: 400,
      message: 'URL is Invalid',
      data: null
    })
  }
  
  res.send(await MetaCheckerService.check(url))
});


module.exports = router;

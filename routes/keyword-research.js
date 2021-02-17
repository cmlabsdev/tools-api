const express = require('express');
const rateLimiter = require('express-rate-limit');
const router = express.Router();
// const {getKeyword, searchIdeasKeyword, contentIdeas} = require('../services/keyword-research');


const limiter = rateLimiter({
  status_code: 200,
  windowMs: 24 * 60 * 60 * 1000, // Limit 24 hour
  max: 3, // for 3 request,
  message: {
    statusCode: 429,
    message: 'Request Limit Exceeded'
  }
});

router.use(limiter);

// router.get('/overview', async (req, res) => {
//   res.send(await getKeyword(req.body))
// });
//
// router.get('/keyword-ideas', async (req, res) => {
//   res.send(await searchIdeasKeyword(req.body))
// });
//
// router.get('/content-ideas', async (req, res) => {
//   res.send(await contentIdeas(req.body))
// });

module.exports = router;

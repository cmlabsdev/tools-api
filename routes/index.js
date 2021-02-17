const express = require('express');
const router = express.Router();
const keywordResearchRoute = require('./keyword-research');
const hreflangCheckerRoute = require('./hreflang-checker');

router.use('/keyword-research', keywordResearchRoute);

router.use('/hreflang-checker', hreflangCheckerRoute)

module.exports = router;

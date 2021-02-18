const express = require('express');
const router = express.Router();
const keywordResearchRoute = require('./keyword-research');
const hreflangCheckerRoute = require('./hreflang-checker');
const linkAnalyzerRoute = require('./link-analyzer');

router.use('/keyword-research', keywordResearchRoute);

router.use('/hreflang-checker', hreflangCheckerRoute)

router.use('/link-analyzer', linkAnalyzerRoute);

module.exports = router;

const express = require('express');
const router = express.Router();
const keywordResearchRoute = require('./keyword-research');
const hreflangCheckerRoute = require('./hreflang-checker');
const linkAnalyzerRoute = require('./link-analyzer');
const redirectChainCheckerRoute = require('./redirect-chain-checker');

router.use('/keyword-research', keywordResearchRoute);

router.use('/hreflang-checker', hreflangCheckerRoute)

router.use('/link-analyzer', linkAnalyzerRoute);

router.use('/redirect-chain-checker', redirectChainCheckerRoute);

module.exports = router;

const express = require('express');
const router = express.Router();
// const keywordResearchRoute = require('./keyword-research');
const hreflangCheckerRoute = require('./hreflang-checker');
const linkAnalyzerRoute = require('./link-analyzer');
const redirectChainCheckerRoute = require('./redirect-chain-checker');
const sslCheckerRoute = require('./ssl-checker');
const metaCheckerService = require('./meta-checker');

// router.use('/keyword-research', keywordResearchRoute);

router.use('/hreflang-checker', hreflangCheckerRoute)

router.use('/link-analyzer', linkAnalyzerRoute);

router.use('/redirect-chain-checker', redirectChainCheckerRoute);

router.use('/ssl-checker', sslCheckerRoute);

router.use('/meta-checker', metaCheckerService);

module.exports = router;

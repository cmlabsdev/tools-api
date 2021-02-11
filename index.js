const express = require('express');
const cors = require('cors');
const app = express();
require('express-async-errors');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const {getKeyword} = require('./services/functions');

const limiter = rateLimiter({
    status_code: 200,
    windowMs: 24 * 60 * 60 * 1000, // Limit 24 hour
    max: 3, // for 3 request,
    message: {
        statusCode: 429,
        message: 'Request Limit Exceeded'
    }
})

const {
    verifySign,
    notFoundHandler,
    errorHandler
} = require('./middlewares');

app.use(verifySign);

app.use(limiter);
app.use(cors());
app.use(morgan(':remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":response-time[digits] ms" ":referrer" :res[header] :req[header]'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send({
        status_code: 200,
        message: 'Keyword Research API 🤳'
    });
});

app.get('/asikasikjos', async (req, res) => {

    res.send(await getKeyword(req.body))

});


app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
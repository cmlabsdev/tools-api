const express = require('express');
const cors = require('cors');
const app = express();
require('express-async-errors');
const morgan = require('morgan');
const mainRoute = require('./routes')

const {
    verifySign,
    notFoundHandler,
    errorHandler
} = require('./middlewares');

// app.use(verifySign);
app.use(cors());
app.use(morgan(':remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":response-time[digits] ms" ":referrer" :res[header] :req[header]'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(mainRoute);

app.get('/', (req, res) => {
    res.send({
        status_code: 200,
        message: 'CMLABS Tools API 🌈'
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

function verifySign(req, res, next) {
    const key = process.env.API_KEY || 'secret';

    if (req.query.key === key) {
        return next();
    }

    return res.send({
        statusCode: 403,
        message: 'You should not pass ✋ without the key'
    });
}

function notFoundHandler(req, res, next){
    const error = new Error('Not found : ' + req.originalUrl);
    res.status(404);
    res.send({
        statusCode: 404,
        message: 'Route not found'
    })
}

function errorHandler(err, req, res, next){
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.send({
        statusCode: statusCode,
        message: process.env.NODE_ENV === 'production' ? 'Something error' : err.message,
        error: process.env.NODE_ENV === 'production' ? 'Error messages cant be showed' : err.stack
    });
}

module.exports = {
    notFoundHandler,
    errorHandler,
    verifySign
}

const apiV1Route = require('./apis/v1');

function init(server) {
  server.get('*', (req, res, next) => {
    return next();
  });

  server.get('/', (req, res) => {
    return res.status(200).json({
      message: 'App is working!'
    });
  });

  server.use('/api/v1', apiV1Route);

  server.use((req, res, next) => {
    const error = new Error('Page Not found!');
    error.status = 404;
    next(error);
  });

  server.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      success: false,
      data: '',
      message: err.message,
      code: err.status || 500
    });
  });
}

module.exports = {
  init: init
};

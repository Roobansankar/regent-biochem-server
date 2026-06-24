const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Regent Biochem API',
      version: '1.0.0',
      description: 'API documentation for Regent Biochem project',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./index.js', './routes/*.js'], // files containing annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;

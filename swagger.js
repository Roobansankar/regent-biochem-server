const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

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
        url: SERVER_URL,
        description: 'Server',
      },
    ],
  },
  apis: ['./index.js', './routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;

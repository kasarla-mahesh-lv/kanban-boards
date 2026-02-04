const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // ✅ must be there
    info: {
      title: "Kanban Boards API",
      version: "1.0.0",
      description: "API documentation for Kanban Boards",
    },
    servers: [
      {
        url: "http://localhost:5000", // ✅ mee server 5000 lo run avuthundi
      },
    ],
  },
  apis: ["./src/routes/*.js"], // routes folder
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;

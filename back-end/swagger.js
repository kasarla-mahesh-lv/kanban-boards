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
    // ✅ ORDER CONTROL: Boards -> Columns -> Cards
    tags: [
      {
        name: "Boards",
        description: "Board related APIs",
      },
      {
        name: "Columns",
        description: "Column related APIs",
      },
      {
        name: "Cards",
        description: "Card related APIs",
      },
    ],
  },
  
  apis: ["./src/routes/*.js"], // routes folder
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;

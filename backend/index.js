const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { DBConnection } = require("./db/connectDB.js");
const typeDefs = require("./graphql/schema.js");
const resolvers = require("./graphql/resolvers.js");
const { graphqlUploadExpress } = require("graphql-upload");
const { ApolloServer } = require("apollo-server-express");

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
DBConnection();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(cors());
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 })); 
app.use("/uploads", express.static(uploadDir));


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, () =>
    console.log(`🚀 Server running on http://localhost:${port}/graphql`)
  );
}

startServer();

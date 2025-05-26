import "dotenv/config";
import app from "./app";
import mongoose from "mongoose";

//* connect to mongodb
const startServer = async () => {
  console.log("TESTING CI AND CD PIPELINE.......");
  console.log("Testing CD pipeline.......");
  console.log("Testing CI pipeline.......again?");

  //* check env variables
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Auth mongodb");
  } catch (error) {
    console.error(error);
  }

  //* listen
  app.listen(3000, () => {
    console.log("Auth service listening on port 3000");
  });
};

startServer();

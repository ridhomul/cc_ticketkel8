import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../nats-wrapper");
let mongo: MongoMemoryServer;
beforeAll(async () => {
  //* env variables
  process.env.JWT_KEY = "thisisjwtkey";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
}, 130000);

beforeEach(async () => {
  jest.clearAllMocks();
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

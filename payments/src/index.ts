import app from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";

import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

//* connect to mongodb
const startServer = async () => {
  //* check env variables
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID is not defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID is not defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL is not defined");
  }

  try {
    //* connect to nats
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!,
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    //* listen for termination signals
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    //* listen for events
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

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

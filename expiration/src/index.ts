import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

//* connect to mongodb
const startServer = async () => {
  //* check env variables
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

    //* start listening for events
    new OrderCreatedListener(natsWrapper.client).listen();

  } catch (error) {
    console.error(error);
  }
};

startServer();

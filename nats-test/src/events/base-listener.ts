import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";


interface Event {
    subject: Subjects;
    data: any;
};

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  private client: Stan;
  protected ackWait = 5 * 1000; //? 5 seconds
  abstract onMessage(data: T["data"], msg: Message): void;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true) //? This is to make sure that the message is not automatically acknowledged(we will do it manually)
      .setDeliverAllAvailable() //? This is to make sure that the listener gets all the events that were missed while the listener was down
      .setDurableName(this.queueGroupName) //? This is to make sure that the listener gets all the events that were missed while the listener was down
      .setAckWait(this.ackWait);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}

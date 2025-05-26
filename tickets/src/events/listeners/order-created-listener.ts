import { Listener, OrderCreatedEvent, Subjects } from "@km12dev/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import Ticket from "../../model/ticket";
import { TicketUpdatedPublisher } from "../publishers";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: data.id });

    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: parseInt(ticket.price),
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}

import { Listener, Subjects, PaymentCreatedEvent, OrderStatus } from "@km12dev/common";
import { queueGroupName } from "./queue-group-name";
import Order from "../../model/order";
import { Message } from "node-nats-streaming";


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        order.set({
            status: OrderStatus.Complete,
        });

        await order.save();

        // await new OrderCompletedPublisher(this.client).publish({
        //     id: order.id,
        //     version: order.version,
        //     ticket: {
        //         id: order.ticket.id,
        //     },
        // });

        msg.ack();
    }

}
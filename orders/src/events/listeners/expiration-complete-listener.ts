import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@km12dev/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

import Order from "../../model/order";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {

        const order = await Order.findById(data.orderId).populate('ticket');
        if (!order) throw new Error('Order not found');


        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        //* cancel order
        order.set({ status: OrderStatus.Cancelled });
        //* save
        await order.save();

        //* publish event 
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }
};
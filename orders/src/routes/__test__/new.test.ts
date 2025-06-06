import request from "supertest";
import app from "../../app";
import { signin } from "../../test/helpers";
import tickets from "../../model/ticket";

import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";
import Order from "../../model/order";
import { OrderStatus } from "@km12dev/common";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId })
    .expect(400);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = tickets.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: "123",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = tickets.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo("emits an order created event");
import { Model, model, Schema } from "mongoose";
import { OrderStatus } from "@km12dev/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { ITickets } from "../types";
import Orders from "./order"; 


//* interface for simple tickets Attributes
type ticketsAttrsType = {
  id?: string;
  title: string;
  price: Number;
};
//* interface for tickets model
interface ITicketsModel extends Model<ITickets> {
  build(attrs: ticketsAttrsType): ITickets;
  findByEvent(event: { id: string, version: number }): Promise<ITickets | null>;
}

//* tickets schema
const ticketsSchema: Schema<ITickets> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketsSchema.set("versionKey", "version");
ticketsSchema.plugin(updateIfCurrentPlugin);

//* static methods for tickets model
ticketsSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return tickets.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketsSchema.statics.build = (attrs: ticketsAttrsType) => {
  return new tickets({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketsSchema.methods.isReserved = async function () {
  const existingOrder = await Orders.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
}

//* tickets model
const tickets: ITicketsModel = model<ITickets, ITicketsModel>(
  "ticket",
  ticketsSchema
);

//* export
export default tickets;

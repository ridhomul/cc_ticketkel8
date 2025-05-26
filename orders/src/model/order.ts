import { Model, model, Schema } from "mongoose";
import { IOrders, ITickets } from "../types";
import { OrderStatus } from "@km12dev/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

//* interface for simple order Attributes
type orderAttrsType = {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITickets;
};
//* interface for order model
interface IOrdersModel extends Model<IOrders> {
  build(attrs: orderAttrsType): IOrders;
}

//* order schema
const orderSchema: Schema<IOrders> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Schema.Types.Date,
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "ticket",
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

//* plugin for versioning
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

//* static methods for order model
orderSchema.statics.build = (attrs: orderAttrsType) => {
  return new order(attrs);
};

//* order model
const order: IOrdersModel = model<IOrders, IOrdersModel>("order", orderSchema);

//* export
export default order;

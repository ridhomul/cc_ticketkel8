import { OrderStatus } from "@km12dev/common";
import { Document } from "mongoose";

export interface IOrders extends Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  version: number;
  ticket: {
    id: string;
    price: string;
  };
}

export default IOrders;

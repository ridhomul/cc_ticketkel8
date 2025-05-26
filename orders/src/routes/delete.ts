import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  validateRequest,
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@km12dev/common";

import Order from "../model/order";
import { OrderCancelledPublisher } from "../events/publishers";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
     
      const order = await Order.findById(id).populate("ticket");

      if (!order) {
        return next(new NotFoundError());
      }

      if (order.userId !== req.currentUser!.id) {
        return next(new NotAuthorizedError());
      }

      order.status = OrderStatus.Cancelled;
      await order.save();

      new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.ticket.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });


      return res.status(201).json(order);
    } catch (error) {  
      if (error instanceof Error) {
        return next(new BadRequestError(error.message));
      }
      return next(new BadRequestError("An unknown error occurred"));
    }
  }
);

export default router;

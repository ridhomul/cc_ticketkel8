import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  validateRequest,
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@km12dev/common";

import Tickets from "../model/ticket";
import { TicketUpdatedPublisher } from "../events/publishers";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    try {
      const ticket = await Tickets.findById(req.params.id);
      if (!ticket) {
        return next(new NotFoundError());
      }

      if(ticket.orderId) {
        return next(new BadRequestError("Cannot edit a reserved ticket"));
      }

      if (ticket.userId !== req.currentUser!.id) {
        return next(new NotAuthorizedError());
      }

      ticket.set({
        title,
        price,
      });

      await ticket.save();

      new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: parseInt(ticket.price),
        userId: ticket.userId,
        version: ticket.version,
      });

      return res.status(201).json(ticket);
    } catch (error) {  
      if (error instanceof Error) {
        return next(new BadRequestError(error.message));
      }
      return next(new BadRequestError("An unknown error occurred"));
    }
  }
);

export default router;

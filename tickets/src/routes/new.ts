import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest, requireAuth } from "@km12dev/common";
import { TicketCreatedPublisher } from "../events/publishers";

import Tickets from "../model/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/api/tickets",
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
      const ticket = Tickets.build({
        title,
        price,
        userId: req.currentUser!.id,
      });

      await ticket.save();

      //* Publishing an event
      new TicketCreatedPublisher(natsWrapper.client).publish({
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

import { Router, Request, Response, NextFunction } from "express";
import { BadRequestError } from "@km12dev/common";

import Tickets from "../model/ticket";

const router = Router();

router.get(
  "/api/tickets",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets = await Tickets.find({});
      return res.status(200).json(tickets);
    } catch (error) {
      if (error instanceof Error) {
        return next(new BadRequestError(error.message));
      }
      return next(new BadRequestError("An unknown error occurred"));
    }
  }
);

export default router;

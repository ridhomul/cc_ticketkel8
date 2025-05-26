import { Router, Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError } from "@km12dev/common";

import Tickets from "../model/ticket";

const router = Router();

router.get(
  "/api/tickets/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const ticket = await Tickets.findById(id);
      if (!ticket) {
        return next(new NotFoundError());
      }

      return res.status(200).json(ticket);
    } catch (error) {
      if (error instanceof Error) {
        return next(new BadRequestError(error.message));
      }
      return next(new BadRequestError("An unknown error occurred"));
    }
  }
);

export default router;

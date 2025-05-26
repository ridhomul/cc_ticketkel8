import { Router, Request, Response, NextFunction } from "express";
import { BadRequestError, requireAuth } from "@km12dev/common";

import orders from "../model/order";

const router = Router();

router.get(
  "/api/orders",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orders.find({
        userId: req.currentUser!.id,
      })
      .populate("ticket");
      res.status(200).json(order);
    } catch (error) {      
      if (error instanceof Error) {
        return next(new BadRequestError(error.message));
      }
      return next(new BadRequestError("An unknown error occurred"));
    }
  }
);

export default router;

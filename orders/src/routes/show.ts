import { Router, Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError, requireAuth } from "@km12dev/common";

import orders from "../model/order";

const router = Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    try {
     
      const order = await orders.findById(orderId).populate("ticket");
      if (!order) {
        return next(new NotFoundError());
      }

      if (order.userId !== req.currentUser!.id) {
        return next(new BadRequestError("Not authorized"));
      }

      return res.status(200).json(order);
    } catch (error) {
      if (error instanceof Error) {
        return next(new BadRequestError(error.message));
      }
      return next(new BadRequestError("An unknown error occurred"));
    }
  }
);

export default router;

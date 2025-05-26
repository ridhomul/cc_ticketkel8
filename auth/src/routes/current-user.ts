import {  Request, Response, Router } from "express";
import { currentUser } from "@km12dev/common";

const router = Router();

router.get(
  "/users/currentuser", currentUser,
  (req: Request, res: Response) => {
    if (!req.currentUser) {
      return res.json({ currentUser: null });
    }

    res.json({ currentUser: req.currentUser });

  }
);

export default router;

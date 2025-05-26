import { Router } from "express";

const router = Router();

router.get("/users/signout", (req, res) => {
  req.session = null;
  res.json({ message: "Signout successful" });
});

export default router;

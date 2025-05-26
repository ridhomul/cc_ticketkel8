import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@km12dev/common";
import User from "../models/user";

const router = Router();

router.post(
  "/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      //* existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new BadRequestError("Email in use"));
      }

      //* create user
      const user = User.build({ email, password });
      await user.save();

      //* generate jwt
      const userJwt = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.JWT_KEY!
      );
      //* store jwt on session object
      req.session = {
        jwt: userJwt,
      };

      //* send response
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return next(new BadRequestError(error.message));
      }
      return next(new BadRequestError("An unknown error occurred"));
    }
  }
);

export default router;

import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@km12dev/common";

import User from "../models/user";
import { Password } from "../services";

const router = Router();

router.post(
  "/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      //* existing user
      const existingUser = await User.findOne({ email });
      if (!existingUser)
        return next(new BadRequestError("Invalid credentials"));

      //* compare passwords
      const passwordsMatch = Password.compare(existingUser.password, password);
      if (!passwordsMatch)
        return next(new BadRequestError("Invalid credentials"));

      //* generate jwt
      const userJwt = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
        },
        process.env.JWT_KEY!
      );
      //* store jwt on session object
      req.session = {
        jwt: userJwt,
      };

      //* send response
      res.status(200).json(existingUser);
    } catch (error) {
      if (error instanceof Error) {
        return next(new BadRequestError(error.message));
      }
      return next(new BadRequestError("An unknown error occurred"));
    }
  }
);

export default router;

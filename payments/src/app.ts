import express from "express";
import cookieSession from "cookie-session";

import { createChargeRouter } from "./routes";

import { currentUser, errorHandler, NotFoundError } from "@km12dev/common";

//* app
const app = express();

//* trust proxy - express is behind a proxy (nginx)
app.set("trust proxy", true);
//* rejectUnauthorized - throw error if https is not used

//* middleware
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

//* routes
app.use(createChargeRouter);

//* not found route
app.all("*", () => {
  throw new NotFoundError();
});

//* error handling
app.use(errorHandler);

export default app;
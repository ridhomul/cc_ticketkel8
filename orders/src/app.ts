import express from "express";
import cookieSession from "cookie-session";

import { currentUser, errorHandler, NotFoundError } from "@km12dev/common";
import {createNewOrderRouter, findOrderRouter, showOrderRouter, deleteOrderRouter } from "./routes";

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
app.use(createNewOrderRouter);
app.use(findOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

//* not found route
app.all("*", () => {
  throw new NotFoundError();
});

//* error handling
app.use(errorHandler);

export default app;
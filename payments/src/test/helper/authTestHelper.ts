import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//? mock a user sign in, by creating a session cookie
export const signin = (id?: string) => {

  if (!id) {
    id = new mongoose.Types.ObjectId().toHexString();
  }

  const payload = {
    id,
    email: "test@test.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};

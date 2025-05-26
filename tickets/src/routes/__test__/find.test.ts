import request from "supertest";
import app from "../../app";
import { signin } from "../../test/helpers";

const createTicket = (title: string, price: string) => {
  return request(app).post("/api/tickets").set("Cookie", signin()).send({
    title,
    price,
  });
};

it("can fetch a list of tickets", async () => {
  await createTicket("ticket1", "20");
  await createTicket("ticket2", "30");
  await createTicket("ticket3", "40");

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});

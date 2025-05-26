import request from "supertest";
import app from "../../app";
import { signin } from "../../test/helpers";

it("return a 404 if the ticket is not found", async () => {
  
    const id = "60c72b2f9b1d8b001c8e4f56"; 

    await request(app)
    .get(`/api/tickets/${id}`)
    .send({})
    .expect(404);
});

it("return the ticket if the ticket is found", async () => {
  const title = "valid title";
  const price = "20";
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title,
      price,
    });

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(200);
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

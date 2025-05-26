import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest, requireAuth, NotFoundError, NotAuthorizedError } from "@km12dev/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post('/api/payments', requireAuth, [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
], validateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return next(new NotFoundError());
        }

        if (order.userId !== req.currentUser!.id) {
            return next(new NotAuthorizedError());
        }

        if (order.status === 'cancelled') {
            return next(new BadRequestError('Cannot pay for a cancelled order'));
        }

        // await stripe.charges.create({
        //     currency: 'usd',
        //     amount: order.price * 100,
        //     source: token,
        // });
        const charge = await stripe.paymentIntents.create({
            amount: order.price * 100,
            currency: 'usd',
            payment_method: token,
            confirm: true
        });


        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        });
        await payment.save();

        //* Publish an event that a payment was created
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });

        res
            .status(201)
            .send({ success: true });

    } catch (error) {
        if (error instanceof Error) {
            return next(new BadRequestError(error.message));
        }
        return next(new BadRequestError("An unknown error occurred"));
    }
});

export default router;
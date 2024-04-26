import Stripe from "stripe";
import { envSchema } from "../env";
import { BadRequest } from "../errors/bad-request";
import { connectionPrisma } from "./prisma";

type EventSession = {
	data: { object: Stripe.Checkout.Session };
};

type EventSubscription = {
	data: { object: Stripe.Subscription };
};

export const stripeConnect = new Stripe(envSchema.STRIPE_PRIVATE_KEY, {
	httpClient: Stripe.createFetchHttpClient(),
});

class CustomersController {
	private stripe;
	constructor() {
		this.stripe = stripeConnect;
	}
	async getStripeCostumersByEmail(email: string) {
		const customer = await this.stripe.customers.list({
			email,
		});

		return customer.data[0];
	}

	async createStripeCostumer(email: string, name?: string) {
		const customer = await this.getStripeCostumersByEmail(email);

		if (customer) return customer;

		return this.stripe.customers.create({
			email,
			name,
		});
	}

	async generateCheckout(userId: string, email: string) {
		try {
			const customer = await this.createStripeCostumer(email);

			const session = await this.stripe.checkout.sessions.create({
				payment_method_types: ["card"],
				mode: "payment",
				client_reference_id: userId,
				customer: customer.id,
				success_url: "http://localhost:3000/done",
				cancel_url: "http://localhost:3000/cancel",
				line_items: [
					{
						price: envSchema.STRIPE_PRICE_KEY,
						quantity: 1,
					},
				],
			});

			return {
				url: session.url,
			};
		} catch (error) {
			throw new BadRequest("Session checkout error");
		}
	}

	async handleCheckoutSessionComplete(event: EventSession) {
		const userId = event.data.object.client_reference_id;
		const stripeCustomerId = event.data.object.customer as string;
		const checkoutStatus = event.data.object.status;

		if (checkoutStatus !== "complete") return;

		if (!userId || !stripeCustomerId) {
			throw new BadRequest("userId, stripeCustomerId is required");
		}

		const user = await connectionPrisma.user.findFirst({
			where: { id: userId },
		});

		if (!user) {
			throw new BadRequest("user not found");
		}

		await connectionPrisma.user.update({
			where: { id: user.id },
			data: {
				stripeCustomer: {
					update: {
						stripeCustomerId,
						stripeSubscriptionStatus: checkoutStatus,
					},
				},
			},
		});
	}

	async handleSubscriptionSessionComplete(event: EventSubscription) {
		const subscriptionStatus = event.data.object.status;
		const stripeCostumerId = event.data.object.customer as string;

		const user = await connectionPrisma.user.findFirst({
			where: {
				stripeCustomer: {
					stripeCustomerId: stripeCostumerId,
				},
			},
		});

		if (!user) {
			throw new BadRequest("stripeCostumerId not found");
		}

		await connectionPrisma.user.update({
			where: { id: user.id },
			data: {
				stripeCustomer: {
					update: {
						stripeCustomerId: stripeCostumerId,
						stripeSubscriptionStatus: subscriptionStatus,
					},
				},
			},
		});
	}
}

export const customersController = new CustomersController();

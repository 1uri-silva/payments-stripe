import { customersController } from "@/utils/connections/stripe";
import type { Stripe } from "stripe";

class WebhookController {
	async webhook(event: Stripe.Event) {
		switch (event.type) {
			case "checkout.session.completed":
				await customersController.handleCheckoutSessionComplete(event);
				break;
			case "customer.subscription.updated":
				await customersController.handleSubscriptionSessionComplete(event);
				break;
			default:
				break;
		}
	}
}

export const webhookController = new WebhookController();

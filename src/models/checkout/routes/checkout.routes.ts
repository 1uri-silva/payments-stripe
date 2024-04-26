import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { stripeConnect } from "@/utils/connections/stripe";
import { envSchema } from "@/utils/env";
import { BadRequest } from "@/utils/errors/bad-request";
import { checkoutController } from "../controllers/payment.controller";
import { webhookController } from "../controllers/webhook.controller";

export async function checkoutRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/checkout/:userId",
		{
			schema: {
				params: z.object({
					userId: z.string().uuid(),
				}),

				response: {
					201: z.object({
						url: z.string().url().nullable(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { userId } = request.params;

			const { checkout } = await checkoutController.create(userId);

			return reply.status(200).send(checkout);
		},
	);

	/**
	 * url connection stripe cli:
	 * ```sh stripe listen --forward-to localhost:2000/webhook```
	 *
	 **/

	app.withTypeProvider<ZodTypeProvider>().post(
		"/webhook",
		{
			config: { rawBody: true },
			schema: {
				hide: true,
			},
		},
		async (request, reply) => {
			try {
				const event = stripeConnect.webhooks.constructEvent(
					request.rawBody as string,
					request.headers["stripe-signature"] as string,
					envSchema.STRIPE_PRIVATE_KEY_WH,
				);

				await webhookController.webhook(event);
				return reply.status(200).send();
			} catch {
				throw new BadRequest("webhook connection ");
			}
		},
	);
}

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { userController } from "../controllers/user.conroller";

export async function userRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/user/new",
		{
			schema: {
				body: z.object({
					first_name: z.string(),
					last_name: z.string(),
					email: z.string().email(),
				}),

				response: {
					201: z.object({
						id: z.string().uuid(),
						first_name: z.string(),
						last_name: z.string(),
						email: z.string().email(),
						stripeCustomer: z
							.object({
								id: z.string().uuid(),
								userId: z.string().uuid(),
								stripeCustomerId: z.string().nullish(),
								stripeSubscriptionId: z.string().nullish(),
							})
							.nullable(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { first_name, last_name, email } = request.body;

			const { user } = await userController.create({
				first_name,
				last_name,
				email,
			});

			return reply.status(201).send(user);
		},
	);
}

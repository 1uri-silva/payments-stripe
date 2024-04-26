import { z } from "zod";

export const envSchema = z
	.object({
		DATABASE_URL: z.string().url(),
		POSTGRES_USER: z.string(),
		POSTGRES_PASS: z.string(),
		POSTGRES_DB: z.string(),
		STRIPE_PRIVATE_KEY_WH: z.string(),
		STRIPE_PRICE_KEY: z.string(),
		STRIPE_PRIVATE_KEY: z.string(),
	})
	.parse(process.env);


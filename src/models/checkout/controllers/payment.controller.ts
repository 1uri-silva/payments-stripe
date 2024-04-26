import { connectionPrisma } from "@/utils/connections/prisma";
import { customersController } from "@/utils/connections/stripe";
import { BadRequest } from "@/utils/errors/bad-request";

class CheckoutController {
	async create(userId: string) {
		const user = await connectionPrisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new BadRequest("User doe's not exists");
		}

		const checkout = await customersController.generateCheckout(
			user.id,
			user.email,
		);

		return { checkout };
	}
}

export const checkoutController = new CheckoutController();

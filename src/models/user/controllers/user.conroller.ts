import { connectionPrisma } from "@/utils/connections/prisma";
import { customersController } from "@/utils/connections/stripe";
import { BadRequest } from "@/utils/errors/bad-request";

interface IRequestCreateUser {
	first_name: string;
	last_name: string;
	email: string;
}

class UserController {
	async create({ first_name, last_name, email }: IRequestCreateUser) {
		const user = await connectionPrisma.user.findUnique({
			where: { first_name },
		});

		if (user) {
			throw new BadRequest("User already exists");
		}

		const customer = await customersController.createStripeCostumer(
			email,
			`${first_name} ${last_name}`,
		);

		const userCreated = await connectionPrisma.user.create({
			data: {
				email,
				first_name,
				last_name,
				stripeCustomer: {
					create: {
						stripeCustomerId: customer.id,
					},
				},
			},
			include: {
				stripeCustomer: true,
			},
		});

		return { user: userCreated };
	}
}

export const userController = new UserController();

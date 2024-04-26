import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { BadRequest } from "./bad-request";

export function handlerErrors(
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	console.log(error);
	if (error instanceof BadRequest) {
		return reply.status(400).send({ message: error.message });
	}

	if (error instanceof ZodError) {
		return reply.status(400).send(error.issues);
	}

	return reply.status(500).send({ message: "Internal Server Error" });
}

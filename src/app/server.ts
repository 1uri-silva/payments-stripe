import fastify from "fastify";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyRawBody from "fastify-raw-body";

import { checkoutRoute } from "@/models/checkout/routes/checkout.routes";
import { userRoute } from "@/models/user/routes/user.routes";
import { handlerErrors } from "@/utils/errors/handler-errors";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

export const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	swagger: {
		info: {
			title: "payments",
			version: "1.0.0",
			description: "Api for payments",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifyRawBody, {
	field: "rawBody",
	global: false,
	encoding: "utf8",
	runFirst: true,
	routes: [],
	jsonContentTypes: [],
});

app.register(fastifySwaggerUI, {
	routePrefix: "/docs",
});

app.setErrorHandler(handlerErrors);
app.register(userRoute);
app.register(checkoutRoute);

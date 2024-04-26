import { app } from "./app/server";

app.listen(
	{
		host: "0.0.0.0",
		port: 2000,
	},
	(_errors, address) => {
		console.info(address);
	},
);

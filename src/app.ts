import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import { env } from "./config/env";
import routes from "./routes";

const app: FastifyInstance = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

app.register(routes);

export default app;

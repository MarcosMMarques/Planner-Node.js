import fastify from "fastify";
import { prisma } from "./lib/prisma";
import { createTrip } from "./routes/create-trip";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/cadastrar", async () => {
  await prisma.trip.create({
    data: {
      destination: "Belo Horizonte",
      starts_at: new Date(),
      ends_at: new Date(),
    },
  });

  return "Registro cadastradso com sucesso!";
});

app.get("/listar", async () => {
  const trips = await prisma.trip.findMany();

  return trips;
});

app.register(createTrip);

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Server running on port 3333!");
});

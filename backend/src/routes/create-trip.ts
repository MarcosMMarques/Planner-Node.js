import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
//import 'dayjs/locale/py-br'
import nodemailer from "nodemailer";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";

dayjs.extend(localizedFormat);

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string(),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email()),
        }),
      },
    },
    async (request) => {
      const {
        destination,
        starts_at,
        ends_at,
        owner_name,
        owner_email,
        emails_to_invite,
      } = request.body;

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new Error("Invalide trip end date");
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_owner: true,
                  is_confirmed: true,
                },
                ...emails_to_invite.map((email) => {
                  return { email };
                }),
              ],
            },
          },
        },
      });

      const formattedStartDate = dayjs(starts_at).format("LL");
      const formattedndDate = dayjs(ends_at).format("LL");

      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: {
          name: "Equipe planner",
          address: "oi@planner",
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: "Testing e-mail",
        html: "<p>Testing e-mail </p>",
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return trip.id;
    }
  );
}

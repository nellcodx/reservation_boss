import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  SMS_PROVIDER: z.enum(["mock", "twilio"]).default("mock"),
  SMS_FROM: z.string().min(1).default("+15555550123"),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional()
});

export const env = EnvSchema.parse(process.env);


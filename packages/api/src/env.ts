import { z } from "zod";

const EnvSchema = z
  .object({
    // Default matches `docker-compose.yml` in the repo root for local dev.
    DATABASE_URL: z
      .string()
      .min(1)
      .default(
        "postgresql://postgres:postgres@localhost:5432/restaurant_reservations?schema=public"
      ),
    PORT: z.coerce.number().int().positive().default(4000),
    // Comma-separated allowlist, e.g. "http://localhost:3000,https://*.vercel.app" won't work;
    // list explicit preview URLs or use a stable staging domain.
    WEB_ORIGINS: z.string().optional(),
    // Back-compat single origin (prefer WEB_ORIGINS in production).
    WEB_ORIGIN: z.string().optional(),
    SMS_PROVIDER: z.enum(["mock", "twilio"]).default("mock"),
    SMS_FROM: z.string().min(1).default("+15555550123"),
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional()
  })
  .transform((cfg) => {
    const defaultOrigin = "http://localhost:3000";
    const fromList = (cfg.WEB_ORIGINS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const origins = fromList.length > 0 ? fromList : [cfg.WEB_ORIGIN ?? defaultOrigin];
    return {
      ...cfg,
      WEB_ORIGINS: origins,
      // Keep a single string for logs/back-compat.
      WEB_ORIGIN: origins[0] ?? defaultOrigin
    };
  });

export const env = EnvSchema.parse(process.env);


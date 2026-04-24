import { env } from "../env.js";
import { createMockSmsProvider } from "./mock.js";
import type { SmsProvider } from "./provider.js";

export function createSmsProvider(): SmsProvider {
  if (env.SMS_PROVIDER === "mock") return createMockSmsProvider();
  // Twilio can be added later without changing callers; for now default to mock.
  return createMockSmsProvider();
}


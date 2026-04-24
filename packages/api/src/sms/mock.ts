import type { SmsProvider, SmsSendInput } from "./provider.js";

export function createMockSmsProvider(): SmsProvider {
  return {
    async send(input: SmsSendInput) {
      const id = `mock_${Date.now()}`;
      // eslint-disable-next-line no-console
      console.log(`[sms:mock] to=${input.to} id=${id} body=${input.body}`);
      return { id };
    }
  };
}


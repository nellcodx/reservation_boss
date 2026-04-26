type SmsSendInput = { to: string; body: string };

export function createMockSmsProvider() {
  return {
    async send(input: SmsSendInput) {
      const id = `mock_${Date.now()}`;
      console.log(`[sms:mock] to=${input.to} id=${id} body=${input.body}`);
      return { id };
    }
  };
}

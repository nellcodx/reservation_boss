export type SmsSendInput = {
  to: string;
  body: string;
};

export type SmsProvider = {
  send: (input: SmsSendInput) => Promise<{ id: string }>;
};


export const IDL = {
  address: "8MEhzdrriUEbKK1s4MmNzK876YmyUAwtF1sWJ9qhdYH",
  metadata: {
    name: "pluto_program",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Pluto transfer Anchor program"
  },
  instructions: [
    {
      name: "send_with_memo",
      discriminator: [108, 18, 178, 200, 151, 30, 126, 186],
      accounts: [
        { name: "sender", writable: true, signer: true },
        { name: "recipient", writable: true },
        { name: "transaction_record", writable: true, pda: { seeds: [] } },
        { name: "system_program", address: "11111111111111111111111111111111" }
      ],
      args: [
        { name: "amount_lamports", type: "u64" },
        { name: "recipient_alias", type: "string" },
        { name: "memo", type: "string" },
        { name: "timestamp", type: "i64" }
      ]
    }
  ],
  accounts: [
    {
      name: "TransactionRecord",
      discriminator: [206, 23, 5, 97, 161, 157, 25, 107]
    }
  ],
  types: [
    {
      name: "TransactionRecord",
      type: {
        kind: "struct",
        fields: [
          { name: "sender", type: "pubkey" },
          { name: "recipient", type: "pubkey" },
          { name: "recipient_alias", type: "string" },
          { name: "amount_lamports", type: "u64" },
          { name: "memo", type: "string" },
          { name: "timestamp", type: "i64" },
          { name: "bump", type: "u8" }
        ]
      }
    }
  ],
  events: [
    {
      name: "TransactionEvent",
      discriminator: [164, 87, 102, 61, 105, 53, 147, 32]
    }
  ],
  errors: [
    { code: 6000, name: "InvalidAmount", msg: "Amount must be greater than zero" },
    { code: 6001, name: "AliasTooLong", msg: "Recipient alias must be 50 characters or less" },
    { code: 6002, name: "MemoTooLong", msg: "Memo must be 100 characters or less" },
    { code: 6003, name: "TimestampOutOfRange", msg: "Timestamp must be within five minutes of the current Solana clock" }
  ]
} as const;

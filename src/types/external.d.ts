declare module "@solana/web3.js" {
  export const LAMPORTS_PER_SOL: number;
  export class PublicKey {
    constructor(value: string);
  }
  export class Keypair {
    publicKey: PublicKey;
    static generate(): Keypair;
    static fromSecretKey(secretKey: Uint8Array): Keypair;
  }
  export class Connection {
    constructor(endpoint: string, commitment?: string);
    getBalance(publicKey: PublicKey): Promise<number>;
  }
  export class Transaction {
    add(...instructions: any[]): Transaction;
  }
  export class TransactionInstruction {
    constructor(args: any);
  }
  export const SystemProgram: {
    transfer(args: { fromPubkey: PublicKey; toPubkey: PublicKey; lamports: number }): any;
  };
  export function clusterApiUrl(network: "devnet" | "mainnet-beta"): string;
  export function sendAndConfirmTransaction(
    connection: Connection,
    transaction: Transaction,
    signers: Keypair[],
    options?: any
  ): Promise<string>;
}

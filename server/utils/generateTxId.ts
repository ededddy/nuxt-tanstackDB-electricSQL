import type { Txid } from "@tanstack/electric-db-collection";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function generateTxId(tx: any): Promise<Txid> {
    const result = await tx`SELECT pg_current_xact_id()::xid::text as txid`;

    const txid = result[0]?.txid;

    if (txid == undefined) {
        throw new Error("Failed to get transaction ID");
    }

    return parseInt(txid, 10);
}

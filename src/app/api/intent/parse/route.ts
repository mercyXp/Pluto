import { NextResponse } from "next/server";
import { parseIntent } from "@/lib/intent/parseIntent";

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string };
  if (!body.message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

  return NextResponse.json(parseIntent(body.message));
}

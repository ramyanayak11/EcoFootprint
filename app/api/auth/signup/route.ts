// app/api/auth/signup/route.ts
import { users } from "@/lib/userStore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const existing = users.find(u => u.email === email);
  if (existing) return NextResponse.json({ error: "User exists" }, { status: 400 });

  users.push({ email, password });
  return NextResponse.json({ success: true });
}

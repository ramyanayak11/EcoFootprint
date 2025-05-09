// app/api/auth/login/route.ts
import { users } from "@/lib/userStore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  return NextResponse.json({ success: true });
}

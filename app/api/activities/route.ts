// app/api/activities/route.ts
import { NextResponse } from 'next/server';

let activityLog: string[] = [];

export async function GET() {
  return NextResponse.json(activityLog);
}

export async function POST(req: Request) {
  const { activity } = await req.json();
  activityLog.push(activity);
  return NextResponse.json({ success: true, activity });
}

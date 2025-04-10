// app/api/profile/route.ts
import { NextResponse } from 'next/server';

let mockProfile = {
  name: "John Doe",
  email: "johndoe@example.com",
  profilePic: "/profile.jpg",
};

export async function GET() {
  return NextResponse.json(mockProfile);
}

export async function POST(req: Request) {
  const body = await req.json();
  mockProfile = { ...mockProfile, ...body };
  return NextResponse.json({ success: true, profile: mockProfile });
}

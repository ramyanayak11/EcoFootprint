// app/api/news/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEWSDATA_API_KEY;

  const params = new URLSearchParams({
    apikey: apiKey ?? "",
    q: "environment OR climate OR sustainability",
    category: "environment",
    language: "en",
    country: "us",
    size: "5", // number of articles
  });

  const url = `https://newsdata.io/api/1/latest?${params}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "success") {
      return NextResponse.json({ error: "Failed to fetch news." }, { status: 500 });
    }

    return NextResponse.json(data.results);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" + err }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Forward the request to the FastAPI backend
  const backendUrl =
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000/convert"
      : "/api/py/convert";

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      body: req.body,
      headers: {
        "Content-Type": req.headers.get("content-type") || "",
      },
      // @ts-ignore
      duplex: "half",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("FastAPI returned an error:", errorData);
      return NextResponse.json(
        { error: errorData.error || "Backend error" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error connecting to FastAPI backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend." },
      { status: 500 }
    );
  }
}

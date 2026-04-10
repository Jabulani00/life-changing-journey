import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Deprecated endpoint. Use Firebase Auth client + /api/auth/session." },
    { status: 410 }
  );
}

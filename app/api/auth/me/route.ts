import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/requireAdmin";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}

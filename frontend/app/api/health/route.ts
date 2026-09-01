import { NextResponse } from "next/server";
import { publicEnv } from "@/lib/env";

/**
 * GET /api/health — proxies to the backend's own health endpoint so the
 * frontend deployment can be smoke-tested independently of backend uptime
 * dashboards, and so local `next dev` setup can be verified end-to-end.
 */
export async function GET() {
  try {
    const res = await fetch(`${publicEnv.apiBaseUrl}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { status: "degraded", backend: false, message: `Backend responded with ${res.status}` },
        { status: 502 }
      );
    }

    const backendHealth = await res.json();
    return NextResponse.json({ status: "ok", backend: true, backendHealth });
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        backend: false,
        message: error instanceof Error ? error.message : "Unable to reach backend",
      },
      { status: 502 }
    );
  }
}

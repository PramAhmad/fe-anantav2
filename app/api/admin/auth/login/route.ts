import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Read admin credentials from environment; if not present (dev), try parsing .env
    let ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ananta.com";
    let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me-in-production";

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      try {
        // Try to read .env file in project root (dev convenience)
        const fs = await import("fs");
        const path = await import("path");
        const envPath = path.resolve(process.cwd(), ".env");
        if (fs.existsSync(envPath)) {
          const raw = fs.readFileSync(envPath, "utf8");
          raw.split(/\r?\n/).forEach((line) => {
            const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
            if (m) {
              const key = m[1];
              let val = m[2] || "";
              // Remove surrounding quotes
              if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
              }
              if (key === "ADMIN_EMAIL") ADMIN_EMAIL = val;
              if (key === "ADMIN_PASSWORD") ADMIN_PASSWORD = val;
            }
          });
        }
      } catch (e) {
        console.log("Failed to read .env fallback:", e);
      }
    }

    console.log("Login attempt:", { email, password });
    console.log("Expected:", { ADMIN_EMAIL, ADMIN_PASSWORD });
    console.log("Password debug:", {
      sentLen: password?.length ?? 0,
      sentCodes: password ? password.split("").map((c) => c.charCodeAt(0)) : [],
      expectedLen: ADMIN_PASSWORD?.length ?? 0,
      expectedCodes: ADMIN_PASSWORD ? ADMIN_PASSWORD.split("").map((c) => c.charCodeAt(0)) : [],
    });

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log("Credentials mismatch!", { emailMatch: email === ADMIN_EMAIL, passwordMatch: password === ADMIN_PASSWORD });
      return NextResponse.json(
        {
          error: "Invalid credentials",
          emailMatch: email === ADMIN_EMAIL,
          passwordMatch: password === ADMIN_PASSWORD,
          expectedEmail: ADMIN_EMAIL,
          sentLen: password?.length ?? 0,
          sentCodes: password ? password.split("").map((c) => c.charCodeAt(0)) : [],
          expectedLen: ADMIN_PASSWORD?.length ?? 0,
          expectedCodes: ADMIN_PASSWORD ? ADMIN_PASSWORD.split("").map((c) => c.charCodeAt(0)) : [],
        },
        { status: 401 }
      );
    }

    // Create simple token (in production, use JWT)
    const token = btoa(JSON.stringify({ email, timestamp: Date.now() }));

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

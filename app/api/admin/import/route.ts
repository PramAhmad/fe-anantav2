import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface CSVRow {
  name?: string;
  description?: string;
  category?: string;
  difficulty?: string;
  video_url?: string;
  audio_url?: string;
}

// Simple CSV parser
function parseCSV(csv: string): CSVRow[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: CSVRow = {};

    headers.forEach((header, idx) => {
      row[header as keyof CSVRow] = values[idx];
    });

    if (row.name) rows.push(row);
  }

  return rows;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const fileText = Buffer.from(fileBuffer).toString("utf-8");

    let csvData: CSVRow[] = [];

    // If ZIP file, extract CSV
    if (file.type === "application/zip" || file.name.endsWith(".zip")) {
      // For now, just return error
      // In production, use 'unzipper' or 'jszip' to extract
      return NextResponse.json(
        { error: "ZIP import coming soon - use CSV for now" },
        { status: 400 }
      );
    } else {
      // Parse CSV
      csvData = parseCSV(fileText);
    }

    if (csvData.length === 0) {
      return NextResponse.json(
        { error: "No valid data in file" },
        { status: 400 }
      );
    }

    // Import to Supabase
    const results = await Promise.allSettled(
      csvData.map((row) =>
        supabase.from("gestures").insert([
          {
            name: row.name,
            description: row.description || null,
            category: row.category || "General",
            difficulty: row.difficulty || "Easy",
            video_url: row.video_url,
            audio_url: row.audio_url || null,
          },
        ])
      )
    );

    const success = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    const errors = results
      .filter((r) => r.status === "rejected")
      .map((r) => (r as PromiseRejectedResult).reason?.message || "Unknown error");

    return NextResponse.json({
      success,
      failed,
      errors: errors.slice(0, 10), // Show first 10 errors
      total: csvData.length,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Import failed", details: String(error) },
      { status: 500 }
    );
  }
}

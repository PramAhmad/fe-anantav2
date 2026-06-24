import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// GET - list gestures with search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    let query = supabase.from("gestures").select("*");

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching gestures:", error);
    return NextResponse.json(
      { error: "Failed to fetch gestures" },
      { status: 500 }
    );
  }
}

// POST - create gesture
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("gestures")
      .insert([
        {
          name: body.name,
          description: body.description,
          category: body.category,
          difficulty: body.difficulty,
          video_url: body.video_url,
          audio_url: body.audio_url,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating gesture:", error);
    return NextResponse.json(
      { error: "Failed to create gesture" },
      { status: 500 }
    );
  }
}

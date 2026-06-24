import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// GET - single gesture
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from("gestures")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Gesture not found" },
      { status: 404 }
    );
  }
}

// PUT - update gesture
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("gestures")
      .update({
        name: body.name,
        description: body.description,
        category: body.category,
        difficulty: body.difficulty,
        video_url: body.video_url,
        audio_url: body.audio_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating gesture:", error);
    return NextResponse.json(
      { error: "Failed to update gesture" },
      { status: 500 }
    );
  }
}

// DELETE - remove gesture
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First, delete the video from storage if exists
    // Then delete from database

    const { error } = await supabase
      .from("gestures")
      .delete()
      .eq("id", params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gesture:", error);
    return NextResponse.json(
      { error: "Failed to delete gesture" },
      { status: 500 }
    );
  }
}

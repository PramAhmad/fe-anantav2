"use client";

import dynamic from "next/dynamic";

const GestureForm = dynamic(() => import("@/app/admin/gestures/new/page"), {
  ssr: false,
});

export default function EditGesturePage() {
  return <GestureForm isEdit={true} />;
}

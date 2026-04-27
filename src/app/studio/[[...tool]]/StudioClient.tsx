"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioClient() {
  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <NextStudio config={config} />
    </div>
  );
}

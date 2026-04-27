import StudioClient from "./StudioClient";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <StudioClient />
    </div>
  );
}

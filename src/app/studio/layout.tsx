export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-studio-root
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

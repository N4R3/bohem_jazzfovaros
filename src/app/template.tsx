import Footer from "@/components/home/Footer";
import PageEnter from "@/components/layout/PageEnter";

/**
 * Template újrarenderel navigációnként (Next.js) — így a Footer
 * minden /en ↔ / váltáskor friss locale-tal töltődik (layout nem).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageEnter>{children}</PageEnter>
      <Footer />
    </>
  );
}

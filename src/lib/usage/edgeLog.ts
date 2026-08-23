/**
 * Edge (middleware) oldali használati napló.
 *
 * Egyetlen, gépileg feldolgozható JSON sor kérésenként, `[usage]` prefixszel.
 * Nincs extra hálózati hívás, nincs storage — így NEM generál újabb
 * függvényhívást és nem növeli a számlát. A Netlify log retention rövid, ezért
 * a tartós, napi bontású aggregálást a szerver oldali számlálók végzik
 * (lásd `serverMetrics.ts`), ez a sor a 24 órás élő diagnosztikához kell.
 *
 * Kikapcsolás: USAGE_LOG=0
 */
import {
  classifyAudience,
  classifyRequestKind,
  classifyRoute,
  classifyUserAgent,
} from "./classify";

type EdgeLogInput = {
  pathname: string;
  method: string;
  headers: { get(name: string): string | null };
  /** A middleware elől a Next kiszűri az RSC fejléceket — a `?_rsc=` marad. */
  search?: URLSearchParams | null;
  /** "next" = origin felé engedve, "redirect" | "rewrite" = edge-en lezárva */
  outcome: "next" | "redirect" | "rewrite";
  status?: number;
};

export function logEdgeRequest({
  pathname,
  method,
  headers,
  search,
  outcome,
  status,
}: EdgeLogInput): void {
  if (process.env.USAGE_LOG === "0") return;
  try {
    /* Szándékosan egyetlen sor: a Netlify log drain / CLI így könnyen szűrhető. */
    console.log(
      `[usage] ${JSON.stringify({
        t: new Date().toISOString(),
        src: "edge",
        route: classifyRoute(pathname),
        m: method,
        kind: classifyRequestKind(headers, search),
        aud: classifyAudience(pathname),
        ua: classifyUserAgent(headers.get("user-agent")),
        out: outcome,
        st: status ?? 200,
      })}`,
    );
  } catch {
    /* A naplózás soha nem törheti meg a kérést. */
  }
}

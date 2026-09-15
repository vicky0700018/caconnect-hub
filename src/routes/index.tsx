import { createFileRoute } from "@tanstack/react-router";
import Shell from "@/app/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CAConnect — CA practice management demo" },
      {
        name: "description",
        content:
          "Dashboard, deadlines, GST, TDS, audits and fees for an Indian CA practice — a clickable frontend demo with mock data.",
      },
      { property: "og:title", content: "CAConnect — CA practice management demo" },
      {
        property: "og:description",
        content:
          "Dashboard, deadlines, GST, TDS, audits and fees for an Indian CA practice — a clickable frontend demo with mock data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shell,
});

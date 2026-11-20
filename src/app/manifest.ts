import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Patternbook",
    short_name: "Patternbook",
    description:
      "Interactive lessons on software engineering patterns, each with a diagram of the broken and fixed versions that you can change and step through.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBFBF9",
    theme_color: "#FBFBF9",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

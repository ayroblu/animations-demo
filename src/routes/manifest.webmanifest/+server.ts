import { json } from "@sveltejs/kit";

export const prerender = true;
export function GET() {
  return json({
    name: "animations-demo",
    short_name: "animations-demo",
    start_url: "./",
    display: "standalone",
    background_color: "#000000",
    lang: "en",
    scope: "./",
    icons: [
      {
        src: "./favicons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  });
}

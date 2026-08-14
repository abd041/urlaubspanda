import { ImageResponse } from "next/og";

export const alt =
  "Urlaubspanda – Die besten Urlaubsangebote & Reise-Deals";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "linear-gradient(135deg, #0a2540 0%, #123a63 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 28,
              background: "#2f7ef6",
              fontSize: 56,
            }}
          >
            🐼
          </div>
          <span
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -1,
            }}
          >
            Urlaubspanda
          </span>
        </div>
        <span
          style={{
            fontSize: 32,
            color: "#c7d6ea",
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          Die besten Urlaubsangebote &amp; Reise-Deals
        </span>
      </div>
    ),
    { ...size }
  );
}

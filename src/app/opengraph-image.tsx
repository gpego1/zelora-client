import { ImageResponse } from "next/og";

export const alt =
  "Zelora. Sua agenda organizada. Seu negócio no controle. Produto em desenvolvimento.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f8f7f2",
        color: "#173e32",
        padding: "70px 85px",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 45, fontWeight: 700, letterSpacing: -2 }}>
        zelora.
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 70,
          letterSpacing: -3,
          lineHeight: 1.1,
        }}
      >
        <span>Sua agenda organizada.</span>
        <span style={{ color: "#55785d" }}>Seu negócio no controle.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #cbd3c3",
          paddingTop: 25,
          fontSize: 20,
        }}
      >
        <span>Para quem faz do cuidado o seu trabalho.</span>
        <span>Em desenvolvimento</span>
      </div>
    </div>,
    size,
  );
}

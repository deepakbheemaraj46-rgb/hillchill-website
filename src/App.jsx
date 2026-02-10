import React from "react";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        textAlign: "center",
        backgroundColor: "#f0fdf4", // light greenish background
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>
        Hill & Chill
      </h1>
      <p style={{ fontSize: 18, marginBottom: 24 }}>
        Premium Nilgiris Ingredients
      </p>
      <p style={{ fontSize: 16, color: "#555" }}>
        Your website structure is now correct. Next, you can deploy on Vercel!
      </p>
    </div>
  );
}

import React from "react";

const PADLET_EMBED_URL = "https://padlet.com/embed/3kkz7ghl10yp44s0";

export default function ImportantDates() {
  return (
    <section className="min-h-screen bg-gray-100">
      {/* Full-page Padlet Embed */}
      <div
        className="padlet-embed"
        style={{
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "2px",
          boxSizing: "border-box",
          overflow: "hidden",
          position: "relative",
          width: "100%",
          background: "#F4F4F4",
        }}
      >
        <p style={{ padding: 0, margin: 0 }}>
          <iframe
            src={PADLET_EMBED_URL}
            frameBorder="0"
            allow="camera;microphone;geolocation;display-capture;clipboard-write"
            style={{
              width: "100%",
              height: "calc(100vh - 120px)",
              minHeight: "608px",
              display: "block",
              padding: 0,
              margin: 0,
            }}
            title="IPSis Important Dates"
          />
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            margin: 0,
            height: "28px",
          }}
        >
          <a
            href="https://padlet.com?ref=embed"
            style={{
              display: "block",
              flexGrow: 0,
              margin: 0,
              border: "none",
              padding: 0,
              textDecoration: "none",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="https://padlet.net/embeds/made_with_padlet_2022.png"
                width="114"
                height="28"
                style={{
                  padding: 0,
                  margin: 0,
                  background: "0 0",
                  border: "none",
                  boxShadow: "none",
                }}
                alt="Made with Padlet"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

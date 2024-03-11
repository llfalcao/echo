export default function NotFound() {
  return (
    <div
      style={{
        fontFamily:
          "system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
        height: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <style>
          {`
            .next-error-h1 {
              border-right: 1px solid rgba(0, 0, 0, 0.3);
            }
            @media (prefers-color-scheme: dark) {
              .next-error-h1 {
                border-right: 1px solid rgba(255, 255, 255, 0.3);
              }
            }
            
          `}
        </style>
        <h1
          className="next-error-h1"
          style={{
            display: "inline-block",
            margin: "0px 20px 0px 0px",
            padding: "0px 23px 0px 0px",
            fontSize: "24px",
            fontWeight: "500",
            verticalAlign: "top",
            lineHeight: "49px",
          }}
        >
          404
        </h1>
        <div style={{ display: "inline-block" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "49px",
              margin: "0px",
            }}
          >
            This page could not be found.
          </h2>
        </div>
      </div>
    </div>
  );
}

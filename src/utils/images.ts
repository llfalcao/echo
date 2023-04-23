const toBase64 = (string: string) =>
  typeof window === "undefined"
    ? Buffer.from(string).toString("base64")
    : window.btoa(string);

export const getPlaceholder = (width: number, height: number) => {
  const svg = `
  <svg
    width="${width}"
    height="${height}"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <linearGradient
        id="placeholder-gradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" style="stop-color:#46464639;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#ffffff4e;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#4b4b4b30;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect
      width="${width}"
      height="${height}"
      fill="url(#placeholder-gradient)"
    />
  </svg>
`;

  return toBase64(svg);
};

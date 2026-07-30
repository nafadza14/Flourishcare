// Global grain/noise overlay — mimicking paper texture.
// Reference spec: SVG feTurbulence, mix-blend-mode overlay, opacity 0.35.

const NOISE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'>` +
      `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter>` +
      `<rect width='100%' height='100%' filter='url(#n)' opacity='0.9'/>` +
      `</svg>`
  );

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        backgroundImage: `url("${NOISE_SVG}")`,
        backgroundRepeat: "repeat",
        mixBlendMode: "overlay",
        opacity: 0.35,
      }}
    />
  );
}

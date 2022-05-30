const cos = Math.cos;
const sin = Math.sin;
const π = Math.PI;
export function degrees_to_radians(degrees: number) {
  var pi = Math.PI;
  return (degrees * pi) / 180;
}

export const matrixTimes = (
  [[a, b], [c, d]]: Array<Array<number>>,
  [x, y]: Array<number>
) => [a * x + b * y, c * x + d * y];

export const rotateMatrix = (x: number) => [
  [cos(x), -sin(x)],
  [sin(x), cos(x)],
];

export const addVector = ([a1, a2]: Array<number>, [b1, b2]: Array<number>) => [
  a1 + b1,
  a2 + b2,
];

export const generateEllipsePath = (
  [cx, cy]: Array<number>,
  [rx, ry]: Array<number>,
  [t1, Δ]: Array<number>,
  φ: number
) => {
  const path = svgEllipseArc(
    [cx, cy],
    [rx, ry],
    [degrees_to_radians(t1), degrees_to_radians(Δ)],
    degrees_to_radians(φ)
  );

  return path.map((x) => (typeof x === 'number' ? x.toFixed(0) : x)).join(' ');
};

/**
  Returns a SVG path element that represent a ellipse.
  cx,cy → center of ellipse
  rx,ry → major minor radius
  t1 → start angle, in radian.
  Δ → angle to sweep, in radian. positive.
  φ → rotation on the whole, in radian
  URL: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
 */
export const svgEllipseArc = (
  [cx, cy]: Array<number>,
  [rx, ry]: Array<number>,
  [t1, Δ]: Array<number>,
  φ: number
) => {
  Δ = Δ % (2 * π);
  const rotMatrix = rotateMatrix(φ);
  const [sX, sY] = addVector(
    matrixTimes(rotMatrix, [rx * cos(t1), ry * sin(t1)]),
    [cx, cy]
  );
  const [eX, eY] = addVector(
    matrixTimes(rotMatrix, [rx * cos(t1 + Δ), ry * sin(t1 + Δ)]),
    [cx, cy]
  );
  const fA = Δ > π ? 1 : 0;
  const fS = Δ > 0 ? 1 : 0;

  return [' M ', sX, ' ', sY, ' A ', rx, ry, (φ / π) * 180, fA, fS, eX, eY];
};

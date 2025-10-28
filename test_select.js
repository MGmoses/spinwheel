const categories = {
  MINDCo: ["a"],
  oneGov: ["b"],
  Tradian: ["c"],
  Wildcard: ["d"]
};

const segments = Object.keys(categories);
const numSegments = segments.length;
const arcSize = (2 * Math.PI) / numSegments;
const TWO_PI = 2 * Math.PI;
const pointerAngle = -Math.PI / 2;

function getCategory(rotation) {
  let adjusted = pointerAngle - rotation;
  adjusted = ((adjusted % TWO_PI) + TWO_PI) % TWO_PI;
  const index = Math.floor(adjusted / arcSize) % numSegments;
  return { index, category: segments[index] };
}

console.log('segments:', segments);

const testRotations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, Math.PI / 4];
for (const r of testRotations) {
  const res = getCategory(r);
  console.log(`rotation=${r.toFixed(3)} -> index=${res.index}, category=${res.category}`);
}

// Now validate mapping when wheel is rotated so each segment center aligns with pointer
console.log('\nChecking center-aligned rotations for each segment:');
for (let i = 0; i < numSegments; i++) {
  const center = i * arcSize + arcSize / 2;
  // rotation that makes center + rotation == pointerAngle  (mod 2pi)
  let rotation = pointerAngle - center;
  rotation = ((rotation % TWO_PI) + TWO_PI) % TWO_PI;
  const res = getCategory(rotation);
  console.log(`segment ${i} (center=${center.toFixed(3)}): rotation=${rotation.toFixed(3)} -> index=${res.index}, category=${res.category}`);
}

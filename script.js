const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const questionModal = document.getElementById("questionModal");
const questionText = document.getElementById("questionText");
const closeModal = document.getElementById("closeModal");

// ---- CATEGORY QUESTION BANK ----
const categories = {
  MINDCo: [
    "What does MINDCo stand for?",
    "When was MINDCo officially rebranded from Tradenet?",
    "What is MINDCo’s main mission?",
    "What is the national vision MINDCo is working toward by 2027?",
    "Name one of MINDCo’s flagship digital platforms.",
    "How many scholarships is MINDCo, Future Institute offering at VARA Expo?",
    "What does MINDCo aim to achieve through digitalisation?"
  ],
  oneGov: [
    "What is oneGov?",
    "What is the main goal of the oneGov platform?",
    "How does oneGov help citizens save time?",
    "Name 3 government agencies currently available through oneGov.",
    "What is the citizen support center for oneGov called?",
    "What is the Support Call center number for oneGov?"
  ],
  Tradian: [
    "What is Tradian?",
    "Which sector does Tradian primarily serve?",
    "What does “Single Window” mean in trade?",
    "How does Tradian help importers and exporters?",
    "What year was Tradian officially launched?",
    "What major benefit does Tradian offer traders?",
    "What is the vision of the Maldives National Single Window?",
    "How does Tradian contribute to ease of doing business?",
    "Name one stakeholder agency integrated into Tradian?",
    "Who operates Tradian?"
  ],
  Wildcard: [
    "What does “QR” in QR Code stand for?",
    "How many islands are there in the Maldives?",
    "What is the most used social media platform in the Maldives?",
    "What does AI stand for?",
    "Which country invented the internet?",
    "What year did the Maldives gain independence?",
    "What’s one benefit of using digital services instead of paper forms?",
    "What color is the MINDCo logo?",
    "Name one word that comes to mind when you think of “digital Maldives.”",
    "Who operates eFaas?"
  ]
};

// ---- WHEEL CONFIG ----
const segments = Object.keys(categories);
const numSegments = segments.length;
const arcSize = (2 * Math.PI) / numSegments;
let rotation = 0;
let isSpinning = false;

// ---- CANVAS RESIZE & DRAW WHEEL ----
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  // Use the CSS size (clientWidth) as the logical drawing area
  const logicalWidth = canvas.clientWidth || 400;
  const logicalHeight = canvas.clientHeight || logicalWidth;

  canvas.width = Math.round(logicalWidth * dpr);
  canvas.height = Math.round(logicalHeight * dpr);

  // Reset any transforms and scale to device pixel ratio so 1 unit = 1 CSS pixel
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  drawWheel();
}

function drawWheel() {
  const colors = ["#4900B8", "#084BFE", "#F93838 ", "#06D6A0 "];
  const w = canvas.clientWidth || 400;
  const h = canvas.clientHeight || w;
  const size = Math.min(w, h);
  const center = size / 2;
  const radius = size / 2;

  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < numSegments; i++) {
    const angle = i * arcSize;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, angle, angle + arcSize);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle + arcSize / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    // Scale font based on size for better responsiveness
    const fontSize = Math.max(12, Math.floor(size / 20));
    ctx.font = `bold ${fontSize}px Poppins`;
    ctx.fillText(segments[i], radius * 0.85, 10);
    ctx.restore();
  }
}

// Initial resize/draw and on device changes
resizeCanvas();
window.addEventListener('resize', () => {
  // Give layout a moment to settle on mobile orientation change
  setTimeout(resizeCanvas, 50);
});
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 100));

// ---- SPIN ANIMATION ----
function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;

  const spinAngle = Math.random() * 360 + 720; // Random + 2 full rotations
  const duration = 3500;
  const start = performance.now();
  const startRotation = rotation;

  function animate(currentTime) {
    const elapsed = currentTime - start;
    if (elapsed < duration) {
      const easeOut = 1 - Math.pow(1 - elapsed / duration, 3);
      rotation = startRotation + (spinAngle * easeOut) * Math.PI / 180;
      const w = canvas.clientWidth || 400;
      const h = canvas.clientHeight || w;
      const size = Math.min(w, h);
      const center = size / 2;

      ctx.save();
      ctx.clearRect(0, 0, w, h);
      ctx.translate(center, center);
      ctx.rotate(rotation);
      ctx.translate(-center, -center);
      drawWheel();
      ctx.restore();
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      rotation = rotation % (2 * Math.PI); // normalize rotation
      showCategoryQuestion();
    }
  }

  requestAnimationFrame(animate);
}

// ---- DETERMINE CATEGORY + SHOW QUESTION ----
function showCategoryQuestion() {
  // Determine which segment sits under the top pointer (pointer at -PI/2)
  // Calculate the pointer angle adjusted for the wheel rotation, then map to a segment index
  const TWO_PI = 2 * Math.PI;
  // pointerAngle is the absolute angle (in radians) that corresponds to the pointer location
  const pointerAngle = -Math.PI / 2; // top of the circle

  // For each segment i, its center angle (before rotation) is: i*arcSize + arcSize/2
  // After rotating the wheel by `rotation`, the segment center angle becomes: center + rotation
  // We want center + rotation === pointerAngle (mod 2PI) => center === pointerAngle - rotation (mod 2PI)
  let adjusted = pointerAngle - rotation;
  // Normalize to [0, 2PI)
  adjusted = ((adjusted % TWO_PI) + TWO_PI) % TWO_PI;

  const index = Math.floor(adjusted / arcSize) % numSegments;
  const category = segments[index];

  // Pick a random question from the resolved category
  const questionList = categories[category] || [];
  const randomQuestion = questionList.length
    ? questionList[Math.floor(Math.random() * questionList.length)]
    : "No questions available for this category.";

  questionText.textContent = `[${category}] ${randomQuestion}`;
  questionModal.style.display = "flex";
}

// ---- EVENT LISTENERS ----
spinBtn.addEventListener("click", spinWheel);
closeModal.addEventListener("click", () => {
  questionModal.style.display = "none";
});

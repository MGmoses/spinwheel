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

// ---- DRAW WHEEL ----
function drawWheel() {
  const colors = ["#FF7F50", "#FFD166", "#06D6A0", "#118AB2"];
  ctx.clearRect(0, 0, 400, 400);
  for (let i = 0; i < numSegments; i++) {
    const angle = i * arcSize;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, angle, angle + arcSize);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angle + arcSize / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Poppins";
    ctx.fillText(segments[i], 170, 10);
    ctx.restore();
  }
}

drawWheel();

// ---- SPIN ANIMATION ----
function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;

  const spinAngle = Math.random() * 360 + 720; // random + 2 full rotations
  const duration = 3500;
  const start = performance.now();
  const startRotation = rotation;

  function animate(currentTime) {
    const elapsed = currentTime - start;
    if (elapsed < duration) {
      const easeOut = 1 - Math.pow(1 - elapsed / duration, 3);
      rotation = startRotation + (spinAngle * easeOut) * Math.PI / 180;
      ctx.save();
      ctx.clearRect(0, 0, 400, 400);
      ctx.translate(200, 200);
      ctx.rotate(rotation);
      ctx.translate(-200, -200);
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

// ---- DETERMINE CATEGORY + QUESTION ----
function showCategoryQuestion() {
  // The pointer is at top center (0 radians)
  // Wheel rotation moves segments clockwise, so we invert it
  const point

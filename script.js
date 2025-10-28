const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const questionModal = document.getElementById("questionModal");
const questionText = document.getElementById("questionText");
const closeModal = document.getElementById("closeModal");

const questions = [
  "What does MINDCo stand for?",
  "When was MINDCo officially rebranded from Tradenet?",
  "If you could time travel, where would you go?",
  "What is MINDCo’s main mission?",
  "Name one of MINDCo’s flagship digital platforms",
  "How many scholarships is MINDCo, Future Institute offering at VARA Expo?",
  "What does MINDCo aim to achieve through digitalisation?",
  "What is oneGov?",
  "What is the main goal of the oneGov platform?",
  "How does oneGov help citizens save time?",
  "Name 3 government agencies currently available through oneGov",
  "What is the citizen support center for oneGov called?",
  "Describe your perfect day.",
  "What’s your favorite place in the world?",
  "What’s your proudest achievement?",
  "What’s a fun fact about you?",
  "What’s your favorite childhood memory?",
  "What’s a mistake you learned the most from?",
  "What motivates you to get out of bed each day?",
  "What is the Support Call center number for oneGov?",
  "What is Tradian?",
  "WWhich sector does Tradian primarily serve?",
  "What does “Single Window” mean in trade?",
  "How does Tradian help importers and exporters?",
  "What year was Tradian officially launched?",
  "What major benefit does Tradian offer traders?",
  "What is the vision of the Maldives National Single Window?",
  "How does Tradian contribute to ease of doing business?",
  "Name one stakeholder agency integrated into Tradian?",
  "Who operates Tradian?",
  "What does “QR” in QR Code stand for?",
  "How many islands are there in the Maldives?",
  "What is the most used social media platform in the Maldives?",
  "What does AI stand for?",
  "Which country invented the internet?",
  "What year did the Maldives gain independence?",
  "What’s one benefit of using digital services instead of paper forms?",
  "What color is the MINDCo logo?",
  "Name one word that comes to mind when you think of “Digital Maldives.”",
  "Who operates eFaas?"
];

const numSegments = 12;
const arcSize = (2 * Math.PI) / numSegments;
let rotation = 0;
let isSpinning = false;

function drawWheel() {
  for (let i = 0; i < numSegments; i++) {
    const angle = i * arcSize;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, angle, angle + arcSize);
    ctx.fillStyle = i % 2 === 0 ? "#ffcb3b" : "#ff7f50";
    ctx.fill();
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angle + arcSize / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Poppins";
    ctx.fillText(`${i + 1}`, 180, 5);
    ctx.restore();
  }
}

drawWheel();

function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;
  const spinAngle = Math.random() * 360 + 720; // 2 full rotations + random
  const duration = 3000;
  const start = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - start;
    if (elapsed < duration) {
      const easeOut = 1 - Math.pow(1 - elapsed / duration, 3);
      rotation = (spinAngle * easeOut) * Math.PI / 180;
      ctx.clearRect(0, 0, 400, 400);
      ctx.save();
      ctx.translate(200, 200);
      ctx.rotate(rotation);
      ctx.translate(-200, -200);
      drawWheel();
      ctx.restore();
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      showRandomQuestion();
    }
  }

  requestAnimationFrame(animate);
}

function showRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  questionText.textContent = questions[randomIndex];
  questionModal.style.display = "flex";
}

spinBtn.addEventListener("click", spinWheel);
closeModal.addEventListener("click", () => {
  questionModal.style.display = "none";
});

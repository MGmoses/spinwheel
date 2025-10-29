const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const questionModal = document.getElementById("questionModal");
const questionText = document.getElementById("questionText");
const closeModal = document.getElementById("closeModal");

// ---- CATEGORY QUESTION BANK ----
const categories = {
  WINNER: [
    "CONGRATULATIONS! You have won a free gift!"
  ],
  MINDCo: [
    "What does MINDCo stand for?",
    "When was MINDCo officially rebranded from Tradenet?",
    "What is the role of MINDCo?",
    "What is the national vision MINDCo is working toward by 2027?",
    "Name one of MINDCo's flagship digital platforms.",
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
  // Make WINNER visually distinct by using gold as the first color
  const colors = ["#ffd700", "#7fb9aa", "#6e8ac9", "#c67f7f", "#8c7aad"];
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
    // Use dark text on the WINNER segment for better contrast
    ctx.fillStyle = (segments[i] === 'WINNER') ? '#000' : '#fff';
    // Scale font based on size for better responsiveness
    const fontSize = Math.max(12, Math.floor(size / 20));
    ctx.font = `bold ${fontSize}px Poppins`;
    ctx.fillText(segments[i], radius * 0.85, 10);
    ctx.restore();
  }

  // Draw separators between segments and an outer ring for polish
  ctx.save();
  ctx.translate(center, center);
  // separator line width scales with canvas size
  const sepWidth = Math.max(1, Math.floor(size / 200));
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = sepWidth;
  for (let i = 0; i < numSegments; i++) {
    const angle = i * arcSize;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  // outer ring
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.lineWidth = Math.max(2, sepWidth + 1);
  ctx.stroke();
  ctx.restore();
}

// Simple confetti implementation: create several colored pieces that fall and are removed
function createConfetti(count = 40) {
  const container = document.getElementById('confetti');
  if (!container) return;

  const colors = ['#ffd700', '#ff4d4f', '#4caf50', '#4da6ff', '#ffb84d', '#b86bff'];
  const pieces = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const left = Math.random() * 100;
    el.style.left = `${left}%`;
    el.style.top = `${-5 - Math.random() * 10}vh`;
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    const duration = 2000 + Math.random() * 1800; // ms
    el.style.animation = `confetti-fall ${duration}ms linear forwards`;
    // Slight horizontal drift using transform translateX via inline keyframes not easily settable; we'll vary left as percent
    container.appendChild(el);
    pieces.push(el);
    // Remove after animation
    setTimeout(() => { try { el.remove(); } catch (e) {} }, duration + 500);
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
  questionText.textContent = `${randomQuestion}`;

  // Reference modal title and choices container
  const modalTitle = document.querySelector('.modal-content h2');
  const choicesContainer = document.getElementById('choices');

  // Special handling for MINDCo multiple choice questions
  if (category === 'MINDCo' && (
    randomQuestion === 'What does MINDCo stand for?' ||
    randomQuestion === 'When was MINDCo officially rebranded from Tradenet?' ||
    randomQuestion === 'What is the role of MINDCo?' ||
    randomQuestion === "Name one of MINDCo's flagship digital platforms." ||
    randomQuestion === "How many scholarships is MINDCo, Future Institute offering at VARA Expo?"
  )) {
    // Ensure title is visible
    if (modalTitle) { modalTitle.style.display = ''; modalTitle.textContent = 'Your Question'; }

    // Define options based on the question
    let options = [];
    let correctAnswer = '';

    if (randomQuestion === 'What does MINDCo stand for?') {
      options = [
        'Maldives Integration and Diversification Corporation',
        'Maldivian Investment and Diversification Company',
        'Maldives Innovation and Digital Company',
        'Maldives International and Domestic Company'
      ];
      correctAnswer = 'Maldives Innovation and Digital Company';
    } else if (randomQuestion === 'What is the role of MINDCo?') {
      options = [
        'Expanding minds through media',
        'The innovation arm of the government',
        'Researching mind control technology',
        'An AI development company'
      ];
      correctAnswer = 'The innovation arm of the government';
    } else if (randomQuestion === "Name one of MINDCo's flagship digital platforms.") {
      options = [
        'Steam',
        'Tradenet',
        'iBay',
        'oneGov'
      ];
      correctAnswer = 'oneGov';
    } else if (randomQuestion === "How many scholarships is MINDCo, Future Institute offering at VARA Expo?") {
      options = [
        '50',
        '25',
        '10',
        '5'
      ];
      correctAnswer = '25';
    } else {
      options = [
        'November 03, 2023',
        'July 10, 2022',
        'February 14, 2022',
        'October 15, 2025'
      ];
      correctAnswer = 'October 15, 2025';
    }

    if (choicesContainer) {
      choicesContainer.innerHTML = '';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.type = 'button';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          // Correct answer: trigger congratulations module + confetti
          if (opt === correctAnswer) {
            if (modalTitle) modalTitle.textContent = 'Congratulations!';
            questionText.textContent = 'CONGRATULATIONS! You selected the correct answer!';
            questionText.classList.add('congrats');
            // clear choices
            choicesContainer.innerHTML = '';
            try { createConfetti(80); } catch (e) { }
          } else {
            // Wrong answer - brief visual feedback
            btn.classList.add('wrong');
            setTimeout(() => btn.classList.remove('wrong'), 700);
          }
        });
        choicesContainer.appendChild(btn);
      });
    }
  } else {
    // Clear any choices for other questions/categories
    if (choicesContainer) choicesContainer.innerHTML = '';

    // Hide modal title and style specially when WINNER is selected
    if (category === 'WINNER') {
      if (modalTitle) modalTitle.style.display = 'none';
      questionText.style.color = '#ffd700';
      questionText.style.fontSize = '1.5em';
      questionText.style.fontWeight = 'bold';
      // play confetti when someone wins
      try { createConfetti(60); } catch (e) { /* ignore if confetti unavailable */ }
    } else {
      if (modalTitle) modalTitle.style.display = '';
      questionText.style.color = '';
      questionText.style.fontSize = '';
      questionText.style.fontWeight = '';
    }
  }

  questionModal.style.display = "flex";
}

// ---- EVENT LISTENERS ----
spinBtn.addEventListener("click", spinWheel);
closeModal.addEventListener("click", () => {
  // reset modal content when closed
  questionModal.style.display = "none";
  const modalTitle = document.querySelector('.modal-content h2');
  const choicesContainer = document.getElementById('choices');
  if (modalTitle) { modalTitle.textContent = 'Your Question'; modalTitle.style.display = ''; }
  if (choicesContainer) choicesContainer.innerHTML = '';
  questionText.classList.remove('congrats');
  questionText.style.color = '';
  questionText.style.fontSize = '';
  questionText.style.fontWeight = '';
});

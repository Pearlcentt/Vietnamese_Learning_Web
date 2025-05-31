const totalQuestions = 5;

// Initialize question files
let questionFiles = [
  "qtype1.html",
  "qtype2.html",
  "qtype3.html",
  "qtype4.html",
  "qtype5.html",
];

// Get lessonId from URL
const urlParams = new URLSearchParams(window.location.search);
const lessonId = urlParams.get("lessonId");

// Adjust questionFiles based on lessonId
if (lessonId === "q1") {
  questionFiles = ["qtype1.html"];
} else if (lessonId === "q2") {
  questionFiles = ["qtype2.html"];
} else if (lessonId === "q3") {
  questionFiles = ["qtype3.html"];
} else if (lessonId === "q4") {
  questionFiles = ["qtype4.html"];
} else if (lessonId === "q5") {
  questionFiles = ["qtype5.html"];
} else {
  questionFiles = [
    "qtype1.html",
    "qtype2.html",
    "qtype3.html",
    "qtype4.html",
    "qtype5.html",
  ];
}

// Initialize progress if not set
if (!localStorage.getItem("progress")) {
  localStorage.setItem("progress", "0");
  localStorage.setItem("prevPercentage", "0");
}

document.addEventListener("DOMContentLoaded", () => {
  const progress = parseInt(localStorage.getItem("progress")) || 0;
  const prevPercentage =
    parseFloat(localStorage.getItem("prevPercentage")) || 0;
  const progressFill = document.querySelector(".progress-fill");
  const doneButton = document.querySelector(".notify-done");
  const quitButton = document.querySelector(".quit");
  const startButton = document.querySelector(".start-box");

  // Reset progress if on q0.html
  if (window.location.pathname.includes("q0.html")) {
    localStorage.setItem("progress", "0");
    localStorage.setItem("prevPercentage", "0");
    if (progressFill) {
      progressFill.style.width = "0%";
    }
  } else if (progress > 0 && progressFill) {
    const previousQuestions = progress - 2;
    const previousPercentage =
      previousQuestions >= 0 ? (previousQuestions / totalQuestions) * 100 : 0;

    progressFill.style.transition = "none";
    progressFill.style.width = `${previousPercentage}%`;

    setTimeout(() => {
      const completedQuestions = progress - 1;
      const percentage = (completedQuestions / totalQuestions) * 100;
      progressFill.style.transition = "width 0.3s ease-in-out";
      progressFill.style.width = `${percentage}%`;
    }, 200);
  }

  // Handle Start button
  if (startButton) {
    startButton.addEventListener("click", () => {
      localStorage.setItem("progress", "1");
      localStorage.setItem("prevPercentage", "0");
      const randomIndex = Math.floor(Math.random() * questionFiles.length);
      // Use absolute path and preserve lessonId
      window.location.href = `/src/frontend/html/${questionFiles[randomIndex]}?lessonId=${lessonId}`;
    });
  }

  // Handle Quit button
  if (quitButton) {
    quitButton.addEventListener("click", () => {
      if (confirm("Bạn chắc muốn rời bài học không?")) {
        resetProgress();
        window.location.href = "/src/frontend/html/lessons.html";
      }
    });
    quitButton.addEventListener("mouseenter", () => {
      quitButton.style.backgroundColor = "#ff5608";
    });
    quitButton.addEventListener("mouseleave", () => {
      quitButton.style.backgroundColor = "#ddd";
    });
  }

  // Handle Done button
  if (doneButton) {
    doneButton.addEventListener("click", () => {
      if (doneButton.classList.contains("enabled")) {
        resetProgress();
        window.location.href = "/src/frontend/html/lessons.html";
      }
    });

    if (progress > totalQuestions) {
      doneButton.classList.add("enabled");
    } else {
      doneButton.classList.remove("enabled");
    }
  }

  if (
    progress > totalQuestions &&
    !window.location.pathname.includes("q0.html") &&
    progressFill
  ) {
    progressFill.style.width = "100%";
  }
});

function goToNextQuestion() {
  let progress = parseInt(localStorage.getItem("progress")) || 0;
  const progressFill = document.querySelector(".progress-fill");

  if (progress < totalQuestions) {
    progress += 1;
    const previousQuestions = progress - 2;
    const previousPercentage =
      previousQuestions >= 0 ? (previousQuestions / totalQuestions) * 100 : 0;
    const completedQuestions = progress - 1;
    const percentage = (completedQuestions / totalQuestions) * 100;

    localStorage.setItem("progress", progress.toString());
    localStorage.setItem("prevPercentage", percentage.toString());

    if (progressFill) {
      progressFill.style.transition = "none";
      progressFill.style.width = `${previousPercentage}%`;

      setTimeout(() => {
        progressFill.style.transition = "width 0.3s ease-in-out";
        progressFill.style.width = `${percentage}%`;
      }, 500);
    }

    // Use absolute path and preserve lessonId
    const randomIndex = Math.floor(Math.random() * questionFiles.length);
    window.location.href = `/src/frontend/html/${questionFiles[randomIndex]}?lessonId=${lessonId}`;
  } else {
    progress += 1;
    localStorage.setItem("progress", progress.toString());
    localStorage.setItem("prevPercentage", "100");

    if (progressFill) {
      progressFill.style.width = "100%";
    }

    const doneButton = document.querySelector(".notify-done");
    if (doneButton) {
      doneButton.classList.add("enabled");
    }

    const topicId = new URLSearchParams(window.location.search).get("topicId");
    if (topicId && lessonId) {
      saveLessonProgress(topicId, lessonId);
    }
  }
}

function resetProgress() {
  localStorage.setItem("progress", "0");
  localStorage.setItem("prevPercentage", "0");
  const progressFill = document.querySelector(".progress-fill");
  if (progressFill) {
    progressFill.style.width = "0%";
  }
}

function saveLessonProgress(topicId, lessonId) {
  fetch(`/api/progress/complete?topicId=${topicId}&lessonId=${lessonId}`, {
    method: "POST"
  })
      .then(res => res.text())
      .then(msg => console.log("Progress Saved:", msg))
      .catch(err => console.error("Failed to save progress", err));
}


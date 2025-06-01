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
  }  // Handle Start button
  if (startButton) {
    startButton.addEventListener("click", () => {
      localStorage.setItem("progress", "1");
      localStorage.setItem("prevPercentage", "0");
      
      // Extract topicId and lessonId from current URL path
      // Current URL should be like: /questions/start/1/1
      const pathParts = window.location.pathname.split('/');
      const topicId = pathParts[3]; // /questions/start/1/1 -> index 3 is topicId
      const lessonId = pathParts[4]; // /questions/start/1/1 -> index 4 is lessonId
      
      if (topicId && lessonId) {
        // Navigate to questions controller with proper parameters
        window.location.href = `/questions/${topicId}/${lessonId}`;
      } else {
        // Fallback navigation
        console.error("Missing topicId or lessonId in URL path. Current path:", window.location.pathname);
        window.location.href = '/dashboard';
      }
    });
  }
  // Handle Quit button
  if (quitButton) {
    quitButton.addEventListener("click", () => {
      if (confirm("Bạn chắc muốn rời bài học không?")) {
        resetProgress();
        // Navigate back to lessons or dashboard
        const urlParams = new URLSearchParams(window.location.search);
        const topicId = urlParams.get("topicId");
        if (topicId) {
          window.location.href = `/lessons?topicId=${topicId}`;
        } else {
          window.location.href = '/dashboard';
        }
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
        // Navigate back to lessons or dashboard
        const urlParams = new URLSearchParams(window.location.search);
        const topicId = urlParams.get("topicId");
        if (topicId) {
          window.location.href = `/lessons?topicId=${topicId}`;
        } else {
          window.location.href = '/dashboard';
        }
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

    // Get current URL parameters and stay in the same lesson
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get("topicId");
    const lessonId = urlParams.get("lessonId");
    
    if (topicId && lessonId) {
      // Reload the same question controller (it will generate new questions)
      window.location.href = `/questions/${topicId}/${lessonId}`;
    } else {
      // Fallback: refresh current page
      window.location.reload();
    }
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

    // Save progress when lesson is completed
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get("topicId");
    const lessonId = urlParams.get("lessonId");
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
  // Call our Spring Boot API endpoint
  fetch(`/api/progress/complete?topicId=${topicId}&lessonId=${lessonId}`, {
    method: "POST",
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(message => {
        console.log("Progress Saved:", message);
        // Optionally redirect to lessons page after successful completion
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const topicId = urlParams.get("topicId");
          if (topicId) {
            window.location.href = `/lessons?topicId=${topicId}`;
          } else {
            window.location.href = '/dashboard';
          }
        }, 2000); // Give user time to see completion message
      })
      .catch(err => {
        console.error("Failed to save progress:", err);
        // Even if save fails, we can still redirect (progress might be saved client-side)
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const topicId = urlParams.get("topicId");
          if (topicId) {
            window.location.href = `/lessons?topicId=${topicId}`;
          } else {
            window.location.href = '/dashboard';
          }
        }, 1000);
      });
}


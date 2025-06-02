const totalQuestions = 2;

// Initialize score tracking
let currentScore = 0;
let questionsAnswered = 0;

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

// Initialize score tracking in localStorage
if (!localStorage.getItem("currentScore")) {
  localStorage.setItem("currentScore", "0");
  localStorage.setItem("questionsAnswered", "0");
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
      // Reset score tracking when starting new lesson
      localStorage.setItem("currentScore", "0");
      localStorage.setItem("questionsAnswered", "0");
      
      // Extract topicId and lessonId from current URL path
      // Current URL should be like: /questions/start/1/1
      const pathParts = window.location.pathname.split('/');
      const topicId = pathParts[3]; // /questions/start/1/1 -> index 3 is topicId
      const lessonId = pathParts[4]; // /questions/start/1/1 -> index 4 is lessonId
      
      // Mark lesson as started in database
      if (topicId && lessonId) {
        startLessonProgress(topicId, lessonId);
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
  // Reset score tracking
  localStorage.setItem("currentScore", "0");
  localStorage.setItem("questionsAnswered", "0");
  const progressFill = document.querySelector(".progress-fill");
  if (progressFill) {
    progressFill.style.width = "0%";
  }
}

// Function to record answer result (called from question scripts)
function recordAnswer(isCorrect) {
  let currentScore = parseInt(localStorage.getItem("currentScore")) || 0;
  let questionsAnswered = parseInt(localStorage.getItem("questionsAnswered")) || 0;
  
  questionsAnswered++;
  if (isCorrect) {
    currentScore++;
  }
  
  localStorage.setItem("currentScore", currentScore.toString());
  localStorage.setItem("questionsAnswered", questionsAnswered.toString());
  
  console.log(`Question answered. Score: ${currentScore}/${questionsAnswered}`);
}

// Function to get CSRF token
function getCsrfToken() {
  const tokenElement = document.querySelector('meta[name="_csrf"]') || 
                      document.querySelector('input[name="_csrf"]');
  if (tokenElement) {
    return tokenElement.getAttribute('content') || tokenElement.value;
  }
  
  // Try to get from cookie
  const csrfCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='));
  
  if (csrfCookie) {
    return csrfCookie.split('=')[1];
  }
  
  console.warn("CSRF token not found");
  return null;
}

// Function to get CSRF header name
function getCsrfHeaderName() {
  const headerElement = document.querySelector('meta[name="_csrf_header"]');
  return headerElement ? headerElement.getAttribute('content') : 'X-CSRF-TOKEN';
}

function startLessonProgress(topicId, lessonId) {
  console.log("=== Starting lesson progress ===");
  
  const csrfToken = getCsrfToken();
  const csrfHeaderName = getCsrfHeaderName();
  
  console.log("CSRF token:", csrfToken);
  console.log("CSRF header name:", csrfHeaderName);
  
  const headers = {
    'X-Requested-With': 'XMLHttpRequest'
  };
  
  if (csrfToken) {
    headers[csrfHeaderName] = csrfToken;
  }
  
  // Call API to mark lesson as started (In Progress)
  fetch(`/api/progress/start?topicId=${topicId}&lessonId=${lessonId}`, {
    method: "POST",
    headers: headers,
    credentials: 'same-origin'
  })
  .then(response => {
    console.log("Start lesson response status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  })
  .then(message => {
    console.log("Lesson started:", message);
  })
  .catch(err => {
    console.error("Failed to start lesson progress:", err);
    // Continue anyway - this is not critical for lesson functionality
  });
}

function saveLessonProgress(topicId, lessonId) {
  // Get actual score data from localStorage
  const currentScore = parseInt(localStorage.getItem("currentScore")) || 0;
  const questionsAnswered = parseInt(localStorage.getItem("questionsAnswered")) || 0;
  
  console.log(`=== saveLessonProgress called ===`);
  console.log(`topicId: ${topicId}, lessonId: ${lessonId}`);
  console.log(`currentScore: ${currentScore}, questionsAnswered: ${questionsAnswered}`);
  
  // Validate parameters
  if (!topicId || !lessonId || topicId === "unknown" || lessonId === "unknown") {
    console.error("Invalid topicId or lessonId for progress save:", { topicId, lessonId });
    return;
  }
  
  // Ensure we have at least 1 question answered to avoid division by zero
  const totalQuestions = Math.max(questionsAnswered, 1);
  
  const apiUrl = `/api/progress/complete?topicId=${topicId}&lessonId=${lessonId}&score=${currentScore}&totalQuestions=${totalQuestions}`;
  console.log(`API URL: ${apiUrl}`);
    // Call our Spring Boot API endpoint with actual score data  console.log("=== Making fetch request ===");
  console.log("Request URL:", apiUrl);
  console.log("Request method: POST");
  
  const csrfToken = getCsrfToken();
  const csrfHeaderName = getCsrfHeaderName();
  
  console.log("CSRF token:", csrfToken);
  console.log("CSRF header name:", csrfHeaderName);
  
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  
  if (csrfToken) {
    headers[csrfHeaderName] = csrfToken;
  }
  
  console.log("Request headers:", headers);
  
  try {
    const fetchPromise = fetch(apiUrl, {
      method: "POST",
      headers: headers,
      credentials: 'same-origin'  // Include cookies for Spring Security authentication
    });
    
    console.log("Fetch promise created:", fetchPromise);
    
    fetchPromise.then(response => {
        console.log("=== Fetch response received ===");
        console.log(`Response status: ${response.status}`);
        console.log(`Response ok: ${response.ok}`);
        console.log(`Response statusText: ${response.statusText}`);
        console.log(`Response headers:`, response.headers);
        
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
          // Try to read response body for more error details
          return response.text().then(errorText => {
            console.error("Error response body:", errorText);
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
          });
        }
        return response.text();
      }).then(message => {
        console.log("Progress Saved:", message);
        console.log("Backend response:", message);
        // Reset score tracking after successful save
        localStorage.setItem("currentScore", "0");
        localStorage.setItem("questionsAnswered", "0");
        
        // Extract topicId from current URL path for redirect
        const pathParts = window.location.pathname.split('/');
        let redirectTopicId = null;
        
        if (pathParts.length >= 3 && pathParts[1] === 'questions') {
          redirectTopicId = pathParts[2];
        }
        
        // Fallback: try URL params
        if (!redirectTopicId) {
          const urlParams = new URLSearchParams(window.location.search);
          redirectTopicId = urlParams.get("topicId");
        }
      })      .catch(err => {
        console.error("=== Fetch error caught ===");
        console.error("Error type:", typeof err);
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        console.error("Full error object:", err);
        
        // Check if it's a network error
        if (err instanceof TypeError && err.message.includes('fetch')) {
          console.error("This appears to be a network error - server might not be reachable");
        }
        
        // Even if save fails, we can still redirect (progress might be saved client-side)
        
        // Extract topicId from current URL path for redirect
        const pathParts = window.location.pathname.split('/');
        let redirectTopicId = null;
        
        if (pathParts.length >= 3 && pathParts[1] === 'questions') {
          redirectTopicId = pathParts[2];
        }
        
        // Fallback: try URL params
        if (!redirectTopicId) {
          const urlParams = new URLSearchParams(window.location.search);
          redirectTopicId = urlParams.get("topicId");
        }
      });
      
  } catch (immediateError) {
    console.error("=== Immediate error in fetch setup ===");
    console.error("Immediate error:", immediateError);
    console.error("This error occurred before the fetch was even attempted");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  console.log("answer.js loaded");

  const checkButton = document.querySelector(".Check");
  const resultMessage = document.querySelector(".result-message");
  const tickIcon = document.querySelector(".tick-icon");
  const errorIcon = document.querySelector(".error-icon");
  const doneButton = document.querySelector(".notify-done");

  // Debug: Kiểm tra checkButton
  console.log("checkButton:", checkButton);

  if (checkButton) {
    // Hover sáng hơn
    checkButton.addEventListener("mouseenter", () => {
      const currentColor = window.getComputedStyle(checkButton).backgroundColor;
      if (currentColor === "rgb(82, 245, 42)") {
        // #52f52a
        checkButton.style.backgroundColor = "#8df757";
      } else if (currentColor === "rgb(255, 29, 13)") {
        // #ff1d0d
        checkButton.style.backgroundColor = "#ff4d3d";
      }
    });

    checkButton.addEventListener("mouseleave", () => {
      const currentColor = window.getComputedStyle(checkButton).backgroundColor;
      if (currentColor === "rgb(141, 247, 87)") {
        // #8df757
        checkButton.style.backgroundColor = "#52f52a";
      } else if (currentColor === "rgb(255, 77, 61)") {
        // #ff4d3d
        checkButton.style.backgroundColor = "#ff1d0d";
      }
    });

    // Enter
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Ngăn hành vi mặc định của Enter
        checkButton.click();
      }
    });
  } else {
    console.error("checkButton not found");
  }

  // Function to show score alert with updated format
  function showScoreAlert(correctAnswers, totalQuestions, callback) {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    // Create alert box
    const alertBox = document.createElement("div");
    alertBox.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
    `;

    // Calculate score: (correct answers / total questions) * 10000
    const scoreEarned = Math.round((correctAnswers / totalQuestions) * 10000);
    const maxScore = 10000;

    // Score display - format: "X/10000 points"
    const scoreDisplay = document.createElement("h2");
    scoreDisplay.style.cssText = `
      color: #333;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: bold;
    `;
    scoreDisplay.textContent = `${scoreEarned}/${maxScore} points`;

    // Congratulations message
    const message = document.createElement("p");
    message.style.cssText = `
      color: #666;
      margin-bottom: 25px;
      font-size: 16px;
      line-height: 1.5;
    `;

    // Updated message to show actual answers
    if (correctAnswers === totalQuestions) {
      message.textContent = `Excellent! Perfect score!\nYou got all ${totalQuestions} questions right!`;
    } else {
      message.textContent = `Good job! You got ${correctAnswers} out of ${totalQuestions} questions correct.`;
    }

    // Home button
    const homeButton = document.createElement("button");
    homeButton.style.cssText = `
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      transition: background-color 0.3s;
    `;
    homeButton.textContent = "Home";

    // Button hover effect
    homeButton.addEventListener("mouseenter", () => {
      homeButton.style.backgroundColor = "#45a049";
    });
    homeButton.addEventListener("mouseleave", () => {
      homeButton.style.backgroundColor = "#4CAF50";
    });

    // Home button click handler
    homeButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
      if (callback) callback();
    });

    // Assemble alert
    alertBox.appendChild(scoreDisplay);
    alertBox.appendChild(message);
    alertBox.appendChild(homeButton);
    overlay.appendChild(alertBox);

    // Add to page
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        if (callback) callback();
      }
    });
  }

  // Add doneButton event listener
  if (doneButton) {
    doneButton.addEventListener("click", () => {
      console.log("Done button clicked");

      // Get current score and questions answered from localStorage or calculate from current answers
      let currentScore = parseInt(localStorage.getItem("currentScore")) || 0;
      let questionsAnswered =
        parseInt(localStorage.getItem("questionsAnswered")) || 0;

      // Calculate score for this question type
      let correctAnswers = 0;
      let totalQuestions = 1; // For qtype2, typically one question per page

      // Check if the selected answer is correct
      const selectedButton =
        document.querySelector(
          ".choice-box[style*='background-color: rgb(82, 245, 42)']"
        ) ||
        document.querySelector(
          ".choice-box[style*='background-color: #52f52a']"
        );

      if (selectedButton) {
        // Check if this button shows correct answer
        const selectedText =
          selectedButton.querySelector(".choice-word")?.textContent ||
          selectedButton.textContent;
        const correctAnswer = window.questionData?.answer || "";

        if (selectedText.trim() === correctAnswer.trim()) {
          correctAnswers = 1;
        }
      }

      // Also check Fill-box elements if they exist (for other question types)
      const fillBoxes = document.querySelectorAll(".Fill-box");
      if (fillBoxes.length > 0) {
        totalQuestions = fillBoxes.length;
        correctAnswers = 0;
        fillBoxes.forEach((box) => {
          if (box.classList.contains("correct")) {
            correctAnswers++;
          }
        });
      }

      // Update score calculation: proportion of correct answers * 10000
      const questionScore = Math.round(
        (correctAnswers / totalQuestions) * 10000
      );
      currentScore += questionScore;
      questionsAnswered++;

      // Update localStorage
      localStorage.setItem("currentScore", currentScore.toString());
      localStorage.setItem("questionsAnswered", questionsAnswered.toString());
      console.log(
        `Question completed: ${correctAnswers}/${totalQuestions} correct, Score: ${questionScore}, Total Score: ${currentScore}`
      );
      console.log(
        `Current localStorage - Score: ${localStorage.getItem(
          "currentScore"
        )}, Questions: ${localStorage.getItem("questionsAnswered")}`
      );

      // Record the answer in progress tracking BEFORE showing alert
      if (typeof recordAnswer === "function") {
        console.log(
          "Calling recordAnswer with:",
          correctAnswers === totalQuestions
        );
        recordAnswer(correctAnswers === totalQuestions);
      } else {
        console.error("recordAnswer function not found");
      }

      // Show score alert and handle navigation after user clicks Home
      showScoreAlert(correctAnswers, totalQuestions, () => {
        // Save lesson progress and navigate only after clicking Home
        if (typeof saveLessonProgress === "function") {
          // Get topicId and lessonId from URL path (format: /questions/{topicId}/{lessonId})
          const pathParts = window.location.pathname.split("/");
          let topicId = null;
          let lessonId = null;

          // Try to extract from path like /questions/1/2
          if (pathParts.length >= 4 && pathParts[1] === "questions") {
            topicId = pathParts[2];
            lessonId = pathParts[3];
          }

          // Fallback: try to get from URL parameters
          if (!topicId || !lessonId) {
            const urlParams = new URLSearchParams(window.location.search);
            topicId = topicId || urlParams.get("topicId");
            lessonId = lessonId || urlParams.get("lessonId");
          }

          if (topicId && lessonId) {
            console.log(
              `Calling saveLessonProgress with topicId: ${topicId}, lessonId: ${lessonId}`
            );
            saveLessonProgress(topicId, lessonId);
          } else {
            console.error("Missing topicId or lessonId");
            console.log("Current URL:", window.location.href);
            console.log("Path parts:", pathParts);
            console.log("URL search params:", window.location.search);
          }
        } else {
          console.error("saveLessonProgress function not found");
        }
      });
    });
  } else {
    console.log("doneButton not found");
  }
});

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
  }  // Add doneButton event listener
  if (doneButton) {
    doneButton.addEventListener("click", () => {
      console.log("Done button clicked");
      
      // Get current score and questions answered from localStorage (already tracked by individual question handlers)
      let currentScore = parseInt(localStorage.getItem("currentScore")) || 0;
      let questionsAnswered = parseInt(localStorage.getItem("questionsAnswered")) || 0;
      
      console.log(`Final lesson stats - Score: ${currentScore}, Questions: ${questionsAnswered}`);
      
      // Save lesson progress if this is the last question or user wants to finish
      if (typeof saveLessonProgress === 'function') {
        // Get topicId and lessonId from URL path (format: /questions/{topicId}/{lessonId})
        const pathParts = window.location.pathname.split('/');
        let topicId = null;
        let lessonId = null;
        
        // Try to extract from path like /questions/1/2
        if (pathParts.length >= 4 && pathParts[1] === 'questions') {
          topicId = pathParts[2];
          lessonId = pathParts[3];
        }
        
        // Fallback: try to get from URL parameters
        if (!topicId || !lessonId) {
          const urlParams = new URLSearchParams(window.location.search);
          topicId = topicId || urlParams.get("topicId");
          lessonId = lessonId || urlParams.get("lessonId");
        }
        
        console.log("Debug - URL Info:");
        console.log("Current URL:", window.location.href);
        console.log("Path parts:", pathParts);
        console.log("Extracted topicId:", topicId);
        console.log("Extracted lessonId:", lessonId);
        console.log("Current score:", currentScore);
        console.log("Questions answered:", questionsAnswered);
        
        if (topicId && lessonId) {
          console.log(`Calling saveLessonProgress with topicId: ${topicId}, lessonId: ${lessonId}`);
          saveLessonProgress(topicId, lessonId);
        } else {
          console.error("Missing topicId or lessonId for progress save");
          console.log("URL search params:", window.location.search);
          console.log("Available path parts:", pathParts);
          
          // Still try to call the function with whatever we have
          console.log("Attempting fallback save with available parameters...");
          if (topicId || lessonId) {
            saveLessonProgress(topicId || "unknown", lessonId || "unknown");
          }
        }
      } else {
        console.error("saveLessonProgress function not found");
      }
    });
  } else {
    console.log("doneButton not found");
  }
});

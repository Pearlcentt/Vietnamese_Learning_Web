document.addEventListener("DOMContentLoaded", () => {
  console.log("choose-1.js loaded");

  // Get the correct answer from the server data
  const correctAnswer = window.questionData && window.questionData.answer ? window.questionData.answer : "default";
  const ignoreDiv = document.querySelector(".Ignore");
  const buttons = document.querySelectorAll(".choice-box");
  const checkButton = document.querySelector(".Check");
  let selectedButton = null; // Nút đã chọn
  let isIgnored = false;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (selectedButton) {
        selectedButton.style.backgroundColor = "";
      }

      selectedButton = button;

      // Đổi màu nền của nút mới
      button.style.backgroundColor = "#aecbfc";
      checkButton.style.backgroundColor = "#52f52a";
    });
  });

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      if (button !== selectedButton) {
        button.style.backgroundColor = "#eee"; // Hover sáng hơn
      }
    });

    button.addEventListener("mouseleave", () => {
      if (button !== selectedButton) {
        button.style.backgroundColor = "";
      }
    });
  });
  checkButton.addEventListener("click", () => {
    if (checkButton.innerText === "Continue") {
      if (typeof goToNextQuestion === "function") {
        goToNextQuestion();
      } else {
        console.error("goToNextQuestion function not found");
        // Fallback: try to navigate manually
        window.location.href = '/lessons';
      }
      return;
    }

    const selectedWord = selectedButton ? selectedButton.innerText : null; // Lấy từ đã chọn
    const resultMessage = document.querySelector(".result-message");
    const tickIcon = document.querySelector(".tick-icon");
    const errorIcon = document.querySelector(".error-icon");
    const submitSection = document.querySelector(".Submit-section");

    // Disable options
    buttons.forEach((btn) => {
      btn.style.pointerEvents = "none";
    });    // Hide Ignore
    ignoreDiv.classList.add("hidden");

    if (selectedWord === correctAnswer) {
      selectedButton.style.backgroundColor = "#52f52a";
      resultMessage.textContent = "Correct!";
      resultMessage.classList.add("show");
      tickIcon.classList.add("show");
      errorIcon.classList.add("hidden");
      // Record correct answer
      recordAnswer(true);
    } else {
      selectedButton.style.backgroundColor = "#f76c6c";
      resultMessage.textContent = "Incorrect!";
      resultMessage.style.color = "red";
      resultMessage.classList.add("show");
      tickIcon.classList.add("hidden");
      errorIcon.classList.add("show");
      checkButton.style.backgroundColor = "#ff1d0d";
      // Record incorrect answer
      recordAnswer(false);
    }
    checkButton.innerText = "Continue";
  });

  if (ignoreDiv) {
    ignoreDiv.addEventListener("mouseenter", () => {
      ignoreDiv.style.backgroundColor = "#eee";
    });
    ignoreDiv.addEventListener("mouseleave", () => {
      ignoreDiv.style.backgroundColor = "#ddd";
    });

    // Xử lý nhấn nút Ignore
    ignoreDiv.addEventListener("click", () => {
      // Disable các nút lựa chọn
      buttons.forEach((btn) => {
        btn.style.pointerEvents = "none";
      });

      // Ẩn nút Ignore
      ignoreDiv.classList.add("hidden");

      const resultMessage = document.querySelector(".result-message");
      const tickIcon = document.querySelector(".tick-icon");
      const errorIcon = document.querySelector(".error-icon");
      resultMessage.textContent = "Try again later!";
      resultMessage.style.color = "red";
      resultMessage.classList.add("show");
      tickIcon.classList.add("hidden");
      errorIcon.classList.add("show");      checkButton.style.backgroundColor = "#ff1d0d";
      checkButton.innerText = "Continue";

      isIgnored = true;
      // Record ignored as incorrect
      recordAnswer(false);
    });
  }
});

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
});

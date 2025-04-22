const ignoreButton = document.querySelector(".Ignore");
const submitButton = document.querySelector(".Check");
const resultMessage = document.querySelector(".result-message");
const tickIcon = document.querySelector(".tick-icon");
const errorIcon = document.querySelector(".error-icon");

// ignoreButton.addEventListener("click", () => {
//   alert("Đừng bỏ qua");
// });
ignoreButton.addEventListener("mouseenter", () => {
  ignoreButton.style.backgroundColor = "#eee";
});
ignoreButton.addEventListener("mouseleave", () => {
  ignoreButton.style.backgroundColor = "#ddd";
});

submitButton.addEventListener("mouseenter", () => {
  const currentColor = window.getComputedStyle(submitButton).backgroundColor;
  if (currentColor === "rgb(82, 245, 42)") {
    // #52f52a
    submitButton.style.backgroundColor = "#8df757"; // Xanh sáng hơn
  } else if (currentColor === "rgb(255, 29, 13)") {
    // #ff1d0d
    submitButton.style.backgroundColor = "#ff4d3d"; // Đỏ sáng hơn
  }
});

submitButton.addEventListener("mouseleave", () => {
  const currentColor = window.getComputedStyle(submitButton).backgroundColor;
  if (currentColor === "rgb(141, 247, 87)") {
    submitButton.style.backgroundColor = "#52f52a"; // Khôi phục xanh
  } else if (currentColor === "rgb(255, 77, 61)") {
    submitButton.style.backgroundColor = "#ff1d0d"; // Khôi phục đỏ
  }
});

// // Xử lý nút Ignore (bỏ qua câu này))
// if (ignoreButton) {
//   ignoreButton.addEventListener("click", () => {
//     // Hide Ignore
//     const ignoreDiv = document.querySelector(".Ignore");
//     ignoreDiv.classList.add("hidden");
//     resultMessage.textContent = "Try again later!";
//     resultMessage.style.color = "red";
//     resultMessage.classList.add("show");
//     tickIcon.classList.add("hidden");
//     errorIcon.classList.add("show");
//     submitButton.style.backgroundColor = "#ff1d0d";
//     submitButton.innerText = "Continue";
//   });
// }

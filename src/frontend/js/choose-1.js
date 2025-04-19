const correctAnswer = "two";
const buttons = document.querySelectorAll(".choice-box");
const checkButton = document.querySelector(".Check");
let selectedButton = null; // Lưu nút đã chọn

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // Nếu đã có nút được chọn trước đó, bỏ màu của nó
    if (selectedButton) {
      selectedButton.style.backgroundColor = "";
    }

    // Gán nút mới là selected
    selectedButton = button;

    // Đổi màu nền của nút mới
    button.style.backgroundColor = "#aecbfc";
    checkButton.style.backgroundColor = "#52f52a";
  });
});

buttons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    if (button !== selectedButton) {
      button.style.backgroundColor = "#eee"; // Hover nhẹ hơn
    }
  });

  button.addEventListener("mouseleave", () => {
    if (button !== selectedButton) {
      button.style.backgroundColor = ""; // Trả lại màu gốc nếu không được chọn
    }
  });
});

checkButton.addEventListener("click", () => {
  const selectedWord = selectedButton ? selectedButton.innerText : null; // Lấy từ đã chọn
  const ignoreDiv = document.querySelector(".Ignore");
  const resultMessage = document.querySelector(".result-message");
  const tickIcon = document.querySelector(".tick-icon");
  const errorIcon = document.querySelector(".error-icon");
  const submitSection = document.querySelector(".Submit-section");

  // Disable options
  buttons.forEach((btn) => {
    btn.style.pointerEvents = "none";
  });

  // Hide Ignore
  ignoreDiv.classList.add("hidden");

  if (selectedWord === correctAnswer) {
    selectedButton.style.backgroundColor = "#52f52a";
    // submitSection.classList.add("correct");
    resultMessage.textContent = "Correct!";
    resultMessage.classList.add("show");
    tickIcon.classList.add("show");
    errorIcon.classList.add("hidden");
  } else {
    selectedButton.style.backgroundColor = "#f76c6c";
    // submitSection.classList.add("incorrect");
    resultMessage.textContent = "Incorrect!";
    resultMessage.style.color = "red";
    resultMessage.classList.add("show");
    tickIcon.classList.add("hidden");
    errorIcon.classList.add("show");
    checkButton.style.backgroundColor = "#ff1d0d";
  }
  checkButton.innerText = "Continue";
});

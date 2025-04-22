const correctAnswer = "eyes";
const chosenButtons = document.querySelectorAll(".Fill-box");
const blankButton = document.querySelector(".sentence-part2");
const checkButton = document.querySelector(".Check");
let selectedButton = null;

chosenButtons.forEach((chosenButton) => {
  chosenButton.addEventListener("click", () => {
    // handle selected word, replace
    if (selectedButton) {
      document.querySelector(".Fills").appendChild(selectedButton);
    }
    chosenButton.style.backgroundColor = "";
    blankButton.appendChild(chosenButton);

    blankButton.style.borderBottom = "none";
    checkButton.style.backgroundColor = "#52f52a";
    selectedButton = chosenButton;
  });
});

chosenButtons.forEach((chosenButton) => {
  chosenButton.addEventListener("mouseenter", () => {
    if (chosenButton !== selectedButton) {
      chosenButton.style.backgroundColor = "#eee"; // Hover nhẹ hơn
    }
  });

  chosenButton.addEventListener("mouseleave", () => {
    if (chosenButton !== selectedButton) {
      chosenButton.style.backgroundColor = ""; // Trả lại màu gốc nếu không được chọn
    }
  });
});

checkButton.addEventListener("click", () => {
  if (checkButton.innerText === "Continue") {
    goToNextQuestion();
    return;
  }
  const selectedWord = selectedButton ? selectedButton.innerText : null; // Lấy từ đã chọn
  const ignoreDiv = document.querySelector(".Ignore");
  const resultMessage = document.querySelector(".result-message");
  const tickIcon = document.querySelector(".tick-icon");
  const errorIcon = document.querySelector(".error-icon");
  const submitSection = document.querySelector(".Submit-section");

  // Disable options
  chosenButtons.forEach((btn) => {
    btn.style.pointerEvents = "none";
  });

  // Hide Ignore
  ignoreDiv.classList.add("hidden");

  if (selectedWord === correctAnswer) {
    selectedButton.style.backgroundColor = "#52f52a";
    resultMessage.textContent = "Correct!";
    resultMessage.style.color = "green";
    resultMessage.classList.add("show");
    tickIcon.classList.add("show");
    errorIcon.classList.add("hidden");
  } else {
    resultMessage.textContent = "Incorrect!";
    resultMessage.style.color = "red";
    resultMessage.classList.add("show");
    tickIcon.classList.add("hidden");
    errorIcon.classList.add("show");
    checkButton.style.backgroundColor = "#ff1d0d";
  }
  checkButton.innerText = "Continue";
});

if (ignoreButton) {
  ignoreButton.addEventListener("mouseenter", () => {
    ignoreButton.style.backgroundColor = "#eee";
  });
  ignoreButton.addEventListener("mouseleave", () => {
    ignoreButton.style.backgroundColor = "#ddd";
  });

  // Xử lý nhấn nút Ignore
  ignoreButton.addEventListener("click", () => {
    // Disable các nút lựa chọn
    buttons.forEach((btn) => {
      btn.style.pointerEvents = "none";
    });

    // Ẩn nút Ignore
    ignoreButton.classList.add("hidden");

    // Hiển thị thông báo và biểu tượng lỗi
    resultMessage.textContent = "Try again later!";
    resultMessage.style.color = "red";
    resultMessage.classList.add("show");
    tickIcon.classList.add("hidden");
    errorIcon.classList.add("show");

    // Đổi nút Check thành Continue và màu đỏ
    submitButton.style.backgroundColor = "#ff1d0d";
    submitButton.innerText = "Continue";

    // Đánh dấu là đã nhấn Ignore
    isIgnored = true;
  });
}

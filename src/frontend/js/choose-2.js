const correctAnswer = "eyes";
const ignoreDiv = document.querySelector(".Ignore");
const chosenButtons = document.querySelectorAll(".Fill-box");
const blankButton = document.querySelector(".sentence-part2");
const checkButton = document.querySelector(".Check");
let selectedButton = null;
let isIgnored = false; // Theo dõi trạng thái nhấn Ignore

chosenButtons.forEach((chosenButton) => {
  chosenButton.addEventListener("click", () => {
    // Handle selected word, replace
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
    goToNextQuestion(); // Chuyển sang câu hỏi tiếp theo trong mọi trường hợp
    return;
  }

  const selectedWord = selectedButton ? selectedButton.innerText : null; // Lấy từ đã chọn
  const resultMessage = document.querySelector(".result-message");
  const tickIcon = document.querySelector(".tick-icon");
  const errorIcon = document.querySelector(".error-icon");

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
    chosenButtons.forEach((btn) => {
      btn.style.pointerEvents = "none";
    });

    // Ẩn nút Ignore
    ignoreDiv.classList.add("hidden");

    // Hiển thị thông báo và biểu tượng lỗi
    const resultMessage = document.querySelector(".result-message");
    const tickIcon = document.querySelector(".tick-icon");
    const errorIcon = document.querySelector(".error-icon");
    resultMessage.textContent = "Try again later!";
    resultMessage.style.color = "red";
    resultMessage.classList.add("show");
    tickIcon.classList.add("hidden");
    errorIcon.classList.add("show");

    // Đổi nút Check thành Continue và màu đỏ
    checkButton.style.backgroundColor = "#ff1d0d";
    checkButton.innerText = "Continue";

    // Đánh dấu là đã nhấn Ignore
    isIgnored = true;
  });
}

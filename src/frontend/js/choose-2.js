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

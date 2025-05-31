document.addEventListener("DOMContentLoaded", function () {
  const checkButton = document.querySelector(".Check");
  const ignoreDiv = document.querySelector(".Ignore");
  const resultMessage = document.querySelector(".result-message");
  const tickIcon = document.querySelector(".tick-icon");
  const errorIcon = document.querySelector(".error-icon");

  const tokenCont = document.querySelector(".line-wait");
  const firstContainer = document.getElementById("first-line");
  const secondContainer = document.getElementById("second-line");
  const lineUnder = document.querySelector(".line-answer");
  const word = "Bành trướng lãnh địa";
  const text = word.split(" ");
  let selectedChars = []; // Lưu {char, slotIndex} để theo dõi vị trí
  let correctOrder = word.split(" ");
  let charBoxes = []; // Lưu trữ các charBox để quản lý trả về
  let isIgnored = false; // Theo dõi trạng thái nhấn Ignore

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Tạo các ô trả lời
  function createAnswerSlots() {
    lineUnder.innerHTML = "";
    text.forEach((_, index) => {
      const slot = document.createElement("span");
      slot.classList.add("answer-slot");
      slot.style.width = "9rem";
      slot.style.height = "5rem";
      slot.style.display = "inline-flex";
      slot.style.justifyContent = "center";
      slot.style.alignItems = "center";
      slot.style.margin = "0 2px";
      slot.dataset.index = index;
      slot.addEventListener("click", () => handleSlotClick(slot));
      lineUnder.appendChild(slot);
    });
  }

  // Phân ký tự vào các dòng
  function arrangeCharacters() {
    firstContainer.innerHTML = "";
    secondContainer.innerHTML = "";
    lineUnder.innerHTML = "";
    charBoxes = [];
    selectedChars = [];

    const shuffledText = shuffleArray([...text]);

    let firstLineFull = false;
    let maxWidth = tokenCont.offsetWidth;
    let currentWidth = 0;

    shuffledText.forEach((char, index) => {
      const charBox = document.createElement("span");
      charBox.classList.add("char-box");
      charBox.textContent = char;
      charBox.dataset.char = char;
      charBox.dataset.index = index;
      charBoxes.push(charBox);

      charBox.addEventListener("click", () => handleCharClick(charBox));

      document.body.appendChild(charBox);
      let charWidth = charBox.offsetWidth + 4;
      document.body.removeChild(charBox);

      if (!firstLineFull && currentWidth + charWidth <= maxWidth) {
        firstContainer.appendChild(charBox);
        currentWidth += charWidth;
      } else {
        firstLineFull = true;
        secondContainer.appendChild(charBox);
      }
    });

    createAnswerSlots();
  }

  // Xử lý khi click vào ký tự
  function handleCharClick(charBox) {
    if (charBox.classList.contains("disabled")) return;

    const char = charBox.dataset.char;
    const answerSlots = document.querySelectorAll(".answer-slot");
    const targetSlot = Array.from(answerSlots).find(
      (slot) => !slot.classList.contains("filled")
    );

    if (!targetSlot) return;

    const slotIndex = parseInt(targetSlot.dataset.index);
    selectedChars.push({ char, slotIndex });

    // Animation
    const clone = charBox.cloneNode(true);
    clone.classList.add("animating");
    document.body.appendChild(clone);

    const charRect = charBox.getBoundingClientRect();
    const slotRect = targetSlot.getBoundingClientRect();

    clone.style.position = "fixed";
    clone.style.left = `${charRect.left}px`;
    clone.style.top = `${charRect.top}px`;
    clone.style.transition = "all 0.3s ease-in-out";

    setTimeout(() => {
      clone.style.left = `${slotRect.left}px`;
      clone.style.top = `${slotRect.top}px`;

      setTimeout(() => {
        targetSlot.textContent = char;
        targetSlot.classList.add("filled");
        targetSlot.dataset.char = char;

        document.body.removeChild(clone);
        charBox.classList.add("disabled");

        checkAnswer();
      }, 300);
    }, 10);
  }

  // Xử lý khi click vào ô trả lời để trả lại ký tự
  function handleSlotClick(slot) {
    if (!slot.classList.contains("filled")) return;

    const char = slot.dataset.char;
    const slotIndex = parseInt(slot.dataset.index);

    // Xóa ký tự khỏi selectedChars
    selectedChars = selectedChars.filter(
      (item) => item.slotIndex !== slotIndex
    );

    // Tìm charBox tương ứng
    const charBox = charBoxes.find(
      (box) => box.dataset.char === char && box.classList.contains("disabled")
    );

    if (charBox) {
      // Tạo bản sao để animate quay về
      const clone = charBox.cloneNode(true);
      clone.classList.add("animating");
      document.body.appendChild(clone);

      const slotRect = slot.getBoundingClientRect();
      const charRect = charBox.getBoundingClientRect();

      clone.style.position = "fixed";
      clone.style.left = `${slotRect.left}px`;
      clone.style.top = `${slotRect.top}px`;
      clone.style.transition = "all 0.3s ease-in-out";

      setTimeout(() => {
        clone.style.left = `${charRect.left}px`;
        clone.style.top = `${charRect.top}px`;

        setTimeout(() => {
          charBox.classList.remove("disabled");
          document.body.removeChild(clone);

          // Xóa ký tự khỏi slot
          slot.textContent = "";
          slot.classList.remove("filled");
          delete slot.dataset.char;

          // Cập nhật lại các ô trả lời
          updateAnswerSlots();
        }, 300);
      }, 10);
      checkAnswer();
    }
  }

  // Xử lý phím Backspace
  document.addEventListener("keydown", (event) => {
    if (event.key === "Backspace") {
      const answerSlots = document.querySelectorAll(".answer-slot");
      const lastFilledSlot = Array.from(answerSlots)
        .filter((slot) => slot.classList.contains("filled"))
        .pop();

      if (lastFilledSlot) {
        handleSlotClick(lastFilledSlot);
      }
    }
  });

  // Cập nhật các ô trả lời dựa trên selectedChars
  function updateAnswerSlots() {
    const answerSlots = document.querySelectorAll(".answer-slot");
    answerSlots.forEach((slot) => {
      const slotIndex = parseInt(slot.dataset.index);
      const item = selectedChars.find((item) => item.slotIndex === slotIndex);
      if (item) {
        slot.textContent = item.char;
        slot.classList.add("filled");
        slot.dataset.char = item.char;
      } else {
        slot.textContent = "";
        slot.classList.remove("filled");
        delete slot.dataset.char;
      }
    });
  }

  // Kiểm tra câu trả lời
  function checkAnswer() {
    if (selectedChars.length === correctOrder.length) {
      checkButton.style.backgroundColor = "#52f52a"; // Đổi màu nút Check thành xanh
    } else {
      checkButton.style.backgroundColor = ""; // Đặt lại màu mặc định nếu chưa đủ
    }
  }

  // Xử lý sự kiện click nút Check
  checkButton.addEventListener("click", () => {
    if (checkButton.innerText === "Continue") {
      goToNextQuestion(); // Chuyển sang câu hỏi tiếp theo trong mọi trường hợp
      return;
    }

    if (selectedChars.length !== correctOrder.length) return; // Chỉ xử lý khi đủ ký tự

    // Vô hiệu hóa tất cả char-box
    charBoxes.forEach((box) => {
      box.classList.add("disabled");
      box.style.pointerEvents = "none"; // Ngăn click
    });

    // Ẩn nút Ignore
    ignoreDiv.classList.add("hidden");

    // Kiểm tra đáp án
    const currentOrder = Array(text.length).fill(null);
    selectedChars.forEach((item) => {
      currentOrder[item.slotIndex] = item.char;
    });
    const isCorrect = currentOrder.every(
      (char, index) => char === correctOrder[index]
    );

    if (isCorrect) {
      checkButton.style.backgroundColor = "#52f52a";
      resultMessage.textContent = "Correct!";
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

    // Đổi văn bản nút Check thành "Continue"
    checkButton.innerText = "Continue";
  });

  // Xử lý nút Ignore
  if (ignoreDiv) {
    ignoreDiv.addEventListener("mouseenter", () => {
      ignoreDiv.style.backgroundColor = "#eee";
    });
    ignoreDiv.addEventListener("mouseleave", () => {
      ignoreDiv.style.backgroundColor = "#ddd";
    });

    ignoreDiv.addEventListener("click", () => {
      // Vô hiệu hóa tất cả char-box
      charBoxes.forEach((box) => {
        box.classList.add("disabled");
        box.style.pointerEvents = "none";
      });

      // Ẩn nút Ignore
      ignoreDiv.classList.add("hidden");

      // Hiển thị thông báo và biểu tượng lỗi
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

  // Gọi hàm khi trang load
  arrangeCharacters();

  // Gọi lại khi cửa sổ thay đổi kích thước
  window.addEventListener("resize", arrangeCharacters);
});

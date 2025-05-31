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
  const word = "hoả bạo";
  const text = word.replace(/\s+/g, "").split("");
  let selectedChars = [];
  let correctOrder = word.replace(/\s+/g, "").split("");
  let charBoxes = []; // Lưu trữ các charBox để quản lý trả về

  let isIgnored = false;
  let keyTimeout = null;
  let pendingVowel = null;
  let keySequence = [];
  let isChecked = false; // Flag to track if Check button has been clicked

  // combo dấu
  const vowelCombinations = {
    a: {
      f: "à",
      s: "á",
      x: "ã",
      j: "ạ",
      r: "ả",
      a: "â",
      w: "ă",
      // tổ hợp 3 phím
      combo: {
        "a+w+s": "ắ",
        "a+s+w": "ắ",
        "a+w+f": "ằ",
        "a+f+w": "ằ",
        "a+w+r": "ẳ",
        "a+r+w": "ẳ",
        "a+w+x": "ẵ",
        "a+x+w": "ẵ",
        "a+w+j": "ặ",
        "a+j+w": "ặ",
        "a+a+s": "ấ",
        "a+s+a": "ấ",
        "a+a+f": "ầ",
        "a+f+a": "ầ",
        "a+a+r": "ẩ",
        "a+r+a": "ẩ",
        "a+a+x": "ẫ",
        "a+x+a": "ẫ",
        "a+a+j": "ậ",
        "a+j+a": "ậ",
      },
    },
    e: {
      f: "è",
      s: "é",
      x: "ẽ",
      j: "ẹ",
      r: "ẻ",
      e: "ê",
      combo: {
        "e+e+s": "ế",
        "e+s+e": "ế",
        "e+e+f": "ề",
        "e+f+e": "ề",
        "e+e+r": "ể",
        "e+r+e": "ể",
        "e+e+x": "ễ",
        "e+x+e": "ễ",
        "e+e+j": "ệ",
        "e+j+e": "ệ",
      },
    },
    o: {
      f: "ò",
      s: "ó",
      x: "õ",
      j: "ọ",
      r: "ỏ",
      o: "ô",
      w: "ơ",
      combo: {
        "o+w+s": "ớ",
        "o+s+w": "ớ",
        "o+w+f": "ờ",
        "o+f+w": "ờ",
        "o+w+r": "ở",
        "o+r+w": "ở",
        "o+w+x": "ỡ",
        "o+x+w": "ỡ",
        "o+w+j": "ợ",
        "o+j+w": "ợ",
        "o+s+o": "ố",
        "o+o+f": "ồ",
        "o+f+o": "ồ",
        "o+o+r": "ổ",
        "o+r+o": "ổ",
        "o+o+x": "ỗ",
        "o+x+o": "ỗ",
        "o+o+j": "ộ",
        "o+j+o": "ộ",
      },
    },
    u: {
      f: "ù",
      s: "ú",
      x: "ũ",
      j: "ụ",
      r: "ủ",
      w: "ư",
      combo: {
        "u+w+s": "ứ",
        "u+s+w": "ứ",
        "u+w+f": "ừ",
        "u+f+w": "ừ",
        "u+w+r": "ử",
        "u+r+w": "ử",
        "u+w+x": "ữ",
        "u+x+w": "ữ",
        "u+w+j": "ự",
        "u+j+w": "ự",
      },
    },
    i: {
      f: "ì",
      s: "í",
      x: "ĩ",
      j: "ị",
      r: "ỉ",
    },
    d: {
      d: "đ",
    },
    y: {
      f: "ỳ",
      s: "ý",
      x: "ỹ",
      j: "ỵ",
      r: "ỷ",
    },
  };

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
      slot.style.width = "5rem";
      slot.style.height = "4rem";
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
    isChecked = false; // Reset isChecked when rearranging characters

    const shuffledText = shuffleArray([...text]); // sao chép và truyền mảng vào hàm

    let firstLineFull = false;
    let maxWidth = tokenCont.offsetWidth;
    let currentWidth = 0;

    shuffledText.forEach((char, index) => {
      const charBox = document.createElement("span");
      charBox.classList.add("char-box");
      charBox.textContent = char;
      // data-char, data-index,..
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
    // tìm ô chưa bị điền
    const targetSlot = Array.from(answerSlots).find(
      (slot) => !slot.classList.contains("filled")
    );

    if (!targetSlot) return;

    const slotIndex = parseInt(targetSlot.dataset.index);
    selectedChars.push({ char, slotIndex });
    // animation
    const clone = charBox.cloneNode(true);
    clone.classList.add("animating");
    document.body.appendChild(clone);

    const charRect = charBox.getBoundingClientRect();
    const slotRect = targetSlot.getBoundingClientRect();

    clone.style.position = "fixed";
    clone.style.left = `${charRect.left}px`;
    clone.style.top = `${charRect.top}px`;
    // thời gian clone bay
    clone.style.transition = "all 0.10s ease-in-out";

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
      }, 100); // thời gian chờ trước khi shape chữ thay
    }, 20); // thời gian khoảng [clone được tạo ra, clone bay lên]
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
      clone.style.transition = "all 0.10s ease-in-out";

      setTimeout(() => {
        clone.style.left = `${charRect.left}px`;
        clone.style.top = `${charRect.top}px`;

        setTimeout(() => {
          charBox.classList.remove("disabled");
          document.body.removeChild(clone);

          slot.textContent = "";
          slot.classList.remove("filled");
          delete slot.dataset.char;

          updateAnswerSlots();
        }, 100);
      }, 20);
      checkAnswer();
    }
  }

  function checkCombo(vowel, keys) {
    const comboKey = keys.join("+");
    return vowelCombinations[vowel]?.combo?.[comboKey] || null;
  }

  const t1 = 250;
  const t2 = 100;
  const t3 = 50;

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    // Handle Backspace, disable khi check
    if (key === "backspace") {
      if (isChecked) return; // Ignore backspace after check
      const answerSlots = document.querySelectorAll(".answer-slot");
      const lastFilledSlot = Array.from(answerSlots)
        .filter((slot) => slot.classList.contains("filled"))
        .pop();

      if (lastFilledSlot) {
        handleSlotClick(lastFilledSlot);
      }
      pendingVowel = null;
      keySequence = [];
      clearTimeout(keyTimeout);
      return;
    }

    // If already processing a vowel combo
    if (pendingVowel) {
      keySequence.push(key);

      // Kiểm tra tổ hợp 3 phím trước
      if (keySequence.length >= 3) {
        const comboChar = checkCombo(pendingVowel, keySequence.slice(0, 3));
        if (comboChar) {
          clearTimeout(keyTimeout);
          pendingVowel = null;
          keySequence = [];
          moveCharToSlot(comboChar);
          return;
        }
      }

      return;
    }

    // xử lý d và nguyên âm
    if (["a", "e", "i", "o", "u", "y", "d"].includes(key)) {
      pendingVowel = key;
      keySequence = [key];

      clearTimeout(keyTimeout);
      // Kiểm tra tổ hợp 2 phím hoặc phím đơn
      keyTimeout = setTimeout(() => {
        if (keySequence.length >= 2) {
          const comboChar = checkCombo(pendingVowel, keySequence.slice(0, 2));
          if (comboChar) {
            pendingVowel = null;
            keySequence = [];
            moveCharToSlot(comboChar);
            return;
          }
          // phím đơn
          const singleChar = vowelCombinations[pendingVowel][keySequence[1]];
          if (singleChar) {
            pendingVowel = null;
            keySequence = [];
            moveCharToSlot(singleChar);
            return;
          }
        }

        moveCharToSlot(pendingVowel);
        pendingVowel = null;
        keySequence = [];
      }, t1 + t2 + t3);
      return;
    }

    // Xử lý phụ âm
    moveCharToSlot(key);
  });

  function moveCharToSlot(char) {
    const charBox = charBoxes.find(
      (box) =>
        box.dataset.char.toLowerCase() === char.toLowerCase() &&
        !box.classList.contains("disabled")
    );

    if (charBox) {
      handleCharClick(charBox);
    }
  }
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
      checkButton.style.backgroundColor = "#52f52a";
    } else {
      checkButton.style.backgroundColor = "";
    }
  }

  // Xử lý sự kiện click nút Check
  checkButton.addEventListener("click", () => {
    if (checkButton.innerText === "Continue") {
      goToNextQuestion();
      return;
    }
    if (selectedChars.length !== correctOrder.length) return;

    isChecked = true; // Set flag to disable backspace

    // Vô hiệu hóa tất cả char-box
    charBoxes.forEach((box) => {
      box.classList.add("disabled");
      box.style.pointerEvents = "none";
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

  // // Gọi lại khi cửa sổ thay đổi kích thước
  // window.addEventListener("resize", arrangeCharacters);
});

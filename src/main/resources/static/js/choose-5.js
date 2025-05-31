document.addEventListener("DOMContentLoaded", function () {
  const checkButton = document.querySelector(".Check");
  const ignoreDiv = document.querySelector(".Ignore");
  const resultMessage = document.querySelector(".result-message");
  const tickIcon = document.querySelector(".tick-icon");
  const errorIcon = document.querySelector(".error-icon");
  const lineUnder = document.querySelector(".line-answer");
  const speakerImage = document.getElementById("speaker-image");

  const word = "Thành đi ỉa".toLowerCase();

  const wordParts = word.split(" ");
  const text = word.replace(/\s+/g, "").split(""); // Tách thành ký
  let selectedChars = [];
  let correctOrder = word.replace(/\s+/g, "").split("");
  let isIgnored = false;
  let keyTimeout = null;
  let pendingVowel = null;
  let keySequence = [];
  let isChecked = false;

  // Combo dấu
  const vowelCombinations = {
    a: {
      f: "à",
      s: "á",
      x: "ã",
      j: "ạ",
      r: "ả",
      a: "â",
      w: "ă",
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
        "o+o+s": "ố",
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

  // Tạo các ô trả lời theo số từ
  function createAnswerSlots() {
    lineUnder.innerHTML = "";
    wordParts.forEach((part, partIndex) => {
      const wordContainer = document.createElement("span");
      wordContainer.classList.add("word-container");
      wordContainer.style.display = "inline-flex";
      wordContainer.style.margin = "0 10px"; // Khoảng cách giữa các từ

      const chars = part.replace(/\s+/g, "").split("");
      let charIndexOffset = wordParts
        .slice(0, partIndex)
        .reduce((sum, p) => sum + p.replace(/\s+/g, "").length, 0);

      chars.forEach((_, charIndex) => {
        const slot = document.createElement("span");
        slot.classList.add("answer-slot");
        slot.style.width = "5rem";
        slot.style.height = "4rem";
        slot.style.display = "inline-flex";
        slot.style.justifyContent = "center";
        slot.style.alignItems = "center";
        slot.style.margin = "0 2px";
        slot.style.borderBottom = "2px solid";
        slot.dataset.index = charIndexOffset + charIndex;
        slot.addEventListener("click", () => handleSlotClick(slot));
        wordContainer.appendChild(slot);
      });

      lineUnder.appendChild(wordContainer);
    });
  }
  async function playWord() {
    try {
      const apiKey = "mpNlGxwzJLYQegaUVHJtTWfSwSU1Vfeu";
      const response = await fetch("https://api.fpt.ai/hmi/tts/v5", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
          voice: "banmai",
        },
        body: JSON.stringify({ ListenAndFill: word }),
      });

      if (!response.ok) {
        throw new Error(
          `API error: ${response.status} - ${response.statusText}`
        );
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (responseData && responseData.async) {
        // Đường dẫn file âm thanh có thể nằm trong response data
        const audioUrl = responseData.async;

        // Chờ vài giây để file được xử lý
        setTimeout(() => {
          const audio = new Audio(audioUrl);
          audio.oncanplaythrough = () => {
            console.log("Audio loaded successfully");
            audio.play();
          };
          audio.onerror = (err) => {
            console.error("Error loading audio:", err);
          };
        }, 2000); // Chờ 2 giây cho file audio được xử lý
      } else {
        console.error(
          "Không tìm thấy URL âm thanh trong phản hồi",
          responseData
        );
      }
    } catch (error) {
      console.error("Lỗi khi gọi API TTS:", error);
    }
  }

  function checkCombo(vowel, keys) {
    const comboKey = keys.join("+");
    return vowelCombinations[vowel]?.combo?.[comboKey] || null;
  }

  const t1 = 250;
  const t2 = 100;
  const t3 = 50;

  function handleSlotClick(slot) {
    if (!slot.classList.contains("filled")) return;

    const slotIndex = parseInt(slot.dataset.index);
    // Xóa ký tự khỏi selectedChars
    selectedChars = selectedChars.filter(
      (item) => item.slotIndex !== slotIndex
    );
    // Cập nhật giao diện
    slot.textContent = "";
    slot.classList.remove("filled");
    delete slot.dataset.char;
    // Kiểm tra lại trạng thái
    checkAnswer();
  }

  document.addEventListener("keydown", (event) => {
    if (isChecked) return;

    const key = event.key.toLowerCase();

    // Allow only letters (a-z) and Backspace
    if (!/^[a-z]$/.test(key) && key !== "backspace") {
      event.preventDefault();
      return;
    }

    // Xử lý Backspace
    if (key === "backspace") {
      const answerSlots = document.querySelectorAll(".answer-slot");
      const lastFilledSlot = Array.from(answerSlots)
        .filter((slot) => slot.classList.contains("filled"))
        .pop();

      if (lastFilledSlot) {
        const slotIndex = parseInt(lastFilledSlot.dataset.index);
        // Xóa ký tự khỏi selectedChars
        selectedChars = selectedChars.filter(
          (item) => item.slotIndex !== slotIndex
        );
        // Cập nhật giao diện
        lastFilledSlot.textContent = "";
        lastFilledSlot.classList.remove("filled");
        delete lastFilledSlot.dataset.char;
        // Kiểm tra lại trạng thái
        checkAnswer();
      }
      pendingVowel = null;
      keySequence = [];
      clearTimeout(keyTimeout);
      return;
    }

    // Xử lý tổ hợp phím
    if (pendingVowel) {
      keySequence.push(key);

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

    // Xử lý nguyên âm và 'd'
    if (["a", "e", "i", "o", "u", "y", "d"].includes(key)) {
      pendingVowel = key;
      keySequence = [key];

      clearTimeout(keyTimeout);
      keyTimeout = setTimeout(() => {
        if (keySequence.length >= 2) {
          const comboChar = checkCombo(pendingVowel, keySequence.slice(0, 2));
          if (comboChar) {
            pendingVowel = null;
            keySequence = [];
            moveCharToSlot(comboChar);
            return;
          }
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

    // Xử lý các ký tự khác
    moveCharToSlot(key);
  });

  function moveCharToSlot(char) {
    const answerSlots = document.querySelectorAll(".answer-slot");
    const targetSlot = Array.from(answerSlots).find(
      (slot) => !slot.classList.contains("filled")
    );

    if (!targetSlot) return;

    const slotIndex = parseInt(targetSlot.dataset.index);
    selectedChars.push({ char, slotIndex });

    targetSlot.textContent = char;
    targetSlot.classList.add("filled");
    targetSlot.dataset.char = char;

    checkAnswer();
  }

  // Cập nhật các ô trả lờ
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

  // Xử lý nút Check
  checkButton.addEventListener("click", () => {
    if (checkButton.innerText === "Continue") {
      goToNextQuestion();
      return;
    }
    if (selectedChars.length !== correctOrder.length) return;

    isChecked = true;

    ignoreDiv.classList.add("hidden");

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
      ignoreDiv.classList.add("hidden");
      resultMessage.textContent = "Try again later!";
      resultMessage.style.color = "red";
      resultMessage.classList.add("show");
      tickIcon.classList.add("hidden");
      errorIcon.classList.add("show");
      checkButton.style.backgroundColor = "#ff1d0d";
      checkButton.innerText = "Continue";
      isIgnored = true;
      isChecked = true;
    });
  }

  // Thêm sự kiện click cho loa
  speakerImage.addEventListener("click", playWord);

  // Khởi tạo
  createAnswerSlots();
  playWord(); // Phát âm thanh khi trang load
});

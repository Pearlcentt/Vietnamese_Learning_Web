const questionFiles = [
  "qtype1.html",
  "qtype2.html",
  "qtype3.html",
  "qtype4.html",
];
const totalQuestions = 2;

// Khởi tạo tiến độ nếu chưa có
if (!localStorage.getItem("progress")) {
  localStorage.setItem("progress", "0");
  localStorage.setItem("prevPercentage", "0");
}

document.addEventListener("DOMContentLoaded", () => {
  const progress = parseInt(localStorage.getItem("progress")) || 0;
  const prevPercentage =
    parseFloat(localStorage.getItem("prevPercentage")) || 0;
  const progressFill = document.querySelector(".progress-fill");
  const doneButton = document.querySelector(".notify-done");
  const quitButton = document.querySelector(".quit");
  const startButton = document.querySelector(".start-box");

  // Nếu đang ở q0.html, reset tiến độ
  if (window.location.pathname.includes("q0.html")) {
    localStorage.setItem("progress", "0");
    localStorage.setItem("prevPercentage", "0");
    if (progressFill) {
      progressFill.style.width = "0%";
    }
  } else {
    // Cập nhật progress-fill nếu progress > 0 và progressFill tồn tại
    if (progress > 0 && progressFill) {
      // Hiển thị prevPercentage ngay lập tức mà không có transition
      progressFill.style.transition = "none";
      progressFill.style.width = `${prevPercentage}%`;

      // Sau timeout ngắn, bật transition và cập nhật đến percentage
      setTimeout(() => {
        progressFill.style.transition = "width 0.3s ease-in-out";
        const percentage = (progress / totalQuestions) * 100;
        progressFill.style.width = `${percentage}%`;
      }, 50);
    }
  }

  // Xử lý nút Start
  if (startButton) {
    startButton.addEventListener("click", () => {
      localStorage.setItem("progress", "1"); // Bắt đầu từ câu 1
      localStorage.setItem("prevPercentage", "0"); // Phần trăm trước là 0
      const randomIndex = Math.floor(Math.random() * questionFiles.length);
      window.location.href = `../html/${questionFiles[randomIndex]}`; // Cập nhật đường dẫn
    });
  }

  // Xử lý nút Quit
  if (quitButton) {
    quitButton.addEventListener("click", () => {
      alert("Bạn chắc muốn rời bài học không?");
      localStorage.setItem("progress", "0");
      localStorage.setItem("prevPercentage", "0");
      window.location.href = "../html/q0.html"; // Trở về q0.html
    });
    quitButton.addEventListener("mouseenter", () => {
      quitButton.style.backgroundColor = "#ff5608";
    });
    quitButton.addEventListener("mouseleave", () => {
      quitButton.style.backgroundColor = "#ddd";
    });
  }

  // Xử lý nút Done
  if (doneButton) {
    if (progress >= totalQuestions) {
      doneButton.classList.add("enabled");
      doneButton.addEventListener("click", () => {
        localStorage.setItem("progress", "0");
        localStorage.setItem("prevPercentage", "0");
        window.location.href = "../html/q0.html"; // Trở về q0.html
      });
    } else {
      doneButton.classList.remove("enabled");
    }
  }

  // Nếu hoàn thành tất cả câu hỏi, không tải thêm câu hỏi
  if (
    progress >= totalQuestions &&
    !window.location.pathname.includes("q0.html") &&
    progressFill
  ) {
    progressFill.style.width = "100%";
  }
});

function goToNextQuestion() {
  let progress = parseInt(localStorage.getItem("progress")) || 0;
  if (progress < totalQuestions) {
    progress += 1;
    const percentage = (progress / totalQuestions) * 100;
    localStorage.setItem("progress", progress.toString());
    localStorage.setItem("prevPercentage", percentage.toString());

    const randomIndex = Math.floor(Math.random() * questionFiles.length);
    const nextQuestion = questionFiles[randomIndex];
    window.location.href = `../html/${nextQuestion}`; // Cập nhật đường dẫn
  } else {
    // Nếu đã hoàn thành, không chuyển hướng, chỉ hiển thị nút Done
    const doneButton = document.querySelector(".notify-done");
    if (doneButton) {
      doneButton.classList.add("enabled");
    }
  }
}

function resetProgress() {
  localStorage.setItem("progress", "0");
  localStorage.setItem("prevPercentage", "0");
  const progressFill = document.querySelector(".progress-fill");
  if (progressFill) {
    progressFill.style.width = "0%";
  }
}

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
    // Cập nhật progress-fill dựa trên số câu đã hoàn thành (progress - 1)
    if (progress > 0 && progressFill) {
      const completedQuestions = progress - 1; // Số câu đã hoàn thành
      const percentage = (completedQuestions / totalQuestions) * 100;

      // Hiển thị percentage ngay lập tức mà không có transition
      progressFill.style.transition = "none";
      progressFill.style.width = `${percentage}%`;

      // Sau timeout ngắn, bật transition để sẵn sàng cho lần cập nhật tiếp theo
      setTimeout(() => {
        progressFill.style.transition = "width 0.3s ease-in-out";
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
    // Thêm sự kiện click một lần duy nhất
    doneButton.addEventListener("click", () => {
      if (doneButton.classList.contains("enabled")) {
        localStorage.setItem("progress", "0");
        localStorage.setItem("prevPercentage", "0");
        window.location.href = "../html/q0.html"; // Trở về q0.html
      }
    });

    // Cập nhật trạng thái enabled
    if (progress > totalQuestions) {
      doneButton.classList.add("enabled");
    } else {
      doneButton.classList.remove("enabled");
    }
  }

  // Nếu hoàn thành tất cả câu hỏi (progress > totalQuestions)
  if (
    progress > totalQuestions &&
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
    const completedQuestions = progress - 1; // Số câu đã hoàn thành
    const percentage = (completedQuestions / totalQuestions) * 100;
    localStorage.setItem("progress", progress.toString());
    localStorage.setItem("prevPercentage", percentage.toString());

    const randomIndex = Math.floor(Math.random() * questionFiles.length);
    const nextQuestion = questionFiles[randomIndex];
    window.location.href = `../html/${nextQuestion}`; // Cập nhật đường dẫn
  } else {
    // Khi hoàn thành câu hỏi cuối, tăng progress và cập nhật percentage
    progress += 1;
    const percentage = 100; // 100% khi hoàn thành
    localStorage.setItem("progress", progress.toString());
    localStorage.setItem("prevPercentage", percentage.toString());

    // Cập nhật progress-fill và bật nút Done
    const progressFill = document.querySelector(".progress-fill");
    if (progressFill) {
      progressFill.style.width = "100%";
    }
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

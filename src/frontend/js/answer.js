const ignoreButton = document.querySelector(".Ignore");
const submitButton = document.querySelector(".Check");
const quitButton = document.querySelector(".quit");

ignoreButton.addEventListener("click", () => {
  alert("Đừng bỏ qua");
});
ignoreButton.addEventListener("mouseenter", () => {
  ignoreButton.style.backgroundColor = "#eee";
});
ignoreButton.addEventListener("mouseleave", () => {
  ignoreButton.style.backgroundColor = "#ddd";
});

// màu trả về là rgb, not hex
// submitButton.addEventListener("click", () => {
//   if (submitButton.style.backgroundColor === "rgb(82, 245, 42)") {
//     alert("Sai/Đúng");
//   }
// });
// submitButton.addEventListener("mouseenter", () => {
//   if (submitButton.style.backgroundColor === "rgb(82, 245, 42)") {
//     submitButton.style.backgroundColor = "#8df757";
//   }
// });
// submitButton.addEventListener("mouseleave", () => {
//   if (submitButton.style.backgroundColor === "rgb(141, 247, 87)") {
//     submitButton.style.backgroundColor = "rgb(82, 245, 42)";
//   }
// });
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

quitButton.addEventListener("click", () => {
  alert("Bạn chắc muốn rời bài học không ?");
});
quitButton.addEventListener("mouseenter", () => {
  quitButton.style.backgroundColor = "#eee";
});
quitButton.addEventListener("mouseleave", () => {
  quitButton.style.backgroundColor = "#ddd";
});

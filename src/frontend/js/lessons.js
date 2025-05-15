document.addEventListener("DOMContentLoaded", () => {
  const lessonBoxes = document.querySelectorAll(".lesson-box");
  lessonBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      window.location.href = "../html/q0.html";
    });
  });
});

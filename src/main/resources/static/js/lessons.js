document.addEventListener("DOMContentLoaded", () => {
  const lessonBoxes = document.querySelectorAll(".lesson-box");
  lessonBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      const lessonId = box.id; // Lấy id của lesson-box được click
      window.location.href = `../html/q0.html?lessonId=${lessonId}&topicId=${topicId}`;
    });
  });
  const homeNavItem = document.getElementById("home-button");
  homeNavItem.addEventListener("click", () => {
    window.location.href = "../html/start copy.html";
  });
});

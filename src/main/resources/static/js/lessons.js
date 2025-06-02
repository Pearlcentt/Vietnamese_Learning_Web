document.addEventListener("DOMContentLoaded", () => {
  // Note: Lesson navigation is now handled by inline onclick handlers in lessons.html
  // This avoids conflicts with Thymeleaf-generated URLs

  const homeNavItem = document.getElementById("home-button");
  homeNavItem.addEventListener("click", () => {
    window.location.href = "/dashboard"; // Use Spring controller endpoint
  });
});

function showQuestionTypeSelection(topicId) {
  // Redirect to the new topic test endpoint
  // Redirect to the correct topic test endpoint
  window.location.href = `/questions/test/start/${topicId}`;

  // TODO: Implement UI for question type selection and logic to start the test
  // with selected types by calling a backend endpoint.
}

document.addEventListener("DOMContentLoaded", () => {
  // Note: Lesson navigation is now handled by inline onclick handlers in lessons.html
  // This avoids conflicts with Thymeleaf-generated URLs
  
  const homeNavItem = document.getElementById("home-button");
  homeNavItem.addEventListener("click", () => {
    window.location.href = "/dashboard"; // Use Spring controller endpoint
  });
});

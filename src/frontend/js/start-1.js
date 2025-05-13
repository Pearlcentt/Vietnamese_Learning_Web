document.addEventListener("DOMContentLoaded", () => {
  // Include Unit 1 and all other topics
  const topicsData = [
    { topic: 1, title: "Introduction to Vietnamese" },
    { topic: 2, title: "Basic Greetings" },
    { topic: 3, title: "Numbers & Counting" },
    { topic: 4, title: "Family Members" },
    { topic: 5, title: "Common Foods" },
    { topic: 6, title: "Daily Activities" },
    { topic: 7, title: "Colors & Objects" },
    { topic: 8, title: "Time & Calendar" },
    { topic: 9, title: "Places in Town" },
    { topic: 10, title: "Weather & Seasons" },
  ];

  const topicPath = document.getElementById("topicPath");

  // Clear any existing content
  topicPath.innerHTML = "";

  // Add custom CSS to ensure our inline styles override any existing CSS
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
      .topic-item.left-position {
        transform: translateX(-160px) !important; 
      }
      .topic-item.right-position {
        transform: translateX(160px) !important;
      }
      /* Rocks going from center to left */
      .rock-item .rock-1.shift-left-1 { transform: translateX(-40px) !important; }
      .rock-item .rock-2.shift-left-2 { transform: translateX(-80px) !important; }
      .rock-item .rock-3.shift-left-3 { transform: translateX(-120px) !important; }
      
      /* Rocks going from left to center */
      .rock-item .rock-1.shift-left-3 { transform: translateX(-120px) !important; }
      .rock-item .rock-2.shift-left-2 { transform: translateX(-80px) !important; }
      .rock-item .rock-3.shift-left-1 { transform: translateX(-40px) !important; }
      
      /* Rocks going from center to right */
      .rock-item .rock-1.shift-right-1 { transform: translateX(40px) !important; }
      .rock-item .rock-2.shift-right-2 { transform: translateX(80px) !important; }
      .rock-item .rock-3.shift-right-3 { transform: translateX(120px) !important; }
      
      /* Rocks going from right to center */
      .rock-item .rock-1.shift-right-3 { transform: translateX(120px) !important; }
      .rock-item .rock-2.shift-right-2 { transform: translateX(80px) !important; }
      .rock-item .rock-3.shift-right-1 { transform: translateX(40px) !important; }
    `;
  document.head.appendChild(styleSheet);

  // Function to create a topic item with position adjustment
  function createTopicItem(topicNumber, position) {
    const topicItem = document.createElement("div");
    topicItem.className = "topic-item";
    topicItem.id = `topic-item-${topicNumber}`;

    // Apply winding path positioning
    if (position === "left") {
      topicItem.classList.add("left-position");
    } else if (position === "right") {
      topicItem.classList.add("right-position");
    }

    const progressRing = document.createElement("div");
    progressRing.className = "progress-ring";

    const starContainer = document.createElement("div");
    starContainer.className = "star-container";

    const starImg = document.createElement("img");
    starImg.src = "../images/star.png";
    starImg.alt = "Star";

    starContainer.appendChild(starImg);
    topicItem.appendChild(progressRing);
    topicItem.appendChild(starContainer);

    return topicItem;
  }

  // Function to create a rock item with winding path adjustments
  function createRockItem(topicNumber, pattern) {
    const rockItem = document.createElement("div");
    rockItem.className = "rock-item";
    rockItem.id = `rock-item-${topicNumber}`;

    // Create three rock divs with appropriate transformations based on pattern
    for (let i = 1; i <= 3; i++) {
      const rock = document.createElement("div");
      rock.className = `rock rock-${i}`;

      // Apply appropriate classes based on the pattern
      if (pattern === "center-to-left") {
        rock.classList.add(`shift-left-${i}`);
      } else if (pattern === "left-to-center") {
        rock.classList.add(`shift-left-${4 - i}`); // 3, 2, 1
      } else if (pattern === "center-to-right") {
        rock.classList.add(`shift-right-${i}`);
      } else if (pattern === "right-to-center") {
        rock.classList.add(`shift-right-${4 - i}`); // 3, 2, 1
      }

      const rockImg = document.createElement("img");
      rockImg.src = "../images/rock.png";
      rockImg.alt = "Rock";

      rock.appendChild(rockImg);
      rockItem.appendChild(rock);
    }

    return rockItem;
  }

  // Add each topic to the path with winding pattern
  topicsData.forEach((topicData, index) => {
    let topicPosition;
    let rockPattern;

    // Determine position pattern based on topic number
    // Pattern repeats: center -> left -> center -> right -> center -> ...
    const cycle = index % 4;

    if (cycle === 0) {
      // First in cycle - center position
      topicPosition = "center";
      // Rocks lead toward left
      rockPattern = "center-to-left";
    } else if (cycle === 1) {
      // Second in cycle - left position
      topicPosition = "left";
      // Rocks lead back to center
      rockPattern = "left-to-center";
    } else if (cycle === 2) {
      // Third in cycle - center position
      topicPosition = "center";
      // Rocks lead toward right
      rockPattern = "center-to-right";
    } else {
      // Fourth in cycle - right position
      topicPosition = "right";
      // Rocks lead back to center
      rockPattern = "right-to-center";
    }

    // Create and append the topic item with position
    const topicItem = createTopicItem(topicData.topic, topicPosition);

    // Add data attribute for the topic title
    topicItem.dataset.title = topicData.title;
    topicItem.dataset.topicNumber = topicData.topic;

    // Create and append the rock item with pattern
    const rockItem = createRockItem(topicData.topic, rockPattern);

    // Append both to the topic path
    topicPath.appendChild(topicItem);
    topicPath.appendChild(rockItem);
  });

  // Make topics clickable
  document.querySelectorAll(".topic-item").forEach((item) => {
    item.addEventListener("click", function () {
      const topicTitle = this.dataset.title;
      const topicNumber = this.dataset.topicNumber;

      if (topicTitle) {
        console.log(`Selected topic ${topicNumber}: ${topicTitle}`);

        // Visual feedback
        document.querySelectorAll(".topic-item").forEach((topic) => {
          topic.style.boxShadow = "0 0 10px rgba(88, 204, 2, 0.5)";
        });
        this.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.8)";

        // Redirect to lessons.html and pass topic info as query parameters
        window.location.href = `../html/lessons.html?topic=${topicNumber}&title=${encodeURIComponent(
          topicTitle
        )}`;
      }
    });
  });

  // Optional: Initialize the first topic as selected
  const firstTopic = document.querySelector(".topic-item");
  if (firstTopic) {
    firstTopic.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.8)";
  }
});

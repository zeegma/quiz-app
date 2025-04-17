document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const jsonUploadInput = document.getElementById("jsonUpload");
  const uploadForm = document.querySelector("form");

  // Add quiz card to carousel
  function addQuizCard(quiz) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <h2>${quiz.title}</h2>
        <button class="start-btn" data-quiz='${JSON.stringify(
          quiz
        )}'>Start</button>
      `;
    carousel.appendChild(card); // Put the card inside th carousel
  }

  // Load quizzes (Somewhere this should be able to load quizzes from localStorage)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "./data/quizzes/index.json", true);
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        const quizzes = JSON.parse(xhttp.responseText);
        quizzes.forEach(addQuizCard);
      } else {
        console.error("Failed to load quizzes via AJAX.");
      }
    }
  };
  xhttp.send();

  // For file upload
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = jsonUploadInput.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const quiz = JSON.parse(event.target.result);
        addQuizCard(quiz);

        // Save to localStorage
        const stored = localStorage.getItem("uploadedQuizzes");
        const uploaded = stored ? JSON.parse(stored) : [];
        uploaded.push(quiz);
        localStorage.setItem("uploadedQuizzes", JSON.stringify(uploaded));
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  });

  // Handle carousel navigation
  document.querySelector(".carousel-prev").addEventListener("click", () => {
    carousel.scrollBy({ left: -300, behavior: "smooth" });
  });

  document.querySelector(".carousel-next").addEventListener("click", () => {
    carousel.scrollBy({ left: 300, behavior: "smooth" });
  });

  // Handle quiz start
  carousel.addEventListener("click", (e) => {
    if (e.target.classList.contains("start-btn")) {
      const quiz = JSON.parse(e.target.getAttribute("data-quiz"));
      sessionStorage.setItem("quizData", JSON.stringify(quiz));
      window.location.href = "quiz.html"; // To be created
    }
  });
});

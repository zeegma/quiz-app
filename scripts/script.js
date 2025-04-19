document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const jsonUploadInput = document.getElementById("jsonUpload");
  const uploadForm = document.getElementById("uploadForm");
  const fileNameDisplay = document.getElementById("fileName");
  const removeFileBtn = document.getElementById("removeFile");
  const uploadBtn = document.getElementById("uploadBtn");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");

  jsonUploadInput.addEventListener("change", () => {
    const file = jsonUploadInput.files[0];
    if (file) {
      fileNameDisplay.textContent = `Selected file: ${file.name}`;
      uploadBtn.disabled = false;
    } else {
      fileNameDisplay.textContent = "";
      uploadBtn.disabled = true;
    }
  });

  removeFileBtn.addEventListener("click", () => {
    jsonUploadInput.value = "";
    fileNameDisplay.textContent = "";
    uploadBtn.disabled = true;
    successMessage.style.display = "none";
    errorMessage.style.display = "none";
  });

  function addQuizCard(quiz) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${quiz.title}</h2>
      <button class="start-btn" data-quiz='${JSON.stringify(
        quiz
      )}'>Start</button>
    `;
    carousel.appendChild(card);
  }

  // Load default quizzes from static JSON
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "./data/quizzes/index.json", true);
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        try {
          const quizzes = JSON.parse(xhttp.responseText);
          quizzes.forEach(addQuizCard);
          console.log("Sucessful. Status:", xhttp.status);
        } catch (err) {
          console.error("Error parsing quiz data:", err);
        }
      } else {
        console.error("Failed to load quizzes. Status:", xhttp.status);
      }
    }
  };
  xhttp.send();

  // Load quizzes from localStorage
  const storedQuizzes = localStorage.getItem("uploadedQuizzes");
  if (storedQuizzes) {
    JSON.parse(storedQuizzes).forEach(addQuizCard);
  }

  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = jsonUploadInput.files[0];
    if (!file) return;

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

        successMessage.style.display = "block";
        errorMessage.style.display = "none";
        uploadBtn.disabled = true;
        jsonUploadInput.value = "";
        fileNameDisplay.textContent = "";
      } catch (err) {
        successMessage.style.display = "none";
        errorMessage.style.display = "block";
        errorText.textContent = "Invalid JSON file format.";
      }
    };
    reader.readAsText(file);
  });

  document.querySelector(".carousel-next").addEventListener("click", () => {
    const firstCard = carousel.firstElementChild;
    if (firstCard) {
      carousel.appendChild(firstCard);
    }
  });

  document.querySelector(".carousel-prev").addEventListener("click", () => {
    const lastCard = carousel.lastElementChild;
    if (lastCard) {
      carousel.insertBefore(lastCard, carousel.firstElementChild);
    }
  });

  carousel.addEventListener("click", (e) => {
    if (e.target.classList.contains("start-btn")) {
      const quiz = JSON.parse(e.target.getAttribute("data-quiz"));
      sessionStorage.setItem("quizData", JSON.stringify(quiz));
      window.location.href = "quiz.html";
    }
  });
});

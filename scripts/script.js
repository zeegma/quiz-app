
// The "DOMContentLoaded" makes sure that every element is loaded before doing any actions.
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

  // Handle file selection for upload
  jsonUploadInput.addEventListener("change", () => {

    // Access the uploaded file and store to var file
    const file = jsonUploadInput.files[0];

    if (file) {
      fileNameDisplay.textContent = `Selected file: ${file.name}`;
      uploadBtn.disabled = false;
    } else {
      fileNameDisplay.textContent = "";
      uploadBtn.disabled = true;
    }
  });

  // If user decideds to remove file, remove file and reset UI
  removeFileBtn.addEventListener("click", () => {
    jsonUploadInput.value = "";
    fileNameDisplay.textContent = "";
    uploadBtn.disabled = true;
    successMessage.style.display = "none";
    errorMessage.style.display = "none";
  });

  // Add a quiz card to the carousel
  function addQuizCard(quiz) {
    const card = document.createElement("div");
    card.className = "card";
    const questionCount = quiz.questions ? quiz.questions.length : 0;
    card.innerHTML = `
      <h2>${quiz.title}</h2>
      <p>${questionCount} Question${questionCount !== 1 ? "s" : ""}</p>
      <button class="start-btn" data-quiz='${JSON.stringify(
        quiz
      )}'>Start</button>
    `;
    carousel.appendChild(card);
  }

  
  // The following loads the premade quizzes from index.json.
  // The uploaded JSON files won't be needing this as these are just for sample purposes.
  
  const xhttp = new XMLHttpRequest();

  // Open the index.json file and load the different files declared in the json.
  xhttp.open("GET", "./data/quizzes/index.json", true);

  xhttp.onload = function() {
    if (xhttp.status === 200) {
        try {
          const quizzes = JSON.parse(xhttp.responseText);
          for (let i = 0; i < quizzes.length; i++) {
            const quizMeta = quizzes[i];
            
            // Create a new XMLHttpRequest for each quiz file
            const quizRequest = new XMLHttpRequest();
            
            // Using synchronous request (not recommended for production, but simpler)
            quizRequest.open("GET", quizMeta.file, false);
            
            try {
              // Send the request
              quizRequest.send();
              
              if (quizRequest.status === 200) {
                // Parse the quiz data
                const quizData = JSON.parse(quizRequest.responseText);
                
                // Merge the metadata with the quiz data
                const fullQuiz = { ...quizMeta, ...quizData };
                
                // Add the quiz card to the carousel
                addQuizCard(fullQuiz);
              } else {
                console.error(`Failed to load quiz from ${quizMeta.file}. Status: ${quizRequest.status}`);
              }
            } catch (err) {
              console.error(`Error loading quiz from ${quizMeta.file}:`, err);
            }
          }

          console.log("Successfully loaded quizzes. Status:", xhttp.status);
        } catch (err) {
          console.error("Error parsing quiz data:", err);
        }
      } else {
        console.error("Failed to load quizzes. Status:", xhttp.status);
      }
  }
  // Executes request. If successful, perform the function in the onload
  xhttp.send();

  // Load quizzes from localStorage (uploaded quizzes)
  const storedQuizzes = localStorage.getItem("uploadedQuizzes");

  // If there are stored quizzes, proceed to parse and add them as cards.
  if (storedQuizzes) {
    JSON.parse(storedQuizzes).forEach(addQuizCard);
  }

  // Handle quiz upload
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

  // Carousel navigation (Next and Previous buttons)
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

  // Handle quiz card click to start the quiz
  carousel.addEventListener("click", (e) => {
    if (e.target.classList.contains("start-btn")) {
      const quiz = JSON.parse(e.target.getAttribute("data-quiz"));
      sessionStorage.setItem("quizData", JSON.stringify(quiz));
      window.location.href = "quiz.html";
    }
  });
});

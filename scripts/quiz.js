
// The "DOMContentLoaded" makes sure that every element is loaded before doing any actions.
document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz-container");
  const loaderContainer = document.getElementById("loader-container");
  const errorContainer = document.getElementById("error-container");
  const quizTitle = document.getElementById("quiz-title");
  const questionNav = document.getElementById("question-nav");
  const questionNumber = document.getElementById("question-number");
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let quizData = null; // Hold data containing the quiz questions and options
  let currentQuestion = 0; // Tracks current question
  let userAnswers = []; // Stores answers selected by the user for each question

  // Fetch quiz data from sessionStorage
  try {
    const storedQuizData = sessionStorage.getItem("quizData");
    console.log(storedQuizData);
    if (!storedQuizData)
      throw new Error("No quiz data found in sessionStorage.");
    
    quizData = JSON.parse(storedQuizData);
    
    if (!quizData.title || !quizData.questions || !Array.isArray(quizData.questions))
      throw new Error("Invalid quiz data format in sessionStorage.");
    
    // Initialize the quiz
    initializeQuiz();

  } catch (error) {
    console.error(error);
    loaderContainer.style.display = "none";
    errorContainer.style.display = "flex";
    errorContainer.textContent = `Error loading quiz data: ${error.message}`;
  }

  // Initialize the quiz segment
  function initializeQuiz() {
    quizTitle.textContent = quizData.title;
    userAnswers = new Array(quizData.questions.length).fill(null);

    // Create navigation buttons for each question
    quizData.questions.forEach((_, index) => {
      const btn = document.createElement("button");
      btn.classList.add("question-btn");
      btn.textContent = index + 1;
      btn.addEventListener("click", () => goToQuestion(index));
      questionNav.appendChild(btn);
    });

    // Show quiz and render first question
    loaderContainer.style.display = "none";
    quizContainer.style.display = "flex";
    renderQuestion();
    updateNavButtons();
  }

  // Rendering current question and its options
  function renderQuestion() {
    const question = quizData.questions[currentQuestion];

    questionNumber.textContent = currentQuestion + 1;
    questionText.textContent = question.question;
    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {
      const optionDiv = document.createElement("div");
      optionDiv.classList.add("option");
      optionDiv.textContent = option;
      if (userAnswers[currentQuestion] === index) {
        optionDiv.classList.add("selected");
      }
      optionDiv.addEventListener("click", () => {
        userAnswers[currentQuestion] = index;
        renderQuestion();
        updateNavButtons();
      });
      optionsContainer.appendChild(optionDiv);
    });

    prevBtn.disabled = currentQuestion === 0;
    nextBtn.textContent =
      currentQuestion === quizData.questions.length - 1 ? "FINISH" : "NEXT";
  }

  // Navigate to a specific question by its index
  function goToQuestion(index) {
    currentQuestion = index;
    renderQuestion();
    updateNavButtons();
  }

  // Updating the state of the navigation buttons
  function updateNavButtons() {
    const navButtons = document.querySelectorAll(".question-btn");
    navButtons.forEach((btn, i) => {
      btn.classList.toggle("active", i === currentQuestion);
      if (userAnswers[i] !== null) {
        btn.classList.add("answered");
      } else {
        btn.classList.remove("answered");
      }
    });
  }

  // Calculation
  function calculateScore() {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      let correctAnswerIndex = question.options.indexOf(question.answer);
      if (userAnswers[index] === correctAnswerIndex) {
        score++;
      }
    });
    return score;
  }

  // Event listeners
  prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
      updateNavButtons();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentQuestion < quizData.questions.length - 1) {
      currentQuestion++;

      const currentScore = calculateScore();
      renderQuestion();
      updateNavButtons();
    } else {
      const finalScore = calculateScore();

      sessionStorage.setItem("finalScore", finalScore);
      sessionStorage.setItem("totalQuestions", quizData.questions.length);
      sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
      window.location.href = "results.html";
    }
  });

  document.addEventListener("click", (event) => {
    const isOption = event.target.closest(".option");
    if (!isOption) {
      // Unselect current option
      userAnswers[currentQuestion] = null;
      renderQuestion();
      updateNavButtons();
    }
  });
});
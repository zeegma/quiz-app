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

  let quizData = null; // Hold data containing the quiz questions and options (e.g. HTML.json)
  let currentQuestion = 0; // Tracks current question
  let userAnswers = []; // Stores answers selected by the user for each question

  // Quiz info retrieval - Fetchess quiz metadata from sessionStorage
  let quizInfo = null;
  try {
    const storedQuizInfo = sessionStorage.getItem("quizData");
    if (!storedQuizInfo)
      throw new Error("No quiz info found in sessionStorage.");
    quizInfo = JSON.parse(storedQuizInfo);

    if (!quizInfo.file || !quizInfo.title)
      throw new Error("Invalid quiz info format in sessionStorage.");
  } catch (error) {
    console.error(error);
    loaderContainer.style.display = "none";
    errorContainer.style.display = "flex";
    errorContainer.textContent = `Error loading quiz info: ${error.message}`;
    return;
  }

  quizTitle.textContent = quizInfo.title;

  // Fetch the quiz questions stored in the JSON file
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", quizInfo.file, true);
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        try {
          quizData = JSON.parse(xhttp.responseText);

          if (
            !quizData ||
            !quizData.questions ||
            !Array.isArray(quizData.questions)
          ) {
            throw new Error("Invalid quiz data format");
          }

          userAnswers = new Array(quizData.questions.length).fill(null);

          // Loops through each question
          quizData.questions.forEach((_, index) => {
            const btn = document.createElement("button");
            btn.classList.add("question-btn");
            btn.textContent = index + 1;
            btn.addEventListener("click", () => goToQuestion(index));
            questionNav.appendChild(btn);
          });

          // Loading
          loaderContainer.style.display = "none";
          quizContainer.style.display = "flex";
          renderQuestion();
          updateNavButtons();
        } catch (error) {
          loaderContainer.style.display = "none";
          errorContainer.style.display = "flex";
          errorContainer.textContent = `Error parsing quiz: ${error.message}`;
        }
      } else {
        loaderContainer.style.display = "none";
        errorContainer.style.display = "flex";
        errorContainer.textContent = `Error loading quiz: ${xhttp.statusText}`;
      }
    }
  };
  xhttp.send();

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

  // Navigate to a specific question by its index (for the rerendering of question when the number is clicked)
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

      // To be removed (For checking langs if calculation works 150-153)
      const currentScore = calculateScore();
      console.log(
        `Current Score: ${currentScore}/${quizData.questions.length}`
      );
      renderQuestion();
      updateNavButtons();
    } else {
      const finalScore = calculateScore();
      // To be removed (For checking langs if calculation works)
      console.log(`Score: ${finalScore}/${quizData.questions.length}`);
      sessionStorage.setItem("finalScore", finalScore);
      sessionStorage.setItem("totalQuestions", quizData.questions.length);
      window.location.href = "score.html";
    }
  });
});

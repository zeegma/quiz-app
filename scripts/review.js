
// Makes sure that all elements in DOM are loaded
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
  
    // Initialize the values that we will need later on
    let quizData = null;
    let currentQuestion = 0;
    let userAnswers = JSON.parse(sessionStorage.getItem("userAnswers"));
  
    try {
      const storedQuizData = sessionStorage.getItem("quizData");
      if (!storedQuizData) throw new Error("No quiz data found in sessionStorage.");
      
      quizData = JSON.parse(storedQuizData);
      
      if (!quizData.title || !quizData.questions || !Array.isArray(quizData.questions))
        throw new Error("Invalid quiz data format.");
  
      initializeReview();
    } catch (error) {
      console.error(error);
      loaderContainer.style.display = "none";
      errorContainer.style.display = "flex";
      errorContainer.textContent = `Error loading quiz data: ${error.message}`;
    }
  
    // Prepares prerequisites for displaying the review
    function initializeReview() {
      quizTitle.textContent = `${quizData.title} - Review`;
  
      quizData.questions.forEach((_, index) => {
        const btn = document.createElement("button");
        btn.classList.add("question-btn");
        btn.textContent = index + 1;
        btn.addEventListener("click", () => goToQuestion(index));
        questionNav.appendChild(btn);
      });
  
      loaderContainer.style.display = "none";
      quizContainer.style.display = "flex";
  
      renderReview();
      updateNavButtons();
    }
  
    // Renders each choices per question
    function renderReview() {
      const question = quizData.questions[currentQuestion];
      const correctAnswerIndex = question.options.indexOf(question.answer);
      const userAnswerIndex = userAnswers[currentQuestion];
  
      questionNumber.textContent = currentQuestion + 1;
      questionText.textContent = question.question;
      optionsContainer.innerHTML = "";
  
      question.options.forEach((option, index) => {
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("option");
        optionDiv.textContent = option;
  
        // If the current choice is correct, highlight is as correct with green dashed lines
        if (index === correctAnswerIndex) {
          optionDiv.classList.add("correct");
        }
  
        // We check if the current choice is the user's choice
        if (index === userAnswerIndex) {
          // If the user's answer is correct, highlight the background as light green
          if (userAnswerIndex === correctAnswerIndex) {
            optionDiv.classList.add("selected-correct");
          } else {
            // If the user's answer is not correct, highlight it as a light red bg
            optionDiv.classList.add("selected-wrong");
          }
        }
        
        // Append the choices to its container
        optionsContainer.appendChild(optionDiv);
      });
      
      // Navigation button logic
      prevBtn.disabled = currentQuestion === 0;
      nextBtn.textContent = currentQuestion === quizData.questions.length - 1 ? "FINISH" : "NEXT";
    }
  
    // Function to display question details given the index
    function goToQuestion(index) {
      currentQuestion = index;
      renderReview();
      updateNavButtons();
    }
  
    // This is for the left-hand side guide of questions
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
  
    prevBtn.addEventListener("click", () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        renderReview();
        updateNavButtons();
      }
    });
  
    nextBtn.addEventListener("click", () => {
      if (currentQuestion < quizData.questions.length - 1) {
        currentQuestion++;
        renderReview();
        updateNavButtons();
      } else {
        window.location.href = "results.html";
      }
    });
  });
  
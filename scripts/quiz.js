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

  // Add a message element to display warnings
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.style.color = "#f44336";
  messageElement.style.textAlign = "center";
  messageElement.style.marginTop = "15px";
  messageElement.style.fontWeight = "500";
  messageElement.style.display = "none";

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

    // Add the message element after the options container
    optionsContainer.parentNode.insertBefore(messageElement, optionsContainer.nextSibling);

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
        // Hide any message when an option is selected
        messageElement.style.display = "none";
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
    // Hide any message when navigating to a different question
    messageElement.style.display = "none";
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

  // Check if all questions are answered
  function allQuestionsAnswered() {
    return userAnswers.every(answer => answer !== null);
  }

  // Find the first unanswered question
  function findFirstUnansweredQuestion() {
    return userAnswers.findIndex(answer => answer === null);
  }

  // Get a list of all unanswered questions
  function getUnansweredQuestions() {
    return userAnswers.reduce((acc, answer, index) => {
      if (answer === null) {
        acc.push(index + 1); // Add 1 to convert from 0-based to 1-based indexing
      }
      return acc;
    }, []);
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
      // Hide any message when navigating to a different question
      messageElement.style.display = "none";
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentQuestion < quizData.questions.length - 1) {
      // Allow skipping questions - just move to the next
      currentQuestion++;
      renderQuestion();
      updateNavButtons();
      messageElement.style.display = "none";
    } else {
      // User is trying to finish the quiz
      // Check if all questions are answered before finishing
      if (!allQuestionsAnswered()) {
        const unansweredQuestions = getUnansweredQuestions();
        
        // Create a nicely formatted list of unanswered questions
        let questionsList = unansweredQuestions.join(", ");
        
        // Add "and" before the last item if there are multiple unanswered questions
        if (unansweredQuestions.length > 1) {
          const lastIndex = questionsList.lastIndexOf(", ");
          questionsList = questionsList.substring(0, lastIndex) + " and" + questionsList.substring(lastIndex + 1);
        }
        
        messageElement.textContent = `Please answer all questions before submitting. Question${unansweredQuestions.length > 1 ? 's' : ''} ${questionsList} ${unansweredQuestions.length > 1 ? 'are' : 'is'} unanswered.`;
        messageElement.style.display = "block";
        return;
      }

      const finalScore = calculateScore();

      sessionStorage.setItem("finalScore", finalScore);
      sessionStorage.setItem("totalQuestions", quizData.questions.length);
      sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
      window.location.href = "results.html";
    }
  });
});

// The "DOMContentLoaded" makes sure that every element is loaded before doing any actions.
document.addEventListener("DOMContentLoaded", () => {
    const totalScore = document.getElementById("totalScore");
    const percentage = document.getElementById("percentageScore");
    const totalQuestions = document.getElementById("totalQuestions");
    const correctAnswers = document.getElementById("correctAnswers");
    const wrongAnswers = document.getElementById("wrongAnswers");
    const scoreMessage = document.getElementById("scoreMessage");
    
    // Assign event listeners to buttons
    document.getElementById("reviewButton").addEventListener('click', reviewAnswers);
    document.getElementById("homeButton").addEventListener('click', backHome);
    document.getElementById("retakeButton").addEventListener('click', retakeQuiz);
  
    // Get score from sessionStorage
    var totalScoreVal = sessionStorage.getItem("finalScore");

    // Set the score
    totalScore.innerText = totalScoreVal;

    // Get total number of questions from sessionStorage
    var noQuestions = sessionStorage.getItem("totalQuestions");

    // Set total number of questions
    totalQuestions.innerText = noQuestions;

   // Compute percentage
   const scorePercentage = (parseFloat(totalScoreVal) / parseFloat(noQuestions)) * 100;
    
   // Set percentage display
   percentage.innerText = scorePercentage.toFixed(0) + '%';

    // Set correct answers
    correctAnswers.innerText = totalScore.innerText;

    // Set wrong answers
    wrongAnswers.innerText = (parseInt(noQuestions) - parseInt(totalScore.innerHTML));

     // Set the appropriate message based on score percentage
     if (scorePercentage === 100) {
        scoreMessage.innerText = "Outstanding!";
    } else if (scorePercentage >= 90) {
        scoreMessage.innerText = "Excellent work!";
    } else if (scorePercentage >= 80) {
        scoreMessage.innerText = "Great job!";
    } else if (scorePercentage >= 70) {
        scoreMessage.innerText = "Good effort!";
    } else if (scorePercentage >= 60) {
        scoreMessage.innerText = "Keep practicing!";
    } else if (scorePercentage >= 50) {
        scoreMessage.innerText = "Halfway there!";
    } else if (scorePercentage >= 30) {
        scoreMessage.innerText = "More study?";
    } else {
        scoreMessage.innerText = "Don't give up!";
    }

    // Action when retake quiz button is clicked
    function retakeQuiz() {
        sessionStorage.setItem("finalScore", 0);
        window.location.href = "quiz.html";
    }

    // Action when back to home button is clicked
    function backHome() {
        window.location.href = "index.html";
    }

    function reviewAnswers() {
        window.location.href = "review.html";
    }

    // Add functionality to the back button in the header
    document.querySelector(".back-button").addEventListener('click', backHome);
});
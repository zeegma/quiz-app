
// The "DOMContentLoaded" makes sure that every element is loaded before doing any actions.
document.addEventListener("DOMContentLoaded", () => {
    const totalScore = document.getElementById("totalScore");
    const percentage = document.getElementById("percentageScore");
    const totalQuestions = document.getElementById("totalQuestions");
    const correctAnswers = document.getElementById("correctAnswers");
    const wrongAnswers = document.getElementById("wrongAnswers");
    
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

    // Compute percentage and set it
    percentage.innerText = (parseFloat(totalScore.innerHTML) / parseFloat(totalQuestions.innerHTML)) * 100 + '%';

    // Set correct answers
    correctAnswers.innerText = totalScore.innerText;

    // Set wrong answers
    wrongAnswers.innerText = (parseInt(noQuestions) - parseInt(totalScore.innerHTML));

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

});
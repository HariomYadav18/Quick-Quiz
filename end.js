const username = document.getElementById("username");
const saveScoreButton = document.getElementById('saveScoreButton');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const MAX_HIGH_SCORES = 5;

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    const usernameValue = username.value.trim();
    saveScoreButton.disabled = !usernameValue || usernameValue.length < 2 || usernameValue.length > 20;
    
    // Remove any special characters except letters, numbers, and spaces
    username.value = usernameValue.replace(/[^a-zA-Z0-9\s]/g, '');
});

saveHighScore = (e) => {
    e.preventDefault();

    const usernameValue = username.value.trim();
    
    // Additional validation
    if (!usernameValue || usernameValue.length < 2 || usernameValue.length > 20) {
        alert('Username must be between 2 and 20 characters and contain only letters, numbers, and spaces.');
        return;
    }

    const score = {
        score: parseInt(mostRecentScore),
        name: usernameValue,
        date: new Date().toLocaleDateString()
    };
    
    highScores.push(score);

    highScores.sort((a, b) => b.score - a.score);

    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    
    // Show success message before redirecting
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = '<h3>Score Saved Successfully!</h3>';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        window.location.assign("index.html");
    }, 1500);
};
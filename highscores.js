const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

if (highScores.length === 0) {
  highScoresList.innerHTML = '<li class="no-scores">No high scores yet. Play the game to set a record!</li>';
} else {
  highScoresList.innerHTML = highScores
    .map((score, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
      const date = score.date || 'Unknown';
      return `<li class="high-score">
        <span class="medal">${medal}</span>
        <span class="name">${score.name}</span>
        <span class="score">${score.score}</span>
        <span class="date">${date}</span>
      </li>`;
    })
    .join("");
}
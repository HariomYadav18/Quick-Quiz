const username = document.getElementById("username");
const saveScoreButton = document.getElementById('saveScoreButton');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () =>{
    console.log(username.value);

    saveScoreButton.Disabled = !username.value;
})


saveHighScore = (e) => {
    console.log("clicked the save button");
    e.preventDefault();
}
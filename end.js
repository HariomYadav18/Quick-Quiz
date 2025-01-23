const username = document.getElementById('username');
const saveScoreButton = document.getElementById('saveScoreButton');


username.addEventListener('keyup', () =>{
    console.log(username.value);

    saveScoreButton.Disabled = !username.value;
})


saveHighScore = (e) => {
    console.log("clicked the save button");
    e.preventDefault();
}
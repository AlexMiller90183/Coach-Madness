const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxgOScET9XfjWIRmQr6lmVtlSRBJ0phddxuMLEraUJKXFk6v-EhOgfcjdWUxP1Ty_c/exec";

const bags = [];

for(let i = 1; i <= 16; i++){
    bags.push({
        id: i,
        image: `images/bag${i}.webp`
    });
}

let currentRound = [];
let nextRound = [];
let matchIndex = 0;
let locked = false;

const startScreen =
document.getElementById("start-screen");

const gameScreen =
document.getElementById("game-screen");

const winnerScreen =
document.getElementById("winner-screen");

const roundTitle =
document.getElementById("roundTitle");

const leftBag =
document.getElementById("leftBag");

const rightBag =
document.getElementById("rightBag");

document.getElementById("playBtn")
.addEventListener("click", startGame);

function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame(){

    shuffle(bags);

    currentRound = [...bags];
    nextRound = [];
    matchIndex = 0;
    locked = false;

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    showMatch();
}

function getRoundName(size){
    if(size === 16) return "Round of 16";
    if(size === 8) return "Elite Eight";
    if(size === 4) return "Final Four";
    if(size === 2) return "Championship";
    return "Round";
}

function showMatch(){

    locked = false;

    clearEffects();

    roundTitle.textContent =
        getRoundName(currentRound.length);

    leftBag.src =
        currentRound[matchIndex].image;

    rightBag.src =
        currentRound[matchIndex + 1].image;
}

function clearEffects(){
    leftBag.className = "";
    rightBag.className = "";
}

function chooseWinner(index){

    if(locked) return;
    locked = true;

    const winner = currentRound[index];

    if(index === matchIndex){
        leftBag.classList.add("win");
        rightBag.classList.add("lose");
    }else{
        rightBag.classList.add("win");
        leftBag.classList.add("lose");
    }

    nextRound.push(winner);

    matchIndex += 2;

    setTimeout(() => {

        if(matchIndex >= currentRound.length){

            if(nextRound.length === 1){
                finishTournament(nextRound[0]);
                return;
            }

            currentRound = [...nextRound];
            nextRound = [];
            matchIndex = 0;

            setTimeout(showMatch, 500);

        } else {
            showMatch();
        }

    }, 700);
}

leftBag.onclick = () => chooseWinner(matchIndex);
rightBag.onclick = () => chooseWinner(matchIndex + 1);

function finishTournament(winner){

    gameScreen.classList.add("hidden");
    winnerScreen.classList.remove("hidden");

    document.getElementById("winnerImage").src =
        winner.image;

    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
            winner: `Bag ${winner.id}`
        })
    })
    .then(() => {
        console.log("Winner submitted");
    })
    .catch(err => {
        console.error("Submit failed:", err);
    });
}

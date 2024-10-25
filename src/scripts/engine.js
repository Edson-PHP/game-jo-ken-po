const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.querySelector("#score_points")
    },

    cardSprites: {
        avatar: document.querySelector("#card-image"),
        name: document.querySelector("#card-name"),
        type: document.querySelector("#card-type"),
    },

    fieldCards: {
        player: document.querySelector("#player-field-card"),
        computer: document.querySelector("#computer-field-card"),
    },

    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },

    actions: {
        button: document.getElementById("next-duel"),
    }
}

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: "./src/assets/icons/dragon.png",
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: "./src/assets/icons/exodia.png",
        WinOf: [0],
        LoseOf: [1]
    }
];

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){

        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        })
    }

     return cardImage;

}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
        await playAudio(duelResults);
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
        await playAudio(duelResults);
    }
    
    return duelResults;
}

async function removeAllCardsImages(){
    let { computerBOX, player1BOX} = state.playerSides;

    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.textContent = `Player: ${state.score.playerScore} Computer: ${state.score.computerScore}`;
}

async function setCardsField(cardId){

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.computedStyleMap.display = "block";
    state.fieldCards.computer.computedStyleMap.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await drawButton(duelResults);
    await updateScore();

}

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);

    }
}

async function showCards(){
    state.fieldCards.player.setAttribute("src", "./src/assets/icons/card-back.png");
    state.fieldCards.computer.setAttribute("src", "./src/assets/icons/card-back.png");
}

async function resetDuel(){
    state.cardSprites.avatar.src="";
    state.actions.button.style.display = "none";
   
    state.cardSprites.name.textContent="Selecione";
    state.cardSprites.type.textContent="uma carta";

    showCards();
    init();
    
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init(){

    showCards();

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    let bgm = document.getElementById("bgm");
    bgm.volume = 0.4;
}

init();
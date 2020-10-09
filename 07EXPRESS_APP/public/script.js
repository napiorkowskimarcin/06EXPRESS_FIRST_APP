const answer1 = document.querySelector("#answer1");
const answer2 = document.querySelector("#answer2");
const answer3 = document.querySelector("#answer3");
const answer4 = document.querySelector("#answer4");
const GameBoard = document.querySelector("#game-board");
const h2 = document.querySelector("h2");
const divTip = document.querySelector("#tip");

function fillQuestionElements(data) {
  if (data.winner === true) {
    GameBoard.style.display = "none";
    h2.innerText = "You Won";
    return;
  }
  if (data.loser === true) {
    GameBoard.style.display = "none";
    h2.innerText = "You Lost";
    return;
  }
  question.innerText = data.question;
  for (const i in data.answers) {
    let answerEl = document.querySelector(`#answer${Number(i) + 1}`); //FOR - IN - i IS NOT A NUMBER
    answerEl.innerText = data.answers[i];
  }
}

function showNextQuestion() {
  fetch("/question", {
    method: "GET",
  })
    .then((r) => r.json())
    //.then((data) => console.log(data))
    .then((data) => fillQuestionElements(data));
}

showNextQuestion();
const goodAnswersSpan = document.querySelector("#good-answers");

function handleAnswerFeedback(data) {
  goodAnswersSpan.innerHTML = data.goodAnswers;
  showNextQuestion();
}

function sendAnswer(index) {
  fetch(`/answer/${index}`, {
    method: "POST",
  })
    .then((r) => r.json())
    .then((data) => {
      handleAnswerFeedback(data);
    });
}

const buttons = document.querySelectorAll(".answer-button");
for (const button of buttons) {
  button.addEventListener("click", function () {
    const answerIndex = this.dataset.answer; //with arrow function it may be (event) and event.target.dataset.answer
    //console.log(answerIndex);
    sendAnswer(answerIndex);
  });
}

const btnFriend = document.querySelector("#callToAFriend");
btnFriend.addEventListener("click", callToAFriend);
function handleFriendsAnswer(data) {
  divTip.innerText = data.text;
}

function callToAFriend() {
  fetch(`/help/friend`, {
    method: "GET",
  })
    .then((r) => r.json())
    .then((data) => {
      handleFriendsAnswer(data);
    });
}

const btnFifty = document.querySelector("#fiftyFifty");
btnFifty.addEventListener("click", fiftyFifty);
function handleFiftyAnswer(data) {
  if (typeof data.text === "string") {
    divTip.innerText = data.text;
  } else {
    for (const button of buttons) {
      if (data.answersToRem.indexOf(button.innerText) > -1) {
        button.innerText = "";
      }
    }
  }
}

function fiftyFifty() {
  fetch(`/help/fifty`, {
    method: "GET",
  })
    .then((r) => r.json())
    .then((data) => {
      handleFiftyAnswer(data);
    });
}

const btnCrowd = document.querySelector("#questionToTheCrowd");
btnCrowd.addEventListener("click", questionToTheCrowd);
function handleCrowdAnswer(data) {
  if (typeof data.text === "string") {
    divTip.innerText = data.text;
  } else {
    data.chart.forEach((perc, index) => {
      buttons[index].innerText = buttons[index].innerText + ":" + perc + "%";
    });
  }
}
function questionToTheCrowd() {
  fetch(`/help/crowd`, {
    method: "GET",
  })
    .then((r) => r.json())
    .then((data) => {
      handleCrowdAnswer(data);
    });
}

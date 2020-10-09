function gameRoutes(app) {
  let goodAnswers = 0;
  let isGameOver = false;
  let callToAFriendUsed = false;
  let questionToTheCrowdUsed = false;
  let fiftyFifty = false;

  const questions = [
    {
      question: "What is the best language?",
      answers: ["italian", "german", "danish", "swedish"],
      correctAnswer: 0,
    },
    {
      question: "What is wrong about the weather?",
      answers: ["lack of sun", "deszcz, come!", "its okey", "another answer"],
      correctAnswer: 3,
    },
    {
      question: "What is the best place to eat mozarella",
      answers: ["Gzira", "Cracov", "Rome", "Innsbruck"],
      correctAnswer: 0,
    },
  ];

  app.get("/question", (req, res) => {
    if (goodAnswers === questions.length) {
      res.json({
        winner: true,
      });
    } else if (isGameOver) {
      res.json({
        loser: true,
      });
    } else {
      const nextQuestion = questions[goodAnswers];
      const { question, answers } = nextQuestion;
      res.json({
        question,
        answers,
      });
    }
  });

  app.post("/answer/:index", (req, res) => {
    if (isGameOver) {
      res.json({ loser: true });
    }
    const { index } = req.params;
    const question = questions[goodAnswers];
    const isGoodAnswer = question.correctAnswer === Number(index);
    if (isGoodAnswer) {
      goodAnswers++;
    } else {
      isGameOver = true;
    }

    res.json({ correct: isGoodAnswer, goodAnswers }); //Short version of condition? true:false;
  });

  app.get("/help/friend", (req, res) => {
    if (callToAFriendUsed) {
      return res.json({
        text: "already used",
      });
    }
    const doesFriendKnowAsnswer = Math.random() < 0.5;
    const question = questions[goodAnswers];
    res.json({
      text: doesFriendKnowAsnswer
        ? `I am sure answer is: ${question.answers[question.correctAnswer]}`
        : "sorry mate...",
    });
    callToAFriendUsed = true;
  });

  app.get("/help/fifty", (req, res) => {
    if (fiftyFifty) {
      return res.json({
        text: "already used",
      });
    }
    const question = questions[goodAnswers];
    const answersCopy = question.answers.filter((string, index) => {
      return index !== question.correctAnswer;
    });
    console.log(answersCopy);
    answersCopy.splice(~~(Math.random() * answersCopy.length), 1);
    console.log(answersCopy);
    res.json({
      answersToRem: answersCopy,
    });
    fiftyFifty = true;
  });

  app.get("/help/crowd", (req, res) => {
    if (questionToTheCrowdUsed) {
      return res.json({
        text: "already used",
      });
    }
    questionToTheCrowdUsed = true;
    const chart = [10, 20, 30, 40];
    for (let i = chart.length - 1; i > 0; i--) {
      const change = Math.floor(Math.random() * 20 - 10);
      chart[i] += change;
      chart[i - 1] -= change;
    }
    const question = questions[goodAnswers];
    const { correctAnswer } = question;
    [chart[3], chart[correctAnswer]] = [chart[correctAnswer], chart[3]];
    res.json({ chart });
  });
}
module.exports = gameRoutes;

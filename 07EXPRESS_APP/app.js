const express = require("express");
const app = express();
const gameRoutes = require("./routes/game.js");

app.listen(3000, () => {
  console.log("server is listening at localhost:3000");
});
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

gameRoutes(app);

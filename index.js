const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const compression = require("compression");

// const { xlSerialToJsDate } = require("./util/helper");

const port = process.env.PORT || 3000;
const app = express();
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://views-score.firebaseio.com/views-score/hp.json"
    );
    console.log(Object.keys(response.data));
    res.render("index", { hps: Object.keys(response.data) });
  } catch (err) {
    res.render("index", { hps: [] });
  }
});

app.post("/score/hp", async (req, res) => {
  const { hp, mssv, dayOfBirth } = req.body;
  const timeCheck = new Date(dayOfBirth).getTime();
  const response = await axios.get(
    "https://views-score.firebaseio.com/views-score/score/" + hp + ".json"
  );

  let result = response.data.find((res) => {
    return res.id === mssv && new Date(res.dayOfBirth).getTime() === timeCheck;
  });
  res.send(result);
});

app.post("/score/add-hp", async (req, res) => {
  const { hpStringify, dataFilter } = req.body;

  try {
    await Promise.all([
      axios.put(
        "https://views-score.firebaseio.com/views-score/score/" +
          hpStringify +
          ".json",
        dataFilter
      ),
      axios.put(
        "https://views-score.firebaseio.com/views-score/hp/" +
          hpStringify +
          ".json",
        { add: true }
      ),
    ]);
    res.send({ message: "done" });
  } catch (err) {
    res.send({ message: "fail" });
  }
});

// Using template engines
// app.get('/', async function (req, res) {
// 	var users = await User.find();
// 	res.render('users/index', {
// 		users: users
// 	});
// });

app.listen(port, function () {
  console.log("Example app listen on port " + port);
});

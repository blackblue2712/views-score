const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const compression = require("compression");
const jwt = require("jsonwebtoken");

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
    console.log(res.id, mssv);
    return res.id === mssv && new Date(res.dayOfBirth).getTime() === timeCheck;
  });
  res.send(result);
});

app.post("/score/add-hp", async (req, res) => {
  const { hpStringify, dataFilter, token } = req.body;

  try {
    const payload = jwt.verify(token, "scret");
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

app.get("/auth", (req, res) => {
  res.render("auth");
});

app.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await axios.get(
      "https://views-score.firebaseio.com/views-score/users.json"
    );

    if (response.data[username] + "" === password + "") {
      let token = jwt.sign({ foo: "bar" }, "scret", {
        expiresIn: 60 * 60 * 60,
      });
      res.send({ message: "success", token });
    } else {
      res.send({ message: "not auth!" });
    }
  } catch (err) {
    res.send({ message: "not auth!" });
  }
});

app.post("/auth/verify", (req, res) => {
  try {
    let { token } = req.body;
    let auth = jwt.verify(token, "scret");
    res.send(auth);
  } catch (err) {
    res.send({ message: "no auth!" });
  }
});

app.get("/import", (req, res) => {
  res.render("import");
});

app.listen(port, function () {
  console.log("Example app listen on port " + port);
});

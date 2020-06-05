const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const { change_alias } = require("./util/helper");

const port = 3000;
const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(cookieParser(process.env.SECRET_SESSION));
// app.use(sessionMiddleware);
// app.use(csrf({ cookie: true }));
// 
// mongoose.connect(process.env.MONGO_URL);
// const db = require('./db');


/*app.get('/', function (request, response) {
	response.send('<h1>Hello Coders.Tokyo</h1>');
});*/

// Static file - Express looks up the files relative to the static directory, so the name of the static directory is not part of the URL.
app.use(express.static('public'))

/*var users = 
[
	{id: 1, name: 'Linz'},
	{id: 2, name: 'Liar'},
	{id: 2, name: 'Blue'}
];*/

app.get("/", async (req, res) => {
	try {
		const response = await axios.get("https://views-score.firebaseio.com/views-score/hp.json");
		console.log(Object.keys(response.data))
		res.render("index", { hps: Object.keys(response.data) })
	} catch (err) {
		res.render("index", { hps: [] })
	}
})

app.post("/score/hp", async (req, res) => {
	const { hp, mssv } = req.body;
	const response = await axios.get("https://views-score.firebaseio.com/views-score/score/" + hp + ".json");
	console.log(response.data)

	let result = response.data.find(res => {
		return res.id === mssv;
	})
	res.send(result)
})

app.post("/score/add-hp", async (req, res) => {
	const { hpStringify, dataFilter } = req.body;

	try {
		await Promise.all([
			axios.put("https://views-score.firebaseio.com/views-score/score/" + hpStringify + ".json", dataFilter),
			axios.put("https://views-score.firebaseio.com/views-score/hp/" + hpStringify + ".json", { add: true })
		]);
		res.send({ message: "done" })
	} catch (err) {
		res.send({ message: "fail" })
	}
})


// Using template engines
// app.get('/', async function (req, res) {
// 	var users = await User.find();
// 	res.render('users/index', {
// 		users: users
// 	});
// });

app.listen(port, function () {
	console.log('Example app listen on port ' + port);
});

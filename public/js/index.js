const onSubmitFormGetData = async (e) => {
	e.preventDefault();

	let hp = document.getElementById("hp").value;
	let mssv = document.getElementById("mssv").value.toLowerCase();
	let dayOfBirth = new Date(
		document.getElementById("dayOfBirth").valueAsNumber
	).toLocaleDateString();

	document.getElementById("results").innerHTML = "Loading...";
	const res = await axios.post("/score/hp", { hp, mssv, dayOfBirth });

	if (res.data) {
		let rs = "Diem cua ban la <br />";
		for (let i in res.data.score) {
			rs += i + ": " + res.data.score[i] + "<br />";
		}
		document.getElementById("results").innerHTML = rs;
	} else {
		alert("Khong tim thay ket qua");
	}
};

window.onload = async () => {
	document
		.getElementById("formGetData")
		.addEventListener("submit", onSubmitFormGetData);
};

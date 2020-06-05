let file;

function change_alias(alias) {
	var str = alias.replace(/\s/g, "");
	str = str.toLowerCase();
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	str = str.replace(/đ/g, "d");
	// str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
	str = str.replace(/ + /g, " ");
	str = str.trim();
	return str;
}

const onSubmitFormAddData = async e => {
	e.preventDefault();

	try {
		const data = await readFile(file);
		const hpStringify = change_alias(data.hp);

		await axios.post("/score/add-hp", { hpStringify, dataFilter: data.dataFilter });
	} catch (err) {
		console.log(err)
	}
}

const onChangeFile = async e => {
	file = e.target.files[0];
}

const readFile = async (file) => {
	return new Promise((resolve, reject) => {
		try {
			const reader = new FileReader();
			reader.readAsBinaryString(file);

			reader.onload = (evt) => { // evt = on_file_select event
				/* Parse data */
				const bstr = evt.target.result;
				const wb = XLSX.read(bstr, { type: 'binary' });
				/* Get first worksheet */
				const wsname = wb.SheetNames[0];
				const ws = wb.Sheets[wsname];
				/* Convert array of arrays */
				const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
				const hp = data[0][1];

				let dataFilter = []
				if (data) {
					for (let i = 2; i < data.length; i++) {
						dataFilter.push({
							id: data[i][1],
							lastName: data[i][2],
							firstName: data[i][3],
							dayOfBirth: data[i][4],
							mssv: data[i][5],
							score: {
								th: data[i][27] || 0,
								lt: data[i][28] || 0,
								qt: data[i][29] || 0,
							}
						})
					}
				}
				resolve({ dataFilter, hp })
			};
		} catch (err) {
			reject(err)
		}
	})
}

const onSubmitFormGetData = async e => {
	e.preventDefault();

	let hp = document.getElementById("hp").value;
	let mssv = document.getElementById("mssv").value;

	const res = await axios.post("/score/hp", { hp, mssv });
	console.log(res)

	if (res.data) {
		let rs = "Diem cua ban la \n";
		for (let i in res.data.score) {
			rs += i + ": " + res.data.score[i] + " || ";
		}
		alert(rs)
	} else {
		alert("Khong tim thay ket qua")
	}
}

window.onload = async () => {

	document.getElementById("formAddData").addEventListener("submit", onSubmitFormAddData);
	document.getElementById("formGetData").addEventListener("submit", onSubmitFormGetData);
	document.getElementById("file").addEventListener("change", onChangeFile);
}

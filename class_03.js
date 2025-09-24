const fs = require("fs");
const dateEt = require("./src/dateTimeET");
const textRef = "txt/vanasonad.txt";

function pickOneValue(rawValue){
	console.log("Täna on " + dateEt.weekDay() + " " + dateEt.longDate());
	//teisendame teksti massiviks (list, array)
	let oldWisdomList = rawValue.split(";");
	//console.log(oldWisdomList);
	//loosime ühe vanasõna
	let wisdomCount = oldWisdomList.length;
	let randomNumber = Math.round(Math.random() * (wisdomCount - 1));
	console.log("Tänane vanasõna: " + oldWisdomList[randomNumber]);
}

function listAllWisdom(rawValue){
	let oldWisdomList = rawValue.split(";");
	for(let i = 0; i < oldWisdomList.length; i ++){
		console.log((i + 1) + ") " + oldWisdomList[i]);
	}
}

function readTextFile(rawText){
	fs.readFile(rawText, "utf8", (err, data)=>{
		if(err){
			console.log(err);
		} else {
			//console.log(data);
			if(Math.round(Math.random()) == 0){
				pickOneValue(data);
			} else {
				listAllWisdom(data);
			}
		}
	});
}

readTextFile(textRef);
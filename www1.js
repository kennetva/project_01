const fs = require("fs");
const http = require("http");
const dateEt = require("./src/dateTimeET");
const textRef = "txt/vanasonad.txt";

const pageStart = '<!DOCTYPE html>\n<html lang="et">\n\t<head>\n\t\t<title> Kennet Vaarma, veebiprogrammeerimine</title>\n\t</head>\n\t<body>';
const pageBody = '\n\t<h1> Kennet Vaarma, veebiprogrammeerimine</h1>\n\t<p>See veebileht on loodud testimiseks <a href="https://www.tlu.ee/">Tallinna Ülikoolis</a> ja ei oma mõistliku informatsiooni.</p>\n\t<p> algus html pärast juba node.js </p>\n\t<hr></hr>';
const pageEnd = '\n</body>\n</html>';

function pickOneValue(rawValue, res){
	let oldWisdomList = rawValue.split(";");
	//console.log(oldWisdomList);
	//loosime أ¼he vanasأµna
	let wisdomCount = oldWisdomList.length;
	let randomNumber = Math.round(Math.random() * (wisdomCount - 1));
	res.write("Tänane vanasõna: " + oldWisdomList[randomNumber]);
}

function listAllWisdom(rawValue, res){
	let oldWisdomList = rawValue.split(";");
	for(let i = 0; i < oldWisdomList.length; i ++){
		res.write((i + 1) + ") " + oldWisdomList[i]);
	}
}

function readTextFile(rawText, res, callback){
	fs.readFile(rawText, "utf8", (err, data)=>{
		if(err){
			res.write(err);
            callback();
		} else {
			//console.log(data);
			if(Math.round(Math.random()) == 0){
				pickOneValue(data, res);
			} else {
				listAllWisdom(data, res);
			}
            callback();
		}
	});
}

http.createServer(function(req, res){
    //console.log("loadin");
    res.writeHead(200, {"content-type": "text/html; charset=UTF-8"});
    //res.write("Juhhei! läkski käima!!!!!!");
    res.write(pageStart);
    res.write(pageBody);
    res.write("\n\t<p>Täna on " + dateEt.weekDay() + " " + dateEt.longDate() + "</p>");
     readTextFile(textRef, res, function () {
        res.write(pageEnd);
        return res.end();
     });
}).listen(5328);
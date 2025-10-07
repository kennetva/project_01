const http = require("http");
const fs = require("fs");
//lisame mooduli, et päringu URL-i mõista
const url = require("url");
//liidame mooduli et lisada virtuaalsele failisüsteemile päris failitee osi
const path = require("path");
const dateEt = require("./src/dateTimeET");
const textRef = "txt/vanasonad.txt";
const pageStart = '<!DOCTYPE html>\n<html lang="et">\n<head>\n\t<meta charset="utf-8">\n\t<title>Kennet Vaarma, veebiprogrammeerimine</title>\n</head>\n<body>';
const pageBody = '\n\t<h1>Kennet Vaarma, veebiprogrammeerimine</h1>\n\t<p>See leht on loodud <a href="https://www.tlu.ee">Tallinna üslikoolis</a> veebiprogrammeerimise kurusel ja ei oma mأµistlikku sisu.</p>\n\t<p>Algul lihtsalt HTML ja varsti juba Node.Js.</p>\n\t<hr>';
const pageBanner ='<img src = "vp_banner_2025_AA.jpg" alt = "kursuse bänner">';
const pageEnd = '\n</body>\n</html>';

http.createServer(function(req, res){
	//vaatan pأ¤rngut (req), mida klient tahab
	console.log("Praegune URL: " + req.url);
	//eraldame (parse) puhta URL-i ilma parameetrite jms kraamita
	let currentUrl = url.parse(req.url, true);
	console.log("puhas url on:" + currentUrl.pathname);

	//loon marsruudi erinevate URL-ide jaoks

	//avaleht
	if (currentUrl.pathname === "/"){
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageStart);
		res.write(pageBanner);
		res.write(pageBody);
		res.write("\n\t<p>Täna on " + dateEt.weekDay() + " " + dateEt.longDate() + "</p>");
		res.write('\n\t<p>Vaata mu <a href="/vanasonad">vanasõnu</a>.</p>')
		res.write('\n\t<p>Vaata mu <a href="/hobid">hobisid</a>.</p>')
		res.write(pageEnd);
		return res.end();
	}
	
	else if(currentUrl.pathname === "/vanasonad"){
	res.writeHead(200, {"Content-type": "text/html"});
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			res.write(pageStart);
			res.write(pageBanner);
			res.write(pageBody);
			res.write("\n\t<p>Tأ¤na on " + dateEt.weekDay() + " " + dateEt.longDate() + ".</p><p>Kahjuks tأ¤naseks أ¼htki vanasأµna vأ¤lja pakkuda pole!</p>");
			res.write(pageEnd);
			return res.end();
		} else {
			let oldWisdomList = data.split(";");
			let folkWisdomOutput = "\n\t<ol>";
			for (let i = 0; i < oldWisdomList.length; i ++){
				folkWisdomOutput += "\n\t\t<li>" + oldWisdomList[i] + "</li>";
			}
			folkWisdomOutput += "\n\t</ol>";
			res.write(pageStart);
			res.write(pageBanner);
			res.write(pageBody);
			res.write("\n\t<p>Täna on " + dateEt.weekDay() + " " + dateEt.longDate() + ".</p>");
			res.write("\n\t<h2>Valik Eesti vanasõnu</h2>")
			res.write(folkWisdomOutput);
			res.write(pageEnd);
			return res.end();
		}
	});
	}

	else if(currentUrl.pathname === "/vp_banner_2025_AA.jpg"){
		//liidame veebilehe aadressile vajaliku pöris kataloogi nime
		let bannerPath = path.join(__dirname, "img")
		fs.readFile(bannerPath + currentUrl.pathname, (err, data)=>{
			if (err){
				throw(err);
			}
			else {
				res.writeHead(200, {"content-type": "image/jpeg"});
				res.end(data)
			}
		});
	}

	//hobide osa
	else if(currentUrl.pathname === "/hobid"){
        res.writeHead(200, {"Content-type": "text/html"});
        res.write(pageStart);
        res.write(pageBanner);
        res.write(pageBody);
        res.write('\n\t<h2>Minu hobid</h2>');
        res.write('\n\t<ul>');
        res.write('\n\t\t<li><a href="https://www.basket.ee/">Korvpall</a></li>');
        res.write('\n\t\t<li><a href="https://level1.ee">Videomängud</a></li>');
        res.write('\n\t</ul>');
        res.write('\n\t<img src="/hobifoto.jpg" alt="Hobiga seotud foto">');
        res.write(pageEnd);
        return res.end();
    }

    // universaalne jpg failide teenindamine img kaustast
    else if(path.extname(currentUrl.pathname) === ".jpg"){
        let imgPath = path.join(__dirname, "img", path.basename(currentUrl.pathname));
        fs.readFile(imgPath, (err, data)=>{
            if (err){
                res.writeHead(404, {"Content-type": "text/plain"});
                res.end("Pilt puudub!");
            }
            else {
                res.writeHead(200, {"Content-type": "image/jpeg"});
                res.end(data);
            }
        });
    }


	else {
		res.end("Viga 404, no veits panid mooda praegu");
	}
}).listen(5328);
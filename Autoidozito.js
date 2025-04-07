javascript:
var PONTOS=50; /*Ennyivel hamarább indítja a támadást. Negatív: később indítja*/
var TIPUS="B"; /*B: Back, azaz mikor érkezzen be? N: Normal, azaz mikor indítsa?*/
function elkuld(){
	var x = new Date();
	console.info('OK:',writeoutDate(x));
	d.getElementById("troop_confirm_submit").click();
	return;
}

function createWorker(main){
    var blob = new Blob(
        ["(" + main.toString() + ")(self)"],
        {type: "text/javascript"}
    );
    return new Worker(window.URL.createObjectURL(blob));
}

function checktimeshift(){
	var f_ora=document.getElementById("serverDate").innerHTML+" "+document.getElementById("serverTime").innerHTML;
	var f_datum=f_ora.match(/[0-9]+/g);
	var serverido = new Date(f_datum[2],f_datum[1]-1,f_datum[0],f_datum[3],f_datum[4],f_datum[5],0);
	var otthoniido= new Date();
	if (Math.abs(otthoniido-serverido)>5000) {
			return "Vigyázat!\nA szerver ideje, és az Ön operációs rendszerének ideje erősen nem egyforma. A támadás küldése viszont az Ön rendszerének idejéhez lesz mérve.\nAz időeltolódás: "+((otthoniido-serverido)/1000) +
			"mp, azaz "+(((otthoniido-serverido)/1000)/60).toFixed(2)+" perc!\n\n";
	}
	return "";
}

function writeoutDate(d, isOnlyTime) {
	var date = "";
	if (!isOnlyTime) date = d.getFullYear() + "." + leadNull((d.getMonth()+1)) + "." + leadNull(d.getDate()) + " ";
	return date +
		leadNull(d.getHours()) + ":" + leadNull(d.getMinutes()) + ":" + leadNull(d.getSeconds()) + ":" + leadNull(d.getMilliseconds(), true);
	
	function leadNull(num, triple) {
		num = parseInt(num, 10);
		if (triple && num<10) return "00" + num;
		if (triple && num<100) return "0" + num;
		if (num<10) return "0" + num;
		return num;
	}
}
function getIdotartam() {
	var patt=/(<td>)[0-9]+(:)[0-9]+(:)[0-9]+/g;
	var utIdo=d.getElementById("content_value").innerHTML.match(patt)[0].match(/[0-9]+/g);
	for (var i=0;i<utIdo.length;i++) utIdo[i]=parseInt(utIdo[i],10);
	return utIdo;
}

function convert_beIdo(beIdo, utIdo) {
	var datumSplit=BeIdo.match(/[0-9]+/g);
	var datum = [];
	for (i=0;i < datumSplit.length;i++){
		datumSplit[i] = parseInt(datumSplit[i], 10); 
	}
	
	if ((datumSplit.length == 3 || datumSplit.length == 4)) {
		if (datumSplit.length == 3) datumSplit[3] = 0;
		if (datumSplit[0] > 23 || datumSplit[1] > 59 || datumSplit[2] > 59 || datumSplit[3] > 999) {
			alert ("Érvénytelen időpontmegadás");
			exit(0);
		}
		
		var now = new Date();
		var beadott_ido = new Date();
		
		if (TIPUS == "B") {
			beadott_ido.setHours(datumSplit[0]);
			beadott_ido.setMinutes(datumSplit[1]);
			beadott_ido.setSeconds(datumSplit[2]);
			now.setHours(now.getHours() + utIdo[0]);
			now.setMinutes(now.getMinutes() + utIdo[1]);
			now.setSeconds(now.getSeconds() + utIdo[2]);
			beadott_ido.setFullYear(now.getFullYear());
			beadott_ido.setMonth(now.getMonth());
			beadott_ido.setDate(now.getDate());
		} else {
			beadott_ido.setHours(datumSplit[0]);
			beadott_ido.setMinutes(datumSplit[1]);
			beadott_ido.setSeconds(datumSplit[2]);
		}
		
		if (now > beadott_ido) beadott_ido.setDate(beadott_ido.getDate() + 1);
		datum = [beadott_ido.getFullYear(), beadott_ido.getMonth() + 1, beadott_ido.getDate(), datumSplit[0], datumSplit[1], datumSplit[2], datumSplit[3]];
	} else datum = datumSplit;
	

	if (datum.length<7) datum[6]=0;
	if (datum[0] < 2017 || datum[0] > 2050 || datum[1]>12 || datum[2]>31 || datum[3]>23 || datum[4]>59 || datum[5]>59 || datum[6]>999) {alert ("Érvénytelen időpontmegadás"); exit(0);}

	return datum;
}

var d=document;
if (window.frames.length>0 && typeof window.main !== 'undefined') d=window.main.document;
if (d.URL.indexOf('try=confirm')==-1) {
	alert('Gyülekezőhelyen, támadás/erősítés leokézása előtt próbáld...');
	exit(0);
}

var alertStr = "";
try{
	alertStr = checktimeshift();
}catch(e){alert('Hiba történt, a script kilép...\n\n' + e); exit(0);}

TIPUS = TIPUS.toUpperCase();
var tipus = 'parancs';
var toltoSzoveg="Adja meg az indítás idejét:";
if (TIPUS=="B") {
	toltoSzoveg = "Adja meg, mikorra érkezzen a sereg:";
}

var opSysTime=new Date();

var odaerkezes = new Date();
if (TIPUS=="B") { /*Csak BACK számításakor kell majd*/
	var ut_idotartam = getIdotartam();
	odaerkezes.setHours(odaerkezes.getHours() + ut_idotartam[0]);
	odaerkezes.setMinutes(odaerkezes.getMinutes() + ut_idotartam[1]);
	odaerkezes.setSeconds(odaerkezes.getSeconds() + ut_idotartam[2]);
}
odaerkezes.setMilliseconds(0);

const now = new Date();
now.setSeconds(now.getSeconds() + 20);
console.log("🕓 Current time + 20 sec:", now.toLocaleString());

const durationRow = Array.from(document.querySelectorAll("table.vis tr"))
    .find(tr => tr.children[0]?.textContent.trim().includes("Időtartam:"));

if (!durationRow) {
    console.error("❌ 'Időtartam:' row not found.");
    throw new Error("Duration row missing");
}

const durationText = durationRow.children[1]?.textContent.trim();
console.log("⏱️ Raw duration text:", durationText);

const timeMatch = durationText.match(/^(\d+):(\d+):(\d+)$/);
if (!timeMatch) {
    console.error("❌ Could not parse időtartam format. Expected HH:MM:SS");
    throw new Error("Bad format in Időtartam");
}

const [______, hh, mm, ss] = timeMatch;
const durationMs = (+hh * 3600 + +mm * 60 + +ss) * 1000;
console.log(`⏱️ Parsed duration → ${hh}h ${mm}m ${ss}s = ${durationMs}ms`);

const arrival = new Date(now.getTime() + durationMs);
console.log("🚚 Calculated arrival time:", arrival.toLocaleString());

function formatDateToPromptStyle(d) {
    const pad = (n, len = 2) => String(n).padStart(len, '0');
    return `${d.getFullYear()} ${pad(d.getMonth() + 1)} ${pad(d.getDate())} ${pad(d.getHours())} ${pad(d.getMinutes())} ${pad(d.getSeconds())} ${pad(d.getMilliseconds(), 3)}`;
}

const BeIdo = formatDateToPromptStyle(arrival);
console.log("🧾 Final BeIdo:", BeIdo);
if (BeIdo==null) exit(0);

var datum = convert_beIdo(BeIdo, ut_idotartam);
var dateforOutput = new Date(datum[0],datum[1]-1,datum[2],datum[3],datum[4],datum[5],datum[6]);
var ERKEZES = 		new Date(datum[0],datum[1]-1,datum[2],datum[3],datum[4],datum[5],datum[6]);

var indIdoText = "";
if (TIPUS=="B") {
	ERKEZES.setHours(ERKEZES.getHours() - ut_idotartam[0]);
	ERKEZES.setMinutes(ERKEZES.getMinutes() - ut_idotartam[1]);
	ERKEZES.setSeconds(ERKEZES.getSeconds() - ut_idotartam[2]);
	ERKEZES.setMilliseconds(ERKEZES.getMilliseconds() - PONTOS);
	indIdoText = "Indítás ideje: <font style='color: #FF00FF; font-weight: bold; font-size: 115%;'>" + writeoutDate(ERKEZES, true) + '</font><br>';
	ERKEZES.setMilliseconds(ERKEZES.getMilliseconds() + PONTOS);
}

kieg=document.createElement("p");
kieg.innerHTML=`Felülbírálva:<br>c&amp;c időzítő beállítva erre:<br><b>${writeoutDate(dateforOutput, false)}</b><br>${indIdoText}<br>Pontosítás: <font style='color: red;'>${PONTOS}ms</font>`;
document.getElementById("date_arrival").innerHTML="";
document.getElementById("date_arrival").appendChild(kieg);

/*SZIDO meghatározása, azaz mennyi ms múlva kell OK-ézni*/

var CURRTIME=new Date();
/*CURRTIME.setMilliseconds(CURRTIME.getMilliseconds()+PONTOS);*/
SZIDO=(ERKEZES - CURRTIME)-PONTOS;
if (typeof(window.URL) != "undefined") {
	var worker = createWorker(function(self){
		self.addEventListener("message", function(e) {
			setTimeout(function(){
				postMessage('');
			}, e.data);
		}, false);
	});

	worker.onmessage = function(e) {
		elkuld();
	};
	worker.postMessage(SZIDO);
} else {
	setTimeout(function(){
		elkuld();
	}, SZIDO);
}
void(0);

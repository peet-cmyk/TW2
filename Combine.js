function stop(){
	var x = setTimeout('',100); for (var i = 0 ; i < x ; i++) clearTimeout(i);
}
function loadXMLDoc(dname) {
	if (window.XMLHttpRequest) xhttp=new XMLHttpRequest();
		else xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	xhttp.open("GET",dname,false);
	xhttp.send();
	return xhttp.responseXML;
}
stop(); /*Időstop*/
document.getElementsByTagName("html")[0].setAttribute("class","");
var KTID = {};
var VILL1ST;
var BOT = false;
var T_ID = 0;
UNITS=["spear","sword","axe","archer","spy","light","marcher","heavy", 'ram', 'catapult', 'snob'];
var BASE_URL=document.location.href.split("game.php")[0];
var CONFIG=loadXMLDoc(BASE_URL+"interface.php?func=get_config");
var SPEED=parseFloat(CONFIG.getElementsByTagName("speed")[0].textContent);
var UNIT_S=parseFloat(CONFIG.getElementsByTagName("unit_speed")[0].textContent);
var STATES = {
	no: 0,
	refs: [],
	states: []
};
var TEST_STATE = {
	no: 0,
	refs: [],
	states: [],
	data: []
};
var checkref = null; 
function bagolyStartAttack(ref) {try{
	ref.document.getElementById("troop_confirm_submit").click();
}catch(e) { console.error(e); console.log('bagolyStartAttack', 'ERROR: Nem tudtam elindítani a támadást/erősítést'); }}

var worker = createWorker(function(self){
	// worker.postMessage({'id': 'farm', 'time': nexttime});
	self.addEventListener("message", function(e) {
		setTimeout(() => { postMessage(e.data); }, e.data.time);
	}, false);
});
var PONTOS = 0;
var PONTOS_DATE = new Date('2000.01.01 12:00:00');
worker.onmessage = function(worker_message) {
	worker_message = worker_message.data;
	switch(worker_message.id) {
		case 'startProbaMotor': startProbaMotor(); break;
        case 'sendTestAttack': bagolyStartAttack(TEST_STATE.refs[worker_message.no]); break;
        case 'getKTID': getktid(); break
        case 'runInit': init(checkref); break;
		// default: debug('worker','Ismeretlen ID', JSON.stringify(worker_message))
	}
};
function createWorker(main){
	var blob = new Blob(
		["(" + main.toString() + ")(self)"],
		{type: "text/javascript"}
	);
	return new Worker(window.URL.createObjectURL(blob));
}

function init(ref) {try{
	let PFA;
	if (ref.document.getElementById("production_table")) PFA=ref.document.getElementById("production_table"); else 
	if (ref.document.getElementById("combined_table")) PFA=ref.document.getElementById("combined_table"); else 
	if (ref.document.getElementById("buildings_table")) PFA=ref.document.getElementById("buildings_table"); else 
	if (ref.document.getElementById("techs_table")) PFA=ref.document.getElementById("techs_table");
	else {
		alert("Ilyen nézetbe való futtatás nem támogatott. Kísérlet az áttekintés betöltésére...\n\nLaunching from this view is not supported. Trying to load overview...");
		ref.document.location.href=ref.document.location.href.replace(/screen=[a-zA-Z]+/g,"screen=overview_villages");
		return false;
	}
	var patt = new RegExp(/[0-9]+(\|)[0-9]+/);
	if (patt.test(PFA.rows[1].cells[0].textContent)) var oszl=0; else
	if (patt.test(PFA.rows[1].cells[1].textContent)) var oszl=1; else
	if (patt.test(PFA.rows[1].cells[2].textContent)) var oszl=2; else
	{alert("Nem találok koordinátákat ebbe a listába.\n\nI can not find coordinates in this view."); return false;}
	VILL1ST=PFA.rows[1].cells[oszl].getElementsByTagName("a")[0].href;
	for (var i=1;i<PFA.rows.length;i++) {
		var kord=PFA.rows[i].cells[oszl].textContent.match(/[0-9]+(\|)[0-9]+/g);
		kord=kord[kord.length-1];
		KTID[kord] = {
			id: PFA.rows[i].cells[oszl].getElementsByTagName("span")[0].getAttribute("data-id").match(/[0-9]+/g)[0],
			name: PFA.rows[i].cells[oszl].textContent.trim()
		};
	}
    console.log(KTID)
}catch(e){alert("Hiba indításkor:\n\nError at starting:\n"+e); return false;}}

function isPageLoaded(ref,faluid,address){try{
	if (ref.closed) return false;
	if (ref.document.getElementById('bot_check') || ref.document.getElementById('popup_box_bot_protection') || ref.document.title=="Bot védelem") {
		console.log("Globális","Bot védelem aktív!!!");
		document.getElementById("audio1").volume=0.2;
		BotvedelemBe();
		return false;
	}
	if (ref.document.location.href.indexOf("sid_wrong")>-1) {
		console.log("Globális","Kijelentkezett fiók. Jelentkezzen be újra, vagy állítsa le a programot.");
		BotvedelemBe();
		return false;
	}
	if (!address) return false;
	if (address.indexOf("not ")>-1) var neg=true; else var neg=false;
	if (faluid>-1) if (ref.game_data.village.id!=faluid) return false;
	if (ref.document.getElementById("serverTime").innerHTML.length>4) {
		if (neg) {
			if (ref.document.location.href.indexOf(address.split(" ")[1])==-1) return true;
		} else {
			if (ref.document.location.href.indexOf(address)>-1)	return true;
		}
	}
	return false;
}catch(e){return false;}}
function BotvedelemBe(){try{
	playSound("bot");
	BOT=true;
	alert2('BOT VÉDELEM!!!<br>Írd be a kódot, és kattints ide lentre!<br><br><a href="javascript: BotvedelemKi()">Beírtam a kódot, mehet tovább!</a>');
	}catch(e){nap('BotvedelemBe()', 'ERROR: ' + e);}
	BOTORA=setTimeout(() => BotvedelemBe(), 1500);
}
function BotvedelemKi(){
	BOT=false;
	//BOT_VOL=0.0;
	document.getElementById("audio1").pause;
	alert2("OK");
	clearTimeout(BOTORA);
	return;
}
function writeoutDate(d, isOnlyTime) {
	var date = "";
	d=new Date(d);
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
function _getVillageLink(koord, screen='place') {
	return VILL1ST
		.replace(/village=[0-9]+/,"village="+KTID[koord].id)
		.replace('screen=overview', `screen=${screen}`);
}
function _distCalc(S,D){
	S[0]=parseInt(S[0]);
	S[1]=parseInt(S[1]);
	D[0]=parseInt(D[0]);
	D[1]=parseInt(D[1]);
	return Math.abs(Math.sqrt(Math.pow(S[0]-D[0],2)+Math.pow(S[1]-D[1],2)));
}
function _checkvillage(villFormEl, isForras=false) {
	const patt = /[0-9]{1,3}\|[0-9]{1,3}/g;
	let falu = villFormEl.value;
	if (patt.test(falu)) falu = falu.match(patt)[0];
	if (!patt.test(falu) || (isForras === true && !KTID[falu])) {
		return false;
	}
	villFormEl.value = falu;
	return true;
}

/* ----------- KÉSLELTETÉS MEGÁLLAPÍTÓ --------------- */
function getIdotartam(ref) {
	var patt=/(<td>)[0-9]+(:)[0-9]+(:)[0-9]+/g;
	var utIdo=ref.document.getElementById("content_value").innerHTML.match(patt)[0].match(/[0-9]+/g);
	for (var i=0;i<utIdo.length;i++) utIdo[i]=parseInt(utIdo[i],10);
	return utIdo;
}
function calculateDifference(originalTime, resultTime) {
	const originDate = new Date(originalTime);
	const givenTime = new Date(originDate.toDateString() + ' ' + resultTime.join(':'));

	return givenTime.getTime() - originDate.getTime();
}
function bagoly_teszt_1openVillage(no, refArray) {
    try {
        console.log('=== Starting bagoly_teszt_1openVillage ===');
        console.log('Parameters:', { no, refArray });

        
        const keys = Object.keys(KTID);
        if (keys.length < 2) {
            console.warn('Not enough villages in KTID to select unique source and target.');
            return false;
        }

        let forrasFalu = keys[Math.floor(Math.random() * keys.length)];
        let celFalu;
        do {
            celFalu = keys[Math.floor(Math.random() * keys.length)];
        } while (celFalu === forrasFalu);

        console.log('Selected villages:', { forrasFalu, celFalu });

        // Check if the selected villages exist in KTID
        if (!KTID[forrasFalu] || !KTID[celFalu]) {
            console.warn('Selected villages not found in KTID:', { forrasFalu, celFalu });
            return false;
        }

        console.log('Setting TEST_STATE data...');
        TEST_STATE.data[no] = {
            villageId: KTID[forrasFalu].id,
            targetVillage: celFalu,
        };
        console.log('TEST_STATE data:', TEST_STATE.data[no]);

        console.log('Opening window for village...');
        refArray[no] = window.open(_getVillageLink(forrasFalu), `bagoly-teszt-${no}`);
        console.log('Window reference:', refArray[no]);

        console.log('=== Finished bagoly_teszt_1openVillage ===');
        return true;
    } catch (e) {
        console.error('Error occurred in bagoly_teszt_1openVillage:', e);
        return false;
    }
}



function bagoly_teszt_2insertTestUnits(no, refArray) {
	const ref = refArray[no];
	const celpont = TEST_STATE.data[no].targetVillage;
	var C_form=ref.document.forms["units"];
	let targetUnit = '';
	for (let i=0;i<UNITS.length;i++) {
		if (ref.document.getElementById(`units_entry_all_${UNITS[i]}`).textContent !== '(0)') {
			targetUnit = UNITS[i];
			break;
		}
	}
	if (targetUnit == '') {
		console.log('insertTesztUnits', 'ERROR: Nincs egység a teszteléshez kiírt faluban...');
		return false;
	}

	C_form[targetUnit].value = 1;
	C_form.x.value=celpont.split("|")[0];
	C_form.y.value=celpont.split("|")[1];
	C_form.support.click();
	return true;
}

function bagoly_teszt_3startTestTimer(no, refArray) {
	const ref = refArray[no];
	const utido = getIdotartam(ref);
	const utidoMp = utido[0] * 3600 + utido[1] * 60 + utido[2];
	let celIdo = new Date();
	celIdo.setSeconds(celIdo.getSeconds() + utidoMp + 10);
	celIdo.setMilliseconds(0);
	celIdo = celIdo.getTime();

	TEST_STATE.data[no].celIdo = celIdo;
	TEST_STATE.data[no].start = setBagolyTimer(no, celIdo, true);
}
function bagoly_teszt_4searchTestResult(no, refArray) {
	const ref = refArray[no];
	const attackTable = ref.document.getElementById('commands_outgoings');
	if (!attackTable) {
		console.log('searchTestResult', 'ERROR: Nem találok elküldött sereget, pedig most küldtem...');
		return;
	}
	const originalTargetTime = new Date(TEST_STATE.data[no].celIdo);
	const allAttack = attackTable.querySelectorAll('.command-row');
	for (let i=0;i<allAttack.length;i++) {
		if (allAttack[i].querySelector('.command-cancel') && allAttack[i].querySelector('[data-command-type="support"]')) {
			let targetCoord = allAttack[i].cells[0].textContent.match(/[0-9]{1,3}\|[0-9]{1,3}/)[0];
			if (targetCoord == TEST_STATE.data[no].targetVillage) {
				let time = allAttack[i].cells[1].textContent.match(/[0-9]+/g).map(str => parseInt(str, 10));
				PONTOS += calculateDifference(originalTargetTime, time);
				console.log('Bemérés', `Időbemérés megtörtént, pontosítás ${PONTOS}ms-re állítva`);
				PONTOS_DATE = new Date();
				//document.getElementById("pontos_display").innerHTML = `PONTOS = ${PONTOS} (${PONTOS_DATE.toLocaleTimeString()})`;
				allAttack[i].querySelector('.command-cancel').click();
				setTimeout(() => TEST_STATE.refs[no].close(), 1000);
				break;
			}
		}
	}
}
function startProbaMotor() {
	nexttime = 1000;
	let no = TEST_STATE.no;

	if (!TEST_STATE.states[no]) TEST_STATE.states[no] = 0;
	try {
		switch (TEST_STATE.states[no]) {
			case 0:
				if (bagoly_teszt_1openVillage(no, TEST_STATE.refs))
					TEST_STATE.states[no] = 1;
				break;
			case 1:
				if (TEST_STATE.refs[no].document.location.href.indexOf("try=confirm") == -1 && isPageLoaded(TEST_STATE.refs[no], TEST_STATE.data[no].villageID, "screen=place")) {
					if (bagoly_teszt_2insertTestUnits(no, TEST_STATE.refs)) {
						TEST_STATE.states[no] = 2;
					} else {
						nexttime = 5000;
						TEST_STATE.states[no] = 0;
					}
				}
				break;
			case 2:
				if (isPageLoaded(TEST_STATE.refs[no], TEST_STATE.data[no].villageID, "try=confirm")) {
					bagoly_teszt_3startTestTimer(no, TEST_STATE.refs);
					TEST_STATE.states[no] = 3;
				}
				break;
			case 3:
				if (new Date().getTime() < TEST_STATE.data[no].start) break;
				if (TEST_STATE.refs[no].document.location.href.indexOf("try=confirm") == -1 && isPageLoaded(TEST_STATE.refs[no], TEST_STATE.data[no].villageID, "screen=place")) {
					bagoly_teszt_4searchTestResult(no, TEST_STATE.refs);
					return;
				}
				break;
		}
//		if (no == 0) no = 1; else no = 0;
	} catch(e) {
		console.error(e);
		console.log('startProbaMotor', '❗Error: Motorhiba: ' + e);
	}
	// PROBA_STATE.refs[PROBA_STATE.no]
	worker.postMessage({'id': 'startProbaMotor', 'time': nexttime});
}

function getktid() {
    const currentUrl = window.location.href;

    const baseUrl = currentUrl.split("&screen")[0];
    const newUrl = `${baseUrl}&screen=overview_villages&mode=combined`;

    console.log("Opening URL:", newUrl);
    checkref = window.open(newUrl, "_blank");

    checkref.addEventListener("load", () => {
        console.log("Sending message to new window...");
        worker.postMessage({'id': 'runInit'});
    });

  
}

function triggerProbaMotor() {
    worker.postMessage({'id': 'getKTID'});
	TEST_STATE = {
		no: 0,
		refs: [],
		states: [],
		data: []
	};
	startProbaMotor();
}


function setBagolyTimer(no, celIdo, isTest=false) {try{
	let ref;
	if (isTest) {
		ref = TEST_STATE.refs[no];
	} else {
		ref = STATES.refs[no];
	}
	const kieg=ref.document.createElement("p");
	let utido = getIdotartam(ref);
	let utidoMp = utido[0] * 3600 + utido[1] * 60 + utido[2];
	let temp = new Date();
	temp.setSeconds(temp.getSeconds() + utidoMp);
	temp = temp.getTime();
	const inditas = new Date().getTime() + (celIdo - temp);

	let indIdoText = "Indítás ideje: <font style='color: #FF00FF; font-weight: bold; font-size: 115%;'>" + writeoutDate(inditas, true) + '</font><br>';

	kieg.innerHTML="Felülbírálva:<br>Bagoly automatika beállítva erre:<br><b>" + writeoutDate(celIdo, false) + "</b><br>" + indIdoText + "Pontosítás: <font style='color: red;'>"+PONTOS+"ms</font>"; 
	ref.document.getElementById("date_arrival").setAttribute('style', 'background: #f4e4bc url(http://cncdani2.000webhostapp.com/!Files/images/ido_dead2.png) no-repeat; background-position: right top; background-size: 40px;');
	ref.document.getElementById("date_arrival").innerHTML="";
	ref.document.getElementById("date_arrival").appendChild(kieg);
	worker.postMessage({'id': 'sendTestAttack', 'time': ((celIdo - temp) - PONTOS), 'no': no});
	return inditas;
}catch(e) { console.error(e); console.log('setBagolyTimer', 'ERROR: Nem tudtam beállítani az időzítőt'); }
return false;}


triggerProbaMotor();

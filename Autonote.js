var ScriptData={name:"AutoNote Plus",version:"1.1",lastUpdate:"2024-04-14",author:"Swiftblade, xdam98",authorContact:"swiftblade_tw (Discord)"
},LS_prefix="swift",translations={hu_HU: {
    unknown: "Ismeretlen",
    verifyReportPage: "A scriptet csak a jelentések felületen lehet futtatni.",
    offensive: "Támadó",
    defensive: "Védekező",
    probOffensive: "Valószínűleg Támadó",
    probDefensive: "Valószínűleg Védekező",
    noSurvivors: "Egyetlen egység sem élte túl",
    watchtower: "Őrtorony",
    wall: "Fal",
    firstChurch: "Első Templom",
    church: "Templom",
    defensiveNukes: "Védekező Nuke",
    noteCreated: "Jegyzet létrehozva",
    addReportTo: "Jelentés hozzáadása valamelyik faluhoz:"
},pt_PT:{unknown:"Desconhecido",verifyReportPage:"O Script deve ser utilizado inside de um relatÃ³rio",offensive:"Ofensiva",
defensive:"Defensiva",probOffensive:"Provavelmente Ofensiva",probDefensive:"Provavelmente Defensiva",noSurvivors:"Nenhuma tropa sobreviveu",watchtower:"Torre",
wall:"Muralha",firstChurch:"Igreja Principal",church:"Igreja",defensiveNukes:"fulls defesa",noteCreated:"Nota criada!",addReportTo:"Colocar relatÃ³rio no?",
atacante:"Atacante",defensor:"Defensor"},en_DK:{unknown:"Unknown",verifyReportPage:"This script can only be run on a report screen.",offensive:"Offensive",
defensive:"Defensive",probOffensive:"Probably Offensive",probDefensive:"Probably Defensive",noSurvivors:"No troops survived",watchtower:"Watchtower",
wall:"Wall",firstChurch:"First church",church:"Church",defensiveNukes:"Defensive Nukes",noteCreated:"Note created!",addReportTo:"Add report to which village?",
atacante:"Attacker",defensor:"Defender"},en_US:{unknown:"Unknown",verifyReportPage:"This script can only be run on a report screen.",offensive:"Offensive",
defensive:"Defensive",probOffensive:"Probably Offensive",probDefensive:"Probably Defensive",noSurvivors:"No troops survived",watchtower:"Watchtower",
wall:"Wall",firstChurch:"First church",church:"Church",defensiveNukes:"Defensive Nukes",noteCreated:"Note created!",addReportTo:"Add report to which village?",
atacante:"Attacker",defensor:"Defender"},ro_RO:{unknown:"Unknown",verifyReportPage:"This script can only be run on a report screen.",offensive:"Offensive",
defensive:"Defensive",probOffensive:"Probably Offensive",probDefensive:"Probably Defensive",noSurvivors:"No troops survived",watchtower:"Watchtower",
wall:"Wall",firstChurch:"First church",church:"Church",defensiveNukes:"Defensive Nukes",noteCreated:"Note created!",addReportTo:"Add report to which village?",
atacante:"Atacator",defensor:"Apărător"},pl_PL:{unknown:"Nieznany",verifyReportPage:"Ten skrypt moÅ¼na uruchomiÄ‡ tylko na ekranie raportu.",
offensive:"Ofensywna",defensive:"Defensywna",probOffensive:"Prawdopodobnie Ofensywna",probDefensive:"Prawdopodobnie Defensywna",
noSurvivors:"Å»adne wojska nie przeÅ¼yÅ‚y",watchtower:"WieÅ¼a straÅ¼nicza",wall:"Mur",firstChurch:"Pierwszy koÅ›ciÃ³Å‚",church:"KoÅ›ciÃ³Å‚",
defensiveNukes:"bunkier",noteCreated:"Utworzono notatkÄ!",addReportTo:"Dodaj raport do ktÃ³rej wioski?",atacante:"Napastnik",defensor:"Obrońca"},de_DE:{
unknown:"Unbekannt",verifyReportPage:"Dieses Skript kann nur auf einer Berichtsseite ausgeführt werden.",offensive:"Offensiv",defensive:"Defensiv",
probOffensive:"Wahrscheinlich Offensiv",probDefensive:"Wahrscheinlich Defensiv",noSurvivors:"Keine Truppen haben überlebt",watchtower:"Wachturm",wall:"Mauer",
firstChurch:"Erste Kirche",church:"Kirche",defensiveNukes:"Verteidigungs-Nukes",noteCreated:"Notiz erstellt!",addReportTo:"Bericht hinzufügen zu welchem Dorf?",
atacante:"Angreifer",defensor:"Verteidiger"}
},_t=a=>null!=translations[game_data.locale]?translations[game_data.locale][a]:translations.pt_PT[a],initTranslations=()=>localStorage.getItem(`${LS_prefix}_langWarning`)?1:(void 0===translations[game_data.locale]&&UI.ErrorMessage(`No translation found for <b>${game_data.locale}</b>.`,3000),
localStorage.setItem(`${LS_prefix}_langWarning`,1),0)
CreateReportNotes={data:{player:{playerName:game_data.player.name,playerIsAttacking:false,playerIsDefending:false,playerWantInfoAttacker:false,
playerWantInfoDefender:false},village:{attacker:{username:"",idVillage:"-1",typeVillage:_t("unknown"),troops:{totals:[],offensives:0,defensives:0}},defender:{
username:"",idVillage:"-1",typeVillage:_t("unknown"),troops:{visible:false,totals:[],outside:{visible:false,offensives:0,defensives:0,totals:[]},inside:{
offensives:0,defensives:0,totals:[]},supports:0},buildings:{buildingsVisible:false,tower:[false,0],mainChurch:[false,0],church:[false,0],wall:[false,0]}}},
world:{farmByTroops:[],archersActive:false}},configs:{hideTroops:false},checkPage:function(){
var a=window.location.href.match(/(screen\=report){1}|(view\=){1}\w+/g)
return!(!a||2!=a.length)||(UI.ErrorMessage(_t("verifyReportPage"),5000),false)},initConfigs:function(){
this.configs.hideTroops=this.loadLSConfig("hideTroops",false)},loadLSConfig:(a,e)=>localStorage.getItem(`${LS_prefix}_${a}`)??e,initScriptData:function(){
var a=this
this.data.world.archersActive=game_data.units.includes("archer"),this.data.world.archersActive?(this.data.village.attacker.troops.totals=new Array(10).fill(0),
this.data.village.defender.troops.totals=new Array(10).fill(0),this.data.village.defender.troops.outside.totals=new Array(10).fill(0),
this.data.village.defender.troops.inside.totals=new Array(10).fill(0),
this.data.world.farmByTroops=[1,1,1,1,2,4,5,6,5,8]):(this.data.village.attacker.troops.totals=new Array(8).fill(0),
this.data.village.defender.troops.totals=new Array(8).fill(0),this.data.village.defender.troops.outside.totals=new Array(8).fill(0),
this.data.village.defender.troops.inside.totals=new Array(8).fill(0),this.data.world.farmByTroops=[1,1,1,2,4,6,5,8]),
this.data.village.attacker.username=$("#attack_info_att > tbody > tr:nth-child(1) > th:nth-child(2) > a").text(),
this.data.village.defender.username=$("#attack_info_def > tbody > tr:nth-child(1) > th:nth-child(2) > a").text()
var s=3
if("0"!=game_data.player.sitter&&(s=4),a.data.village.attacker.idVillage=$("#attack_info_att > tbody > tr:nth-child(2) > td:nth-child(2) > span > a:nth-child(1)").url().split("=")[s],
a.data.village.defender.idVillage=$("#attack_info_def > tbody > tr:nth-child(2) > td:nth-child(2) > span > a:nth-child(1)").url().split("=")[s],
this.data.player.playerName==this.data.village.defender.username&&(this.data.player.playerIsDefending=true),
this.data.player.playerName==this.data.village.attacker.username&&(this.data.player.playerIsAttacking=true),
$("#attack_spy_away > tbody > tr:nth-child(1) > th").length&&(this.data.village.defender.troops.outside.visible=true,
this.data.world.archersActive?$("#attack_spy_away > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td").each((function(e,i){
var s=parseInt(i.textContent)
e<a.data.village.defender.troops.totals.length&&(a.data.village.defender.troops.outside.totals[e]=s)
var unit_farm_space=e in a.data.world.farmByTroops?a.data.world.farmByTroops[e]:0
2==e||5==e||6==e||8==e?a.data.village.defender.troops.outside.offensives+=s*unit_farm_space:0==e&&1==e&&3==e&&7==e&&9==e||(a.data.village.defender.troops.outside.defensives+=s*unit_farm_space)
})):$("#attack_spy_away > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td").each((function(e,i){var s=parseInt(i.textContent)
e<a.data.village.defender.troops.totals.length&&(a.data.village.defender.troops.outside.totals[e]=s)
var unit_farm_space=e in a.data.world.farmByTroops?a.data.world.farmByTroops[e]:0
2==e||4==e||6==e?a.data.village.defender.troops.outside.offensives+=s*unit_farm_space:0==e&&1==e&&5==e&&7==e||(a.data.village.defender.troops.outside.defensives+=s*unit_farm_space)
}))),$("#attack_info_def_units > tbody > tr:nth-child(2) > td").length&&(this.data.village.defender.troops.visible=true),
this.data.world.archersActive?(this.data.village.defender.troops.visible&&$("#attack_info_def_units > tbody > tr:nth-child(2) > td.unit-item").each((function(e,i){
var s=parseInt(i.textContent)
e<a.data.village.defender.troops.totals.length&&(a.data.village.defender.troops.inside.totals[e]=s)
var unit_farm_space=e in a.data.world.farmByTroops?a.data.world.farmByTroops[e]:0
2==e||5==e||6==e||8==e?a.data.village.defender.troops.inside.offensives+=s*unit_farm_space:0==e&&1==e&&3==e&&7==e&&9==e||(a.data.village.defender.troops.inside.defensives+=s*unit_farm_space)
})),$("#attack_info_att_units > tbody > tr:nth-child(2) > td.unit-item").each((function(e,i){var s=parseInt(i.textContent)
e<a.data.village.attacker.troops.totals.length&&(a.data.village.attacker.troops.totals[e]=s)
var unit_farm_space=e in a.data.world.farmByTroops?a.data.world.farmByTroops[e]:0
2==e||5==e||6==e?a.data.village.attacker.troops.offensives+=s*unit_farm_space:0==e&&1==e&&3==e&&7==e&&9==e||(a.data.village.attacker.troops.defensives+=s*unit_farm_space)
}))):(this.data.village.defender.troops.visible&&$("#attack_info_def_units > tbody > tr:nth-child(2) > td.unit-item").each((function(e,i){
var s=parseInt(i.textContent)
e<a.data.village.defender.troops.totals.length&&(a.data.village.defender.troops.inside.totals[e]=s)
var unit_farm_space=e in a.data.world.farmByTroops?a.data.world.farmByTroops[e]:0
2==e||4==e||6==e?a.data.village.defender.troops.inside.offensives+=s*unit_farm_space:0==e&&1==e&&5==e&&7==e||(a.data.village.defender.troops.inside.defensives+=s*unit_farm_space)
})),$("#attack_info_att_units > tbody > tr:nth-child(2) > td.unit-item").each((function(e,i){var s=parseInt(i.textContent)
e<a.data.village.attacker.troops.totals.length&&(a.data.village.attacker.troops.totals[e]=s)
var unit_farm_space=e in a.data.world.farmByTroops?a.data.world.farmByTroops[e]:0
2==e||4==e||6==e?a.data.village.attacker.troops.offensives+=s*unit_farm_space:0==e&&1==e&&5==e&&7==e||(a.data.village.attacker.troops.defensives+=s*unit_farm_space)
}))),$("#attack_spy_buildings_left > tbody > tr:nth-child(1) > th:nth-child(1)").length&&(this.data.village.defender.buildings.buildingsVisible=true,
a.data.village.defender.buildings.wall=[true,0],$("table[id^='attack_spy_buildings_'] > tbody > tr:gt(0) > td > img").each((function(e,i){
var s=i.src.split("/")[7].replace(".png",""),t=parseInt(i.parentNode.parentNode.childNodes[3].textContent)
"watchtower"==s?a.data.village.defender.buildings.tower=[true,t]:"church_f"==s?a.data.village.defender.buildings.mainChurch=[true,t]:"church"==s?a.data.village.defender.buildings.church=[true,t]:"wall"==s&&(a.data.village.defender.buildings.wall=[true,t])
}))),!a.data.village.defender.buildings.wall[0]){var wall_level=999
$("table[id='attack_results'] > tbody > tr").each((function(e,i){var cell=$(this).children("td")[0]
if(cell.textContent.includes(_t("wall"))){parseInt($(cell).children("b")[0].textContent)
var level_after=parseInt($(cell).children("b")[1].textContent)
level_after<wall_level&&(wall_level=level_after)}})),wall_level<999&&(a.data.village.defender.buildings.wall=[true,wall_level])}},getVillageType:function(){
this.data.village.defender.troops.visible?(this.data.village.defender.troops.inside.offensives>3000?this.data.village.defender.typeVillage=_t("offensive"):this.data.village.defender.troops.inside.offensives>500?this.data.village.defender.typeVillage=_t("probOffensive"):this.data.village.defender.troops.inside.defensives>1000?this.data.village.defender.typeVillage=_t("defensive"):this.data.village.defender.troops.inside.defensives>500?this.data.village.defender.typeVillage=_t("probDefensive"):this.data.village.defender.troops.inside.offensives>=50&&this.data.village.defender.troops.inside.defensives<50?this.data.village.defender.typeVillage=_t("probOffensive"):this.data.village.defender.troops.inside.defensives>=50&&this.data.village.defender.troops.inside.offensives<50&&(this.data.village.defender.typeVillage=_t("probDefensive")),
this.data.village.defender.troops.supports=Math.round(this.data.village.defender.troops.inside.defensives/20000*10)/10):this.data.village.defender.troops.visible||(this.data.village.defender.typeVillage=_t("noSurvivors")),
this.data.village.defender.troops.outside.visible&&(this.data.village.defender.troops.outside.offensives>3000?this.data.village.defender.typeVillage=_t("offensive"):this.data.village.defender.troops.outside.offensives>500?this.data.village.defender.typeVillage=_t("probOffensive"):this.data.village.defender.troops.outside.defensives>1000?this.data.village.defender.typeVillage=_t("defensive"):this.data.village.defender.troops.outside.defensives>500?this.data.village.defender.typeVillage=_t("probDefensive"):this.data.village.defender.troops.outside.defensives+this.data.village.defender.troops.outside.offensives>1000&&(this.data.village.defender.troops.outside.offensives>this.data.village.defender.troops.outside.defensives?this.data.village.defender.typeVillage=_t("probOffensive"):this.data.village.defender.troops.outside.defensives>=this.data.village.defender.troops.outside.offensives&&(this.data.village.defender.typeVillage=_t("probDefensive"))),
this.data.village.defender.troops.supports+=Math.round(this.data.village.defender.troops.outside.defensives/20000*10)/10),
this.data.village.attacker.troops.offensives>this.data.village.attacker.troops.defensives?this.data.village.attacker.typeVillage=_t("offensive"):this.data.village.attacker.troops.offensives<this.data.village.attacker.troops.defensives&&(this.data.village.attacker.typeVillage=_t("defensive"))
},generateNoteText:function(){
var village_type,report_export_code=$("#report_export_code").text(),battle_time=$("#content_value > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2)").text().replace(/\s+/g," ").replace(/.{5}$/g,""),s=""
this.data.player.playerIsAttacking||this.data.player.playerWantInfoDefender?s+=this.data.village.defender.username?"[player]"+this.data.village.defender.username+"[/player]":"[i]Barbarian[/i]":(this.data.player.playerIsDefending||this.data.player.playerWantInfoAttacker)&&(s+=this.data.village.attacker.username?"[player]"+this.data.village.attacker.username+"[/player]":"[i]Barbarian[/i]"),
this.data.player.playerIsAttacking||this.data.player.playerWantInfoDefender?village_type=this.data.village.defender.typeVillage:(this.data.player.playerIsDefending||this.data.player.playerWantInfoAttacker)&&(village_type=this.data.village.attacker.typeVillage)
var village_type_colour="888888"
return village_type==_t("offensive")||village_type==_t("probOffensive")?village_type_colour="ff0000":village_type!=_t("defensive")&&village_type!=_t("probDefensive")||(village_type_colour="0eae0e"),
s+=" | [color=#"+village_type_colour+"][b]"+village_type+"[/b][/color] | ",
(this.data.player.playerIsAttacking||this.data.player.playerWantInfoDefender)&&(this.data.village.defender.buildings.tower[0]&&(s+="[building]watchtower[/building] "+_t("watchtower")+": "+this.data.village.defender.buildings.tower[1]+" | "),
this.data.village.defender.buildings.wall[0]&&(s+="[building]wall[/building][color=#5c3600][b] "+_t("wall")+": "+this.data.village.defender.buildings.wall[1]+"[/b][/color] | "),
this.data.village.defender.buildings.mainChurch[0]&&(s+="[building]church_f[/building] "+_t("firstChurch")+" | "),
this.data.village.defender.buildings.church[0]&&(s+="[building]church_f[/building] "+_t("church")+": "+this.data.village.defender.buildings.church[1]+" | "),
this.data.village.defender.troops.visible&&village_type!=_t("offensive")&&village_type!=_t("probOffensive")&&(s+=this.data.village.defender.troops.supports+" "+_t("defensiveNukes")+" | ")),
s+="[b][size=6]***[/size][/b]",s+="\n\n[b]"+battle_time+"[/b]",s+=""+report_export_code},writeNote:function(){var a,e,s,i=this
if(s=this.data.player.playerIsAttacking||this.data.player.playerWantInfoDefender?parseInt(this.data.village.defender.idVillage):parseInt(this.data.village.attacker.idVillage),
e="0"==game_data.player.sitter?"https://"+location.hostname+"/game.php?village="+game_data.village.id+"&screen=api&ajaxaction=village_note_edit&h="+game_data.csrf+"&client_time="+Math.round(Timing.getCurrentServerTime()/1000):"https://"+location.hostname+"/game.php?village="+game_data.village.id+"&screen=api&ajaxaction=village_note_edit&t="+game_data.player.id,
this.data.player.playerIsAttacking||this.data.player.playerIsDefending){a=i.generateNoteText(),$.post(e,{note:a,village_id:s,h:game_data.csrf},(function(a){
UI.SuccessMessage(_t("noteCreated"),2000)}))}else{
var t=$('<div class="center"> '+_t("addReportTo")+" </div>"),d=$('<div class="center"><button class="btn btn-confirm-yes atk">'+_t("atacante")+'</button><button class="btn btn-confirm-yes def">'+_t("defensor")+"</button></div>"),o=t.add(d)
Dialog.show("report_notes",o),d.find("button.atk").click((function(){i.data.player.playerWantInfoAttacker=true,a=i.generateNoteText(),$.post(e,{note:a,
village_id:i.data.village.attacker.idVillage,h:game_data.csrf},(function(a){UI.SuccessMessage(_t("noteCreated"),2000)})),Dialog.close()})),
d.find("button.def").click((function(){i.data.player.playerWantInfoDefender=true,a=i.generateNoteText(),$.post(e,{note:a,
village_id:i.data.village.defender.idVillage,h:game_data.csrf},(function(a){UI.SuccessMessage(_t("noteCreated"),2000)})),Dialog.close()}))}},start:function(){
this.checkPage()&&(this.initScriptData(),this.getVillageType(),this.writeNote())}},initTranslations()?CreateReportNotes.start():setTimeout((()=>{
CreateReportNotes.start()}),3000)

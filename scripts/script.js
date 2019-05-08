/*---------------- BYTTE TABS --------------- */

function changeTab(event, tabName) {
	var i, x, tablinks;
	x = document.getElementsByClassName("tab");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablink");
	for (i = 0; i < x.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active-button", "");
	}
	document.getElementById(tabName).style.display = "block";
	event.currentTarget.className += " active-button";
}

/*---------------- KONSTRUKTØR --------------- */

function Grensesnitt(url, onload) {
	if (this instanceof Grensesnitt) {
		if (url) {
			if (typeof url === "string") {
				this.url = url;

				this.load = function () {
					var request = new XMLHttpRequest();
					request.open("GET", this.url, false);
					request.send(null);
					if (request.status === 200 && request.readyState === 4) {
						this.data = JSON.parse(request.responseText);
						if (onload) {
							onload();
						}
					} else {
						throw "Forespørselen funket ikke";
					}
				}

				this.getNames = function () {
					if (this.data) {
						var places = this.data.elementer;
						var names = [];
						for (var place in places) {
							if (places.hasOwnProperty(place)) {
								names.push(place);
							}
						}
						return names;
					} else {
						throw "Ingen data, prøv load(); først";
					}
				}

				this.getIDs = function () {
					if (this.data) {
						var places = this.data.elementer;
						var ids = [];
						for (var place in places) {
							if (places.hasOwnProperty(place)) {
								ids.push(places[place].kommunenummer);
							}
						}
						return ids;
					} else {
						throw "Ingen data, prøv load(); først";
					}
				}

				this.getInfo = function (index) {
					if (this.data) {
						index = ("0000" + index.toString()).slice(-4);
						var places = this.data.elementer;
						for (var place in places) {
							if (places.hasOwnProperty(place)) {
								if (places[place].kommunenummer == index) {
									return { "name": place, "id": index, "data": places[place] };
								}
							}
						}
						return null;
					} else {
						throw "Ingen data, prøv load(); først";
					}
				}

				this.beggeKjonn = function () {
					var places = this.data.elementer;
					var beggeKjønn = [];
					for (var place in places) {
						if (places.hasOwnProperty(place)) {
							beggeKjønn.push(places[place].Menn["2018"] + places[place].Kvinner["2018"]);
						}
					}
					return beggeKjønn;
				}
			} else {
				throw "URL er ikke en string";
			}
		} else {
			throw "URL er ikke spesifisert";
		}
	} else {
		throw "Grensesnitt er en konstruktør";
	}
}

/*---------------- LOADING-FUNCTION --------------- */

var befolkning_g;
var sysselsetting_g;
var utdanning_g;

// var sysselsettingData = [];

window.onload = function () {
	befolkning_g = new Grensesnitt("http://wildboy.uib.no/~tpe056/folk/104857.json", function () { sysselsetting_g.load() });
	sysselsetting_g = new Grensesnitt("http://wildboy.uib.no/~tpe056/folk/100145.json", function () { utdanning_g.load() });
	utdanning_g = new Grensesnitt("http://wildboy.uib.no/~tpe056/folk/85432.json", function () { });

	befolkning_g.load();
	sysselsetting_g.load();
	utdanning_g.load();

	var names = befolkning_g.getNames();
	var ids = befolkning_g.getIDs();
	var beggeKjonn = befolkning_g.beggeKjonn();

	var tab = document.getElementById("table");

	for (var i = 0; i < names.length; ++i) {

		var row = tab.insertRow(-1);

		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);

		cell0.innerText = names[i];
		cell1.innerText = ids[i];
		cell2.innerText = beggeKjonn[i];
	}
}

/*---------------- SEARCH-FUNCTION --------------- */

function search(kommuneId, tableId, compareId) {
	if (!kommuneId || !tableId) {
		return;
	}

	var befolkningsdata = befolkning_g.getInfo(kommuneId);
	var sysselsettingsdata = sysselsetting_g.getInfo(kommuneId);
	var sysselsettingsdataForCompare;
	var utdanningsdata = utdanning_g.getInfo(kommuneId);

	if (compareId) {
		sysselsettingsdataForCompare = sysselsetting_g.getInfo(compareId);
	}

	if (!befolkningsdata) {
		document.getElementById("searchMessage").innerText = "Data på kommunenummer " + kommuneId + " finnes ikke.";
		document.getElementById(tableId).style.display = "none";
		return;
	}

	document.getElementById("searchMessage").innerText = "";
	var table = document.getElementById(tableId);

	var newTbody = document.createElement("tbody");
	table.tBodies[0].parentNode.replaceChild(newTbody, table.tBodies[0]);


	var menn = befolkningsdata.data.Menn;
	var kvinner = befolkningsdata.data.Kvinner;

	var mennSysselsetting = sysselsettingsdata.data.Menn;
	var kvinnerSysselsetting = sysselsettingsdata.data.Kvinner;

	var mennUtdanningKort = utdanningsdata.data["03a"].Menn;
	var kvinnerUtdanningKort = utdanningsdata.data["03a"].Kvinner;
	var mennUtdanningLang = utdanningsdata.data["04a"].Menn;
	var kvinnerUtdanningLang = utdanningsdata.data["04a"].Kvinner;

	for (var year in menn) {
		var lastYear = year - 1;

		if (menn.hasOwnProperty(year)) {

			var row = table.tBodies[0].insertRow(0);

			/*---------------- KOMMUNENAVN --------------- */

			var nameCell = row.insertCell(0);
			nameCell.innerText = befolkningsdata.name;

			/*---------------- KOMMUNENUMMER --------------- */

			var idCell = row.insertCell(1);
			idCell.innerText = befolkningsdata.id;

			/*---------------- ÅRSTALL --------------- */

			var yearCell = row.insertCell(-1);
			yearCell.innerText = year;

			/*---------------- MENN OG KVINNER --------------- */

			if (!compareId) {
				var mennCell = row.insertCell(-1);
				mennCell.innerText = menn[year];
				var kvinCell = row.insertCell(-1);
				kvinCell.innerText = kvinner[year];
			}

			/*---------------- SYSSELSETTING --------------- */

			var syssMennCell = row.insertCell(-1);
			syssMennCell.innerText = mennSysselsetting[year] + "%";
			var syssKvinnerCell = row.insertCell(-1);
			syssKvinnerCell.innerText = kvinnerSysselsetting[year] + "%";

			/*---------------- UTDANNING --------------- */

			if (!compareId) {
				var utdMennKortCell = row.insertCell(-1);
				utdMennKortCell.innerText = formatCellData(mennUtdanningKort[year]) + "%";
				var utdKvinnerKortCell = row.insertCell(-1);
				utdKvinnerKortCell.innerText = formatCellData(kvinnerUtdanningKort[year]) + "%";
				var utdMennLangCell = row.insertCell(-1);
				utdMennLangCell.innerText = formatCellData(mennUtdanningLang[year]) + "%";
				var utdKvinnerLangCell = row.insertCell(-1);
				utdKvinnerLangCell.innerText = formatCellData(kvinnerUtdanningLang[year]) + "%";
			}
			if (compareId) {
				/*---------------- VEKST --------------- */

				var mennVekstKommune1 = calculateGrowth(mennSysselsetting[year], mennSysselsetting[lastYear]).toFixed(2);
				var kvinnerVekstKommune1 = calculateGrowth(kvinnerSysselsetting[year], kvinnerSysselsetting[lastYear]).toFixed(2);

				var mennSysselsettingKommune2 = sysselsettingsdataForCompare.data.Menn;
				var kvinnerSysselsettingKommune2 = sysselsettingsdataForCompare.data.Kvinner;

				var mennVekstKommune2 = calculateGrowth(mennSysselsettingKommune2[year], mennSysselsettingKommune2[lastYear]).toFixed(2);
				var kvinnerVekstKommune2 = calculateGrowth(kvinnerSysselsettingKommune2[year], kvinnerSysselsettingKommune2[lastYear]).toFixed(2);

				var vekstMennCell = row.insertCell(-1);
				vekstMennCell.innerText = mennVekstKommune1 + "%";

				if (mennVekstKommune1 >= mennVekstKommune2) {
					vekstMennCell.classList.add('highest-growth');
				}

				var vekstKvinnerCell = row.insertCell(-1);
				vekstKvinnerCell.innerText = kvinnerVekstKommune1 + "%";

				if (kvinnerVekstKommune1 >= kvinnerVekstKommune2) {
					vekstKvinnerCell.classList.add('highest-growth');
				}
			}

		}

		table.style.display = "table";


	}
}
/*---------------- COMPARE-FUNCTION --------------- */

function compare(searchInputId1, tableId1, searchInputId2, tableId2) {
	var kommuneId1 = document.getElementById(searchInputId1).value;
	var kommuneId2 = document.getElementById(searchInputId2).value;

	search(kommuneId1, tableId1, kommuneId2);
	search(kommuneId2, tableId2, kommuneId1);
}

/*---------------- CALCULATE GROWTH-FUNCTION --------------- */

function calculateGrowth(thisYear, lastYear) {
	return (1 - (lastYear / thisYear)) * 100;
}


/*---------------- FORMAT (FIXES IF THERE IS UNDEFINED IN TABLE) --------------- */

function formatCellData(cellData) {
	if (cellData) {
		return cellData;
	} else {
		return "-";
	}
}
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

function Grensesnitt(url) {
	if (this instanceof Grensesnitt) {
		if (url) {
			if (typeof url == "string") {
				this.url = url;
				
				this.load = function(){
					var request = new XMLHttpRequest();
					request.open("GET", this.url, false);
					request.send(null);
					if (request.status == 200 && request.readyState == 4) {
						this.data = JSON.parse(request.responseText);
					} else {
						throw "Forespørselen funket ikke";
					}
				}

				this.getNames = function() {
					if(this.data){
						var places = this.data.elementer;
						var names = [];
						for (var place in places) {
							if (places.hasOwnProperty(place)) {
								names.push(place);
							}
						}
						return names;
					}else{
						throw "Ingen data, prøv load(); først";
					}
				}

				this.getIDs = function() {
					if(this.data){
						var places = this.data.elementer;
						var ids = [];
						for (var place in places) {
							if (places.hasOwnProperty(place)) {
								ids.push(places[place].kommunenummer);
							}
						}
						return ids;
					}else{
						throw "Ingen data, prøv load(); først";
					}
				}

				this.getInfo = function(index) {
					if(this.data){
						index = ("0000" + index.toString()).slice(-4);
						var places = this.data.elementer;
						for (var place in places) {
							if (places.hasOwnProperty(place)) {
								if (places[place].kommunenummer == index) {
									return {"name": place, "id": index, "data": places[place]};
								}
							}
						}
						return null;
					}else{
						throw "Ingen data, prøv load(); først";
					}
				}

				this.beggeKjønn = function() {
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

window.onload = function() {
	befolkning_g = new Grensesnitt("http://wildboy.uib.no/~tpe056/folk/104857.json");
	sysselsetting_g = new Grensesnitt("http://wildboy.uib.no/~tpe056/folk/100145.json");
  utdanning_g = new Grensesnitt("http://wildboy.uib.no/~tpe056/folk/85432.json");
  
	befolkning_g.load();
	sysselsetting_g.load();
	utdanning_g.load();

	var names = befolkning_g.getNames();
	var ids = befolkning_g.getIDs();
	var beggeKjønn = befolkning_g.beggeKjønn();

  var tab = document.getElementById("table");

	for (var i = 0; i < names.length; ++i) {

		var row = tab.insertRow(-1);

		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);

		cell0.innerText = names[i];
		cell1.innerText = ids[i];
		cell2.innerText = beggeKjønn[i];
	}
}

/*---------------- SEARCH-FUNCTION --------------- */

function search() {
	var id = document.getElementById("searchInput").value;
	if (!id) {
		return;
	}
  var data = befolkning_g.getInfo(id);
	// var result1 = sysselsetting_g.getInfo(id);
	// var result2 = utdanning_g.getInfo(id);

	if(data){
		document.getElementById("searchMessage").innerText = "";
		var table = document.getElementById("searchTable");
		
		var newTbody = document.createElement("tbody");
		table.tBodies[0].parentNode.replaceChild(newTbody, table.tBodies[0]);

		
		var menn = data.data["Menn"];
		var kvinner = data.data["Kvinner"];

		for(var year in menn){
			if(menn.hasOwnProperty(year)){
				
				var row = table.tBodies[0].insertRow(0);
				var nameCell = row.insertCell(0);
				nameCell.innerText = data.name;
				var idCell = row.insertCell(1);
				idCell.innerText = data.id;

				var yearCell = row.insertCell(-1);
				yearCell.innerText = year;
				var mennCell = row.insertCell(-1);
				mennCell.innerText = menn[year];
				var kvinCell = row.insertCell(-1);
				kvinCell.innerText = kvinner[year];
			}
		}

    table.style.display = "table";
    
	}else{
		document.getElementById("searchMessage").innerText = "Data på kommunenummer " + id + " finnes ikke.";
		document.getElementById("searchTable").style.display = "none";
	}

}
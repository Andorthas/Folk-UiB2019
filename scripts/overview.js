var befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json"

function visData(data) {
  var oversikt = document.getElementById("Overview");
  oversikt.innerHTML = "";

  var list = document.createElement("ol");

  for (item in data.elementer) {
    var lisElt = document.createElement("li");

    var tekst = item + "   Kommunenummer: " + data.elementer[item].kommunenummer + "     Antall Kvinner: " +  data.elementer[item].Kvinner["2018"] + "    Antall Menn: " + data.elementer[item].Menn["2018"];
    lisElt.innerHTML = tekst;

    list.appendChild(lisElt);
  }

  oversikt.appendChild(list);
}

function getData() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", befolkning);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText)
      console.log(response)
      visData(response);

    }
  }
  xhr.send();

}

window.onload = getData;
var befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json"

function visData(data) {
  var oversikt = document.getElementById("Overview");
  oversikt.innerHTML = '<span class="overview-title">Oversikt</span>';

  var list = document.createElement("ul");
  list.classList.add('whole-list');

  for (item in data.elementer) {
    var lisElt = document.createElement("li");
    lisElt.classList.add('kommune-section');

    var tekst = '<span class="kommune-title">Kommune: </span>' + item + '<span class="kommune-spacing"> Kommunenummer: </span>' + data.elementer[item].kommunenummer + '<span class="kommune-spacing"> Antall Kvinner: </span>' +  data.elementer[item].Kvinner["2018"] + '<span class="kommune-spacing"> Antall Menn: </span>' + data.elementer[item].Menn["2018"];
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

var befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json"
var sysselsatt = "http://wildboy.uib.no/~tpe056/folk/100145.json"
var utdanning = "http://wildboy.uib.no/~tpe056/folk/85432.json"


function visData(data) {
  var oversikt = document.getElementById("Overview");
  oversikt.innerHTML = "";

  var list = document.createElement("ol");

  for (item in data.elementer) {
    var info = item;//data.elementer[item].kommunenummer
    var info2 = data.elementer[item].kommunenummer;
    var info3 = data.elementer[item];
    var info4 = antallMenn;
    var lisElt = document.createElement("li");


    var tekst = item + "   Kommunenummer: " + data.elementer[item].kommunenummer + "     Antall Kvinner: " +  data.elementer[item].Kvinner["2018"] + "    Antall Menn: " + data.elementer[item].Menn["2018"];
    lisElt.innerHTML = tekst;

    list.appendChild(lisElt);


    for (c in info3) {
      var måling = info3[c];

      for (kvinne in måling) {
        var verdi = måling[kvinne];
      }
    }

    for (menn in info3.Menn) {
      var antallMenn = info3.Menn[menn];
    }



  }
  oversikt.appendChild(list);
}



function visDetails(text) {

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

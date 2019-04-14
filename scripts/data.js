
var befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json"
var sysselsatt = "http://wildboy.uib.no/~tpe056/folk/100145.json"
var utdanning = "http://wildboy.uib.no/~tpe056/folk/85432.json"


function visData(data) {
  var oversikt = document.getElementById("Overview");
  oversikt.innerHTML = "";

  var list = document.createElement("ol");
  var list2 = document.createElement("ol");
  var list3 = document.createElement("ol");
  var list4 = document.createElement("ol");
  for (item in data.elementer) {
    var info = item;//data.elementer[item].kommunenummer
    var info2 = data.elementer[item].kommunenummer;
    var info3 = data.elementer[item];
    var info4 = antallMenn;
    var lisElt = document.createElement("li");
    var lisElt2 = document.createElement("li");
    var lisElt3 = document.createElement("li");
    var lisElt4 = document.createElement("li");
    lisElt.innerHTML = info;
    lisElt2.innerHTML = info2;
    lisElt3.innerHTML = verdi;
    lisElt4.innerHTML = info4;
    list.appendChild(lisElt);
    list2.appendChild(lisElt2);
    list3.appendChild(lisElt3);
    list4.appendChild(lisElt4);
    //console.log(verdi);
    //console.log(info3.Menn);
    //console.log(antallMenn);


    for (c in info3) {
      var måling = info3[c];
      //console.log(måling);
      for (kvinne in måling) {
        var verdi = måling[kvinne];
      }
    }

    for (menn in info3.Menn) {
      var antallMenn = info3.Menn[menn];
    }








    //res.value = res.value + data[item].eierskap;
    //console.log(item);
    //console.log(data.elementer[item].kommunenummer);



  }
  oversikt.appendChild(list);
  oversikt.appendChild(list2);
  oversikt.appendChild(list3);
  oversikt.appendChild(list4);
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

var befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json"
var sysselsatt = "http://wildboy.uib.no/~tpe056/folk/100145.json"
var utdanning = "http://wildboy.uib.no/~tpe056/folk/85432.json"


function visData(data) {
  var oversikt = document.getElementById("Overview");
  oversikt.innerHTML = "";

  var list = document.createElement("ol");
  var list2 = document.createElement("ol");
  for (item in data.elementer) {
    var info = item;//data.elementer[item].kommunenummer
    var lisElt = document.createElement("li");
    var lisElt2 = document.createElement("li");
    lisElt.innerHTML = info;
    lisElt2.innerHTML = data.elementer[item].kommunenummer;
    list.appendChild(lisElt);
    list2.appendChild(lisElt2);




    //res.value = res.value + data[item].eierskap;
    //console.log(item);
    console.log(data.elementer[item].kommunenummer);



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

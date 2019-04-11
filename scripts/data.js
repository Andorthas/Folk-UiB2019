
var befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json"
var sysselsatt = "http://wildboy.uib.no/~tpe056/folk/100145.json"
var utdanning = "http://wildboy.uib.no/~tpe056/folk/85432.json"


function visData(data) {
  var res = document.getElementById("befolkning");
  for (item in data) {
    for (elem in item) {
      res.value = res.value + data[item];
    }



  }
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

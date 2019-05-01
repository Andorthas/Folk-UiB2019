/*---------------- CHANGE TABS --------------- */

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

/*---------------- CONSTRUCTOR --------------- */

function Grensesnitt(url){
if(this instanceof Grensesnitt){
  if(url){
    if(typeof url == "string"){
      this.url = url;
      var request = new XMLHttpRequest();
      request.open("GET", this.url, false);
      request.send(null);
      if (request.status == 200) {
        this.data = JSON.parse(request.responseText);
      }else{
        throw "The request failed successfully!";
      }

      this.getNames = function(){
        var places = this.data.elementer;
        var names = [];
        for(var place in places){
          if(places.hasOwnProperty(place)){
            names.push(place);
          }
        }
        return names;
      }

      this.getIDs = function(){
        var places = this.data.elementer;
        var ids = [];
        for(var place in places){
          if(places.hasOwnProperty(place)){
            ids.push(places[place].kommunenummer);
          }
        }
        return ids;
      }

      this.getInfo = function(index){
        index = ("0000" + index.toString()).slice(-4);
        var places = this.data.elementer;
        for(var place in places){
          if(places.hasOwnProperty(place)){
            if(places[place].kommunenummer == index){
              return places[place];
            }
          }
        }
        return null;
      }
      
      this.beggeKjønn = function() {
        var places = this.data.elementer;
        var beggeKjønn = [];
        for(var place in places) {
          if(places.hasOwnProperty(place)) {
            beggeKjønn.push(places[place].Menn["2018"] + places[place].Kvinner["2018"]);
          }
        }
        return beggeKjønn;
      }
    }else{
      throw "URL specified is not string";
    }
  }else{
    throw "URL is not specified";
  }
}else{
  throw "Grensesnitt is a constructor";
}
}

/*---------------- LOADING-FUNCTION --------------- */

var befolkning_g;
var sysselsetting_g;
var utdanning_g;

window.onload = function(){
befolkning_g = new Grensesnitt("http://wildboy.uib.no/~tpe056/folk/104857.json");
sysselsetting_g = new Grensesnitt("http://wildboy.uib.no/~tpe056/folk/100145.json");
utdanning_g = new Grensesnitt("http://wildboy.uib.no/~tpe056/folk/85432.json");

var names = befolkning_g.getNames();
var ids = befolkning_g.getIDs();
var beggeKjønn = befolkning_g.beggeKjønn();

var tab = document.getElementById("table");

for(var i = 0; i < names.length; ++i){
  
  var row = tab.insertRow(-1);
  
  var cell0 = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  
  cell0.innerText = names[i];
  cell1.innerText = ids[i];
  cell2.innerText = beggeKjønn[i];
}
}
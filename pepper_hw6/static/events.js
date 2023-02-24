var categoryDict= {"Music":"KZFzniwnSyZfZ7v7nJ", "Sports":"KZFzniwnSyZfZ7v7nE", "Arts": "KZFzniwnSyZfZ7v7na",
 "Theatre": "KZFzniwnSyZfZ7v7na", "Film":"KZFzniwnSyZfZ7v7nn","Miscellaneous":"KZFzniwnSyZfZ7v7n1","Default":""};

var ticketStatusDict = {"onsale":"green", "offsale":"red", "cancelled":"black", "postponed":"orange", "rescheduled":"orange"};
var eventDict={};
var checkbox = document.getElementById("auto-detect");
checkbox.addEventListener('change', function() {
    var location = document.getElementById('location');
    if( this.checked){
        location.style.display = 'none'  ;
        location.disabled = true;
    }
    else{
        location.style.display = 'block'  ;
        location.disabled = false;
    }
});
function myFunction() {
  checkbox.checked=false;
}
var clrBtn = document.getElementById("clear");
clrBtn.addEventListener('click', function() {
    checkbox.checked=false;

    var location = document.getElementById('location');
    location.style.display = 'block'  ;
    location.disabled = false;
    location.value = null;

    var distance = document.getElementById('distance');
    distance.value = null;

    var keyword = document.getElementById('keyword');
    keyword.value = null;

    var category = document.getElementById('category');
    category.value = "Default";

    var eventInfo = document.getElementById('eventsInfo')
    eventInfo.innerHTML = "";

    var eventsTable = document.getElementById("eventsTable");
    eventsTable.innerHTML = "";

    var venueInfo = document.getElementById("venueInfo");
    venueInfo.innerHTML = "";

});


function searchFunc() {
    var form = document.getElementById('form');
    var isValid=form.checkValidity();
    if(!isValid){
        form.reportValidity();
    }
    else {
        let xhr = new XMLHttpRequest();
        const geoCodeKey = 'AIzaSyCQtKQ4f9s_mMuNVY44fDCAfValQPITZiw';
        var geoCodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        var location = document.getElementById('location');
        var distance = document.getElementById('distance');
        var keyword = document.getElementById('keyword');
        var category = document.getElementById('category');
        var checkbox = document.getElementById("auto-detect");
        var lat='',lng='';
        var geo='';
        var flaskUrl;
        var callEventsApi = true;
        if(checkbox.checked){
            let xhr2 = new XMLHttpRequest();
            var infoAPiUrl = 'https://ipinfo.io/?token=5b4b724fbcbf9e';
            xhr2.open('GET', infoAPiUrl, false);
            xhr2.onload = function() {
                if (xhr2.status != 200) {
                            console.log("Error in loading "+xhr2.statusText);
                } else {
                            let responseObj= xhr2.response;
                            var obj = JSON.parse(responseObj);
                            //console.log('Done '+responseObj);
                            var loc = obj.loc.split(',');
                            lat = loc[0];
                            lng = loc[1];
                            geo = window.geohash.encode(lat, lng, 6);
                            //console.log("geocode: "+geo);
                            //console.log(lat+" "+lng);
                        }
                };
                xhr2.send();
        }
        else {
            geoCodeUrl=geoCodeUrl+location.value+"&key="+geoCodeKey;
            console.log(geoCodeUrl);
            xhr.open('GET', geoCodeUrl, false);
            xhr.onload = function() {
                if (xhr.status != 200) {
                    console.log("Error in loading "+xhr.statusText);
                } else {
                    let responseObj= xhr.response;
                    var obj = JSON.parse(responseObj);
                    //console.log('Done '+responseObj);
                    if(obj.results.length>0){
                        lat=obj.results[0].geometry.location.lat;
                        lng=obj.results[0].geometry.location.lng
                        geo = window.geohash.encode(lat, lng, 6);
                        //console.log("geocode: "+geo);
                    }
                    else {
                        displayEventsTable(null);
                        callEventsApi=false;
                    }
                    //console.log(lat+" "+lng);

                }
            };
        xhr.send();
        }
        var dist = distance.value;
        if(distance.value==null||distance.value==undefined||distance.value=="")
            dist=10;
        var flaskUrl = "/submit?keyword="+keyword.value+"&segmentId="+categoryDict[category.value]+"&radius="+dist+"&geoPoint="+geo;
        console.log("flaskUrl "+flaskUrl);
        let xhr1 = new XMLHttpRequest();
        xhr1.open('GET', flaskUrl, false);
                    xhr1.onload = function() {
                        if (xhr1.status != 200) {
                            console.log("Yo1 "+xhr1.status);
                        } else {
                            var obj = JSON.parse(xhr1.response);
                            //console.log(xhr1.response);
                            //console.log(obj._embedded.events[0].name);
                            if(obj.page.totalPages==0)
                                displayEventsTable(null);
                            else
                                displayEventsTable(obj._embedded.events);
                        }
                    };
        if(callEventsApi)
            xhr1.send();
        }

}

function displayEventsTable(events){
    var eventsTable = document.getElementById("eventsTable");
    var eventsInfo = document.getElementById("eventsInfo");
    eventsInfo.innerHTML = "";
    var venueInfo = document.getElementById("venueInfo");
    venueInfo.innerHTML = "";
    if(events==null || events.length==0 || events == undefined){
        eventsTable.innerHTML = '<div style="width:1200px; margin:auto; color:#d20909; text-align:center; background:white; padding:10px; font-family:Arial, san-serif;">No Records found</div>';
    }
    else {
        var s = '<table id="searchTable" style="background:white; width:1200px; margin:auto; text-align:center"><tr style="box-shadow: 0 2px 2px 2px #a4a0a07d;"><th style="width:200px; padding:5px;">Date</th><th style="width:200px; padding:5px;">Icon</th><th style="width:500px; padding:5px; cursor:pointer;" onclick="sortTable(2);">Event</th><th style="width:100px; padding:5px; cursor:pointer;" onclick="sortTable(3)">Genre</th><th style="width:250px; padding:5px; cursor:pointer;" onclick="sortTable(4)">Venue</th></tr>';
        for(event of events){
            var icon='';
            var genre='';
            var venue='';
            var eventName='';
            var date='';
            var time='';
            if(!(event.dates.start.localDate==undefined))
                date = event.dates.start.localDate;
            if(!(event.dates.start.localTime==undefined))
                time = event.dates.start.localTime;
            if(!(event.images==undefined) && event.images.length>0)
                icon = event.images[0].url;
            var eventName = event.name;
            eventDict[eventName]=event.id;
            if(!(event.classifications==undefined) && event.classifications.length>0)
                genre = event.classifications[0].segment.name;
            if(!(event._embedded==undefined) && !(event._embedded.venues==undefined) && event._embedded.venues.length>0){
                venue = event._embedded.venues[0].name;
            }
            s=s+'<tr><td><p>'+date+'<br>'+time+'</p><td>';
            s=s+'<img src='+icon+' style="width:80px; height:50px; padding:4px"></img></td>';
            s=s+'<td><a href="javascript:void(0);" style="text-decoration: none;" onclick="displayEventInfo(this)" eventId="'+event.id+'">'+eventName+'</a></td>';
            s=s+'<td>'+genre+'</td>';
            s=s+'<td>'+venue+'</td></tr>';
        }
        s=s+'</table>';
        eventsTable.innerHTML = s;

    }
}

function displayEventInfo(event) {
    document.getElementById('eventsInfo').scrollIntoView(true);
    var eventInfo = event.getAttribute('eventId');
    var eventInfoUrl = "/eventInfo?eventId="+eventInfo;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', eventInfoUrl, false);
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log("Yo1 "+xhr.status);
        } else {
            //console.log(xhr.response);
            var obj = JSON.parse(xhr.response);
            var localDate;
            var localTime;
            var date='';
            var artist='';
            var venue='';
            var finalGenre='',subGenre,genre,segment,subType,type;
            var priceRanges='',min,max;
            var ticketStatus='';
            var buyUrl='';
            var seatMap='';
            if(obj.dates.start.localDate!=undefined)
                localDate = obj.dates.start.localDate;
            if(obj.dates.start.localTime!=undefined)
                localTime = obj.dates.start.localTime;
            date = localDate+' '+localTime;
            if(obj._embedded.attractions!=undefined)
            for(attraction of obj._embedded.attractions){
                if(attraction.name!=undefined && attraction.name!=null) {
                    if(attraction.url!=undefined && attraction.url!=null){
                        if(artist=='')
                           artist = '<a target="_blank" rel="noopener noreferrer" href="'+attraction.url+'">'+attraction.name+'</a>';
                        else
                           artist = artist+' | '+'<a target="_blank" rel="noopener noreferrer"  href="'+attraction.url+'">'+attraction.name+'</a>';
                    }
                    else {
                        if(artist=='')
                            artist = attraction.name;
                        else
                            artist = artist+' | '+attraction.name;
                    }
                }
            }
            if(obj._embedded.venues!=undefined && obj._embedded.venues.length>0)
                venue = obj._embedded.venues[0].name;
            if(obj.classifications!=undefined && obj.classifications.length>0){
                if(obj.classifications[0].segment!=undefined && obj.classifications[0].segment.name.toLowerCase()!='undefined'){
                    segment=obj.classifications[0].segment.name;
                    if(finalGenre=='')
                        finalGenre = segment;
                    else
                        finalGenre = finalGenre+' | '+segment;
                }

                if(obj.classifications[0].genre!=undefined && obj.classifications[0].genre.name.toLowerCase()!='undefined'){
                    genre=obj.classifications[0].genre.name;
                    if(finalGenre=='')
                        finalGenre= genre;
                    else
                        finalGenre=finalGenre+' | '+genre;
                }
                if(obj.classifications[0].subGenre!=undefined && obj.classifications[0].subGenre.name.toLowerCase()!='undefined') {
                    subGenre=obj.classifications[0].subGenre.name;
                    if(finalGenre=='')
                        finalGenre= subGenre;
                    else
                        finalGenre=finalGenre+' | '+subGenre;
                }

                if(obj.classifications[0].type!=undefined && obj.classifications[0].type.name.toLowerCase()!='undefined'){
                    type=obj.classifications[0].type.name;
                    if(finalGenre=='')
                        finalGenre = type;
                    else
                        finalGenre=finalGenre+' | '+type;
                }

                if(obj.classifications[0].subType!=undefined && obj.classifications[0].subType.name.toLowerCase()!='undefined'){
                    subType=obj.classifications[0].subType.name;
                    if(finalGenre=='')
                        finalGenre = subType;
                    else
                        finalGenre = finalGenre+' | '+subType;
                }

            }
            if(obj.priceRanges!=undefined && obj.priceRanges.length>0){
                min = obj.priceRanges[0].min;
                max = obj.priceRanges[0].max;
                if(min!=undefined & max==undefined){
                    priceRanges=min+' - '+min+' USD';
                }
                else if(max!=undefined & min==undefined){
                    priceRanges=max+' - '+max+' USD';
                }
                else
                    priceRanges=min+' - '+max+' USD';
            }
            if(obj.dates.status!=undefined){
                ticketStatus = obj.dates.status.code;
            }
            if(obj.url!=undefined)
                buyUrl = obj.url;

            if(obj.seatmap!=undefined)
                seatMap = obj.seatmap.staticUrl;


            var innerString = '<div id="info"><h1>'+obj.name+'</h1><div class="container"><div><p style="max-width:350px;">';
            if(date!='')
                innerString = innerString+'<span class="eventLabel">Date</span><br><span class="eventFields">'+date+'</span><br>';
            if(artist!='')
                innerString = innerString+'<span class="eventLabel">Artist/Team</span><br><span class="eventFields">'+artist+'</span><br>';
            if(venue!='') {
                innerString = innerString+'<span class="eventLabel">Venue</span><br><span class="eventFields">'+venue+'</span><br>';
                getVenueDetails(venue);
            }
            if(finalGenre!='')
                innerString=innerString+'<span class="eventLabel">Genres</span><br><span class="eventFields">'+finalGenre+'</span><br>';
            if(priceRanges!='')
                innerString=innerString+'<span class="eventLabel">Price Ranges</span><br><span class="eventFields">'+priceRanges+'</span><br>';
            if(ticketStatus!=''){
                var color = ticketStatusDict[ticketStatus.toLowerCase()]
                if(ticketStatus.toLowerCase()=='onsale')
                    ticketStatus= 'On Sale';
                else if(ticketStatus.toLowerCase()=='offsale')
                    ticketStatus= 'Off Sale';
                else if(ticketStatus.toLowerCase()=='cancelled')
                    ticketStatus= 'Cancelled';
                else if(ticketStatus.toLowerCase()=='postponed')
                    ticketStatus= 'Postponed';
                else if(ticketStatus.toLowerCase()=='rescheduled')
                     ticketStatus= 'Rescheduled';

                innerString=innerString+'<span class="eventLabel">Ticket Status</span><br><span class="circle eventFields" style="background:'+color+';">'+ticketStatus+'</span><br>';
            }
            if(buyUrl!='')
                innerString=innerString+'<span class="eventLabel">Buy Ticket At:</span><br><span class="eventFields"><a target="_blank" rel="noopener noreferrer" href="'+buyUrl+'">Ticketmaster</a></span>';
            innerString=innerString+'</p></div>';
            if(seatMap!='')
                innerString = innerString+'<div><img src="'+seatMap+'"style="object-fit: cover; float:left; max-height:350px; max-width:450px;"></div>';
            innerString=innerString+'</div><br></div>'

            document.getElementById('eventsInfo').innerHTML = innerString;

        }
    };
    xhr.send();
}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("searchTable");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerText.toLowerCase() < y.innerText.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}


function showVenue(){
    console.log("Venue");
    var coll = document.getElementById("collapsible");
    var i;
    coll.classList.toggle("active");
    var content = coll.nextElementSibling;
    content.style.display = "block";
    coll.style.display="none";
}

function getVenueDetails(venue){
    var xhr = new XMLHttpRequest();
    var url= "/venue?venue="+venue;
    xhr.open('GET', url, false);
    xhr.onload = function() {
       if (xhr.status != 200) {
          console.log("Yo1 "+xhr.status);
       } else {
          var obj = JSON.parse(xhr.response);
          //console.log(xhr.response);
          if(obj._embedded!=undefined){
          var name=obj._embedded.venues[0].name;
          var address= obj._embedded.venues[0].address.line1;
          var city = obj._embedded.venues[0].city.name+", "+obj._embedded.venues[0].state.stateCode;
          var postalCode = obj._embedded.venues[0].postalCode;
          var imageUrl;
          if(obj._embedded.venues[0].images!=undefined && obj._embedded.venues[0].images!=null && obj._embedded.venues[0].images!='N/A')
            imageUrl = obj._embedded.venues[0].images[0].url;
          var upcomingEvents = obj._embedded.venues[0].url;
          var venueInfo = document.getElementById("venueInfo");
          var googleMapUrl = 'https://www.google.com/maps/search/?api=1&query='+name+', '+address+', '+city+', '+postalCode;
          var innerString= '<div id="venueDetails"><div class="collapsible" id="collapsible"><h2 style="margin:0px; font-family: Sans-serif; font-weight: lighter;">Show Venue Details</h2><div class="dropdown" onclick="showVenue()"></div></div><div class="content"><div class="venueAddress">';
          innerString = innerString + '<h1><span style="border-bottom: 1px solid black;margin: auto">'+'&nbsp'+name+'&nbsp</span></h1>';
          if(imageUrl!=undefined)
              innerString = innerString + '<div style="margin:auto; width:130px;"><img src="'+imageUrl+'" style="width:130px; height:80px;"></img></div>';
          innerString = innerString + '<div class="container" style="padding-top:15px;">';
          if(address!=undefined && address!='N/A') {
              innerString = innerString + '<div style="border-right:1px solid black; padding:15px;"><div style="flex-direction:row; display:flex; width: 250px; margin:auto;"><span><b>Address:&nbsp</b></span><span style="width:250px;">'+address+'<br>'+city+'<br>'+postalCode+'</span></div>';
              innerString = innerString + '<p style="margin:auto; width:160px; margin-top:10px;"><a href="'+googleMapUrl+'" target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p></div>';
          }
          if(upcomingEvents!= undefined && upcomingEvents!='N/A')
                 innerString = innerString + '<div style="text-align:center;padding:5px;"><a href="'+upcomingEvents+'" target="_blank" rel="noopener noreferrer">More events at this venue</a></div>';
          innerString = innerString + '</div></div></div></div>';
          venueInfo.innerHTML = innerString;
         }
         else
            venueInfo.innerHTML = '';
       }
    };
    xhr.send();
}
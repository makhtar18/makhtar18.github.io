var categoryDict= {"Music":"KZFzniwnSyZfZ7v7nJ", "Sports":"KZFzniwnSyZfZ7v7nE", "Arts": "KZFzniwnSyZfZ7v7na",
 "Theatre": "KZFzniwnSyZfZ7v7na", "Film":"KZFzniwnSyZfZ7v7nn","Miscellaneous":"KZFzniwnSyZfZ7v7n1","Default":""};

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
    if(events==null || events.length==0 || events == undefined){
        eventsTable.innerHTML = '<div style="width:1200px; margin:auto; color:#d20909; text-align:center; background:white; padding:10px">No Records found</div>';
    }
    else {
        var s = '<table id="searchTable" style="background:white; width:1200px; margin:auto; text-align:center"><tr style="box-shadow: 0 2px 2px 2px #a4a0a07d;"><th style="width:200px; padding:5px;">Date</th><th style="width:200px; padding:5px;">Icon</th><th style="width:500px; padding:5px;">Event</th><th style="width:100px; padding:5px;">Genre</th><th style="width:250px; padding:5px;">Venue</th></tr>';
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
            s=s+'<td><a href="#eventsInfo" style="text-decoration: none;" onclick="displayEventInfo(this)" eventId="'+event.id+'">'+eventName+'</a></td>';
            s=s+'<td>'+genre+'</td>';
            s=s+'<td>'+venue+'</td></tr>';
        }
        s=s+'</table>';
        eventsTable.innerHTML = s;

    }
}

function displayEventInfo(event) {
    var eventInfo = event.getAttribute('eventId');
    var eventInfoUrl = "/eventInfo?eventId="+eventInfo;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', eventInfoUrl, false);
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log("Yo1 "+xhr.status);
        } else {
            console.log(xhr.response);
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
            for(attraction of obj._embedded.attractions){
                if(artist=='')
                    artist = '<a target="_blank" rel="noopener noreferrer" href="'+attraction.url+'">'+attraction.name+'</a>';
                else
                    artist = artist+' | '+'<a target="_blank" rel="noopener noreferrer"  href="'+attraction.url+'">'+attraction.name+'</a>';
            }
            if(obj._embedded.venues!=undefined && obj._embedded.venues.length>0)
                venue = obj._embedded.venues[0].name;
            if(obj.classifications!=undefined && obj.classifications.length>0){

                if(obj.classifications[0].subGenre!=undefined) {
                    subGenre=obj.classifications[0].subGenre.name;
                    if(finalGenre=='')
                        finalGenre= subGenre;
                    else
                        finalGenre=finalGenre+' | '+subGenre;
                }

                if(obj.classifications[0].genre!=undefined){
                    genre=obj.classifications[0].genre.name;
                    if(finalGenre=='')
                        finalGenre= genre;
                    else
                        finalGenre=finalGenre+' | '+genre;
                }

                if(obj.classifications[0].segment!=undefined){
                    segment=obj.classifications[0].segment.name;
                    if(finalGenre=='')
                        finalGenre = segment;
                    else
                        finalGenre = finalGenre+' | '+segment;
                }

                if(obj.classifications[0].subType!=undefined){
                    subType=obj.classifications[0].subType.name;
                    if(finalGenre=='')
                        finalGenre = subType;
                    else
                        finalGenre = finalGenre+' | '+subType;
                }

                if(obj.classifications[0].type!=undefined){
                    type=obj.classifications[0].type.name;
                    if(finalGenre=='')
                        finalGenre = type;
                    else
                        finalGenre=finalGenre+' | '+type;
                }
            }
            if(obj.priceRanges!=undefined && obj.priceRanges.length>0){
                min = obj.priceRanges[0].min;
                max = obj.priceRanges[0].max;
                priceRanges=min+' - '+max+' USD';
            }
            if(obj.dates.status!=undefined){
                ticketStatus = obj.dates.status.code;
            }
            if(obj.url!=undefined)
                buyUrl = obj.url;

            if(obj.seatmap!=undefined)
                seatMap = obj.seatmap.staticUrl;


            var innerString = '<div id="info"><h1>'+obj.name+'</h1><div class="container"><div><p>';
            if(date!='')
                innerString = innerString+'<span class="eventLabel">Date</span><br><span class="eventFields">'+date+'</span><br>';
            if(artist!='')
                innerString = innerString+'<span class="eventLabel">Artist/Team</span><br><span class="eventFields">'+artist+'</span><br>';
            if(venue!='')
                innerString = innerString+'<span class="eventLabel">Venue</span><br><span class="eventFields">'+venue+'</span><br>';
            if(finalGenre!='')
                innerString=innerString+'<span class="eventLabel">Genres</span><br><span class="eventFields">'+finalGenre+'</span><br>';
            if(priceRanges!='')
                innerString=innerString+'<span class="eventLabel">Price Ranges</span><br><span class="eventFields">'+priceRanges+'</span><br>';
            if(ticketStatus!='')
                innerString=innerString+'<span class="eventLabel">Ticket Status</span><br><span class="eventFields">'+ticketStatus+'</span><br>';
            if(buyUrl!='')
                innerString=innerString+'<span class="eventLabel">Buy Ticket At:</span><br><span class="eventFields"><a target="_blank" rel="noopener noreferrer" href="'+buyUrl+'">Ticketmaster</a></span>';
            innerString=innerString+'</p></div>';
            if(seatMap!='')
                innerString = innerString+'<div><img src="'+seatMap+'" width=450px style="object-fit: cover; float:right;"></div>';
            innerString=innerString+'</div><br></div>'

            document.getElementById('eventsInfo').innerHTML = innerString;

        }
    };
    xhr.send();
}

function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      //check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}



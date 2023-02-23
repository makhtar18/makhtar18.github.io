from flask import Flask, render_template
from flask import request
import requests
import json

app = Flask(__name__)
@app.route('/')
def index():
    return app.send_static_file('events.html');


@app.route('/submit')
def submit():
    print("Submit checking url "+request.url)
    keyword = request.args.get('keyword');
    radius = request.args.get('radius');
    geoPoint = request.args.get('geoPoint');
    segmentId = request.args.get('segmentId');
    unit = 'miles';
    apikey = 'ivkPBavAMu7OClWFpGKkIiS4Hsrfkd76';
    url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey='+apikey+'&keyword='+keyword+'&segmentId='+segmentId+'&radius='+radius+'&unit='+unit+'&geoPoint='+geoPoint;
    print("Executing "+url);
    response = requests.get(url);
    #print(response.json());
    return response.json();


@app.route('/eventInfo')
def eventInfo():
    print("Event checking url "+request.url)
    eventId = request.args.get('eventId');
    apikey = 'ivkPBavAMu7OClWFpGKkIiS4Hsrfkd76';
    url = 'https://app.ticketmaster.com/discovery/v2/events/'+eventId+'?apikey='+apikey;
    print("Executing "+url);
    response = requests.get(url);
    #print(response.json());
    return response.json();

@app.route('/venue')
def venueInfo():
    print("Venue checking url "+request.url)
    venueName = request.args.get('venue');
    apikey = 'ivkPBavAMu7OClWFpGKkIiS4Hsrfkd76';
    url = 'https://app.ticketmaster.com/discovery/v2/venues/?apikey='+apikey+'&keyword='+venueName;
    print("Executing "+url);
    response = requests.get(url);
    #print(response.json());
    return response.json();

if __name__ == "__main__":
    app.run(debug=True)
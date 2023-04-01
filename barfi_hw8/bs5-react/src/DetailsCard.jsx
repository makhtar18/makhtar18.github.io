import React from "react";
import { Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Favorite from "./Favorite";
import { FiChevronLeft } from 'react-icons/fi';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSpring, animated } from 'react-spring';
import axios from "axios";
import EventsTab from "./EventsTab";
import ArtistsTab from "./ArtistsTab";
import VenueTab from "./VenueTab";

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: 'bfd2e4e08b8745a29aa8803da2c2f95b',
  clientSecret: '109c6d664d50470db269a0cab628e83b',
  redirectUri: 'http://localhost:3000'
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  const animation = useSpring({
    opacity: value === index ? 1 : 0,
    transform: `translate3d(${value === index ? 0 : 100}px, 0, 0)`,
  });
  return (
    <animated.div
      style={animation}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </animated.div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

  
const DetailsCard = (props)=>{
    const [value, setValue] = useState(0);
    const [eventsResponse, setEventsResponse] = useState({});
    const [accessToken, setAccessToken] = useState('');
    const [spotifyResponse, setSpotifyResponse] = useState([]);
    const [spotifyAlbumnResponse, setSpotifyAlbumnResponse] = useState({});
    const [venueResponse, setVenueResponse] = useState([]);
    spotifyApi.setAccessToken(accessToken);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(() => {
      async function getAccessToken() {
        const response = await axios.get(`http://localhost:4000/getSpotifyAuthToken`);
        return response.data;
      }

      const getEventData = async () => {
        const response = await axios.get(`http://localhost:4000/eventsInfo?eventId=${props.eventId}`);
        const eventData = await response.data;
        //console.log("EventData called", eventData);
        setEventsResponse(eventData);
        var musicRelatedArtists = [];
        try {
          for (let artist of eventData.musicRelatedArtists) {
            const data = await spotifyApi.searchArtists(artist);
            console.log("Spotify status code: " + data.statusCode);
            //console.log('Search artists by'+artist, data.body.artists.items[0]);
            musicRelatedArtists.push(data.body.artists.items[0]);
            var artistId = data.body.artists.items[0].id;
            try {
              const albumData = await spotifyApi.getArtistAlbums(artistId, { limit: 3 });
              //console.log('Artist albums', albumData.body.items);
              spotifyAlbumnResponse[artistId] = albumData.body.items;
            } catch (err) {
              console.error("Album Error", err);
            }
          }
          setSpotifyResponse(musicRelatedArtists);
        } catch (err) {
          console.error("Spotify Api Error:", err);
          getAccessToken().then((res) => {
            setAccessToken(res);
            console.error("Token generated", res);
            spotifyApi.setAccessToken(accessToken);
          });
        }
      };
      getEventData();
    }, [props.eventId,accessToken]);

    useEffect(() => {

      async function getVenueDetails(venue) {
        const response = await axios.get(`http://localhost:4000/getVenueDetails?venue=${venue}`);
        console.log("Venue status code ",response.status);
        return response.data;
      }

      const getVenueData = async () => {
        var venue = await getVenueDetails(props.venue);
        //console.log(venue);
        setVenueResponse(venue);
      };

      getVenueData();
    }, [props.venue, props.eventId]);

    return (
    <Card className='detailsCard col-sm-8 py-3' style={{
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(13px)',
        margin:'auto',
        borderRadius: '0px',
        marginTop:'3rem',
        marginBottom:'3rem'
    }
    }>
        <a className="mx-3" href="#" style={{padding:"0px", border:"0px", backgroundColor:"transparent", color:"white"}} onClick={()=>{
          props.setShowDetailsCard(false);
          props.setShowTable(true);
        }}><FiChevronLeft style={{width:"21px", height:"auto"}}/><u>Back</u></a>
        <div style={{display: "flex", alignItems: "center", margin:"auto"}}>
          <h3 style={{color: "white", margin: "0", display: "flex", alignItems: "center"}}>
            {props.eventName}
          <div style={{marginLeft: "0.5rem"}}>
            <Favorite />
          </div>
           </h3>
        </div>
        <Box sx={{ width: '100%' }} className="mt-4">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered style={{backgroundColor:"#4c9c8c"}}>
              <Tab label="Events" {...a11yProps(0)}/>
              <Tab label="Artist/Teams" {...a11yProps(1)} />
              <Tab label="Venue" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0} >
            <EventsTab eventsResponse={eventsResponse}></EventsTab>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ArtistsTab attractionName={props.artists} spotifyResponse={spotifyResponse} albumns={spotifyAlbumnResponse}/>
           </TabPanel>
          <TabPanel value={value} index={2}>
            <VenueTab venueResponse={venueResponse}></VenueTab>
          </TabPanel>
        </Box>
    </Card>
  )
};

export default DetailsCard;

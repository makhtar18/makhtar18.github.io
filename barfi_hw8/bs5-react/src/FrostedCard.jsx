import React from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from "axios";
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

const ticketmasterApiKey = 'zMcFauK2bK6lA8H3JfTHqncFofsT8qtK';
const FrostedCard = () => {
    const [keyword, setKeyword] = useState(null);
    const [category, setCategory] = useState('Default');
    const [location, setLocation] = useState('');
    const [distance, setDistance] = useState(10);
    const [checkbox, setCheckbox] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const getOptions = async (searchText) => {
        if (searchText.length > 0) {
          setLoading(true);
          const response = await axios.get(`https://app.ticketmaster.com/discovery/v2/suggest?apikey=${ticketmasterApiKey}&keyword=${searchText}`);
          setLoading(false);
          if(response.data._embedded!==undefined)
            setOptions(response.data._embedded.attractions.map((option) => option.name));
          else {
            setLoading(false);
            setOptions([])
          }
          
        } else {
          setLoading(false);
          setOptions([]);
        }
      };
    const handleSubmit = (e)=>{
        e.preventDefault(); 
        console.log(keyword);
    }
    return (
        <Card className='custom-card col-sm-6' style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
            webkitbackdropfilter: 'blur(2px)',
            padding: '20px 20px 20px 20px',
            margin:'auto',
            borderRadius:'18px',
            marginTop:'3rem'
        }
        }>
        <Form onSubmit={handleSubmit}>
            <h2 className='formH1 mt-4'>Events Search</h2>
            <Form.Group className="mt-3">
                <Form.Label className='formInput'>Keyword<span style={{color:'red'}}>*</span></Form.Label>
                <Autocomplete
                    loadingText={loading && <CircularProgress size={20} />}
                    noOptionsText="No matching results found"
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <Form.Control {...params.inputProps} type="text" required id="keyword"/>
                      </div>
                    )}
                    filterOptions={() => options}
                    loading={loading}
                    options={options}
                    value={keyword}
                    onChange={(event, value) => {setKeyword(value);}}
                    onInputChange={(event, value) => {getOptions(value);}}
                />
            </Form.Group>
            <div className="row">
                <Form.Group className="mt-3 col-6" controlId="distance">
                    <Form.Label className='formInput'>Distance</Form.Label>
                    <Form.Control type="number" placeholder="10" value={distance} onChange={(e)=>{setDistance(e.target.value)}}/>
                </Form.Group>
                <Form.Group className="mt-3 col-5" controlId="category">
                    <Form.Label className='formInput'>Category<span style={{color:'red'}}>*</span></Form.Label>
                    <Form.Select value={category} onChange={(e)=>{setCategory(e.target.value)}}>
                    <option value="Default">Default</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts&Theatre">Arts & Theatre</option>
                    <option value="Film">Film</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                    </Form.Select>
                </Form.Group>
            </div>
            <Form.Group className="mt-3" controlId="location">
                <Form.Label className='formInput'>Location<span style={{color:'red'}}>*</span></Form.Label>
                <Form.Control type="text" required disabled={checkbox} value={location} onChange={(e)=>{setLocation(e.target.value);}}/>
            </Form.Group>
            <Form.Group className="mt-3" controlId="checkbox">
                <Form.Check type="checkbox" label="Auto-detect your location" checked={checkbox} onChange={
                    (e)=>{
                        setCheckbox(e.target.checked); 
                        setLocation('');
                    }
                    }/>
            </Form.Group>
            <div className="d-flex justify-content-center mt-3 mb-4">
            <Button variant="danger" type="submit" className='mx-2'>
                SUBMIT
            </Button>
            <Button variant="primary" type="button" className='mx-2' onClick={()=>
                {
                    setCheckbox(false);

                    setLocation('');

                    setDistance(10);
                
                    setKeyword(null);
                
                    setCategory("Default");
                
                }
            }>
                CLEAR
            </Button>
            </div>
        </Form>
        </Card>
    );
  };

export default FrostedCard;
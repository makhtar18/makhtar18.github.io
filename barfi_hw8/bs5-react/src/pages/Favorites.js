import React, { useState } from "react";
import NoResults from "../NoResultsMessage";
import { BsTrash } from 'react-icons/bs';

export default function Favorites() {
  const favoriteTableString = localStorage.getItem('favoriteTable');
  const favoriteTable = JSON.parse(favoriteTableString);
  const [rows, setRows] = useState(Object.keys(favoriteTable));

  const handleDelete = (eventId)=>{
    delete favoriteTable[eventId];
    var favoriteTableStr = JSON.stringify(favoriteTable);
    localStorage.setItem('favoriteTable',favoriteTableStr);
    setRows(Object.keys(favoriteTable));
  }

  return (
    <div>
      { (rows.length === 0) && (
        <NoResults message="No favorite events to show" marginText="4rem auto auto auto"></NoResults>)
      }

      {(rows.length > 0) && (<div className="col-sm-9" style={{margin:"4rem auto auto auto"}}>
                    <h5 style={{textAlign:"center", color:"rgb(115, 241, 222)"}}>List of your favorite events</h5>
                    <table className="table table-light table-striped mt-4" style={{borderRadius: "20px", textAlign:"center", margin:"auto", minWidth:"470px", overflow:"hidden"}}>
                        <thead>
                            <tr className="row px-2">
                                <th className="col col-md-1">#</th>
                                <th className="col col-md-2">Date</th>
                                <th className="col col-md-4">Event</th>
                                <th className="col col-md-2">Category</th>
                                <th className="col col-md-2">Venue</th>
                                <th className="col col-md-1">Favorite</th>
                            </tr>
                        </thead>
                        <tbody>
                        {rows.map((eventId, index) => {
                            var val = favoriteTable[eventId];
                            return (
                                <tr className="row px-2" key={eventId}>
                                    <td className="col col-md-1">{index+1}</td>
                                    <td className="col col-md-2">{val.date}</td>
                                    <td className="col col-md-4">{val.event}</td>
                                    <td className="col col-md-2">{val.category}</td>
                                    <td className="col col-md-2">{val.venue}</td>
                                    <td className="col col-md-1"><BsTrash onClick={() => handleDelete(eventId)} style={{cursor:"pointer"}}/></td>
                                </tr>
                            )
                          })}
                        </tbody>
                    </table>
                </div>)}
    </div>
  );
}

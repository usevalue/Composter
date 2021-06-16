import React from 'react';
import {Marker} from 'react-leaflet'


const icon = L.icon({iconUrl: 'images/stockseed.png', iconSize: L.point(22, 30), iconAnchor: L.point(2,27)});

class MapSapling extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.name,
      position: props.position,
      welcome: props.welcome,
      editing: false,
    }
    this.clicked = ()=>{
        props.action(this);
    }
    this.dragged = (e)=>{
        let arrival = e.target._latlng;
        this.setState({position: [arrival.lat, arrival.lng]});
    }
  }
  render() {
    return <Marker
        icon={icon}
        position={this.state.position}
        eventHandlers={{click: this.clicked, dragend: this.dragged}}
        draggable={this.state.editing}></Marker>
  }
}

export default MapSapling
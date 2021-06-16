import React from 'react';
import {MapContainer, TileLayer, useMapEvents} from 'react-leaflet'
import styles from '../styles/SeedMap.module.css'
import 'leaflet/dist/leaflet.css'
import MapSapling from './mapSapling'
import turf from '@turf/turf'

const Modes = {
  viewing: "viewing",
  planting: "planting",
  editing: "editing"
}

const home = [42.931, -78.865]

const Controller = (props)=>{
  useMapEvents({
    click: props.action
  });
  return null;
}

const SeedBed = (props)=>{
  if(props.saplings) {
    var sprouts = props.saplings.map((sapling)=> 
        <span>{sapling}</span>
    );
    return sprouts
  }
  else return null
}

class PlanningMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentMode: Modes.viewing,
      focus: null,
      saplings: []
    }

    this.lookupsaplings = async ()=> {
      try {
        fetch('/api/forest', {
          method: 'GET',
        })
        .then(response=> 
          response.json()
        ).then(data=>{
          let s = this.state.saplings
          for(let i=0; i<data.length; i++) {
            let e = this.createSapling(data[i])
            s.push(e)
          }
          this.setState({saplings: s})
        });
      }
      catch(e) {
        console.log('Error with forest lookup.')
        console.log(e)
      }
    }

    this.toggleMode = ()=> {
      if(this.state.currentMode==Modes.planting) {
        this.setState({currentMode: Modes.viewing})
        $('#plantsapling').html('Plant a sapling');
      }
      else {
        this.setState({currentMode: Modes.planting})
        $('#plantsapling').html('Cancel planting');
      }
    }

    this.createSapling = (data) => {
      let stringified = data._id.toString()
      let s = React.createElement(MapSapling, {
        key: stringified,
        action: this.focusOn,
        ... data
      });
      return s;
    }

    this.planting = async (e)=>{
      switch(this.state.currentMode) {
        case Modes.planting:
          try {
            let pos = [e.latlng.lat, e.latlng.lng]
            fetch('/api/saplings',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(pos),
            }).then( data => data.json())
            .then((sap)=>{
              let sb = this.state.saplings;
              let seed = this.createSapling(sap)
              sb.push(seed)
              this.setState({saplings: sb})
            })
          }
          catch (e) {
            alert('There was a problem planting this sapling.  Please check browser console and contact side administrator.');
            console.log(e);
          }
          this.setState({currentMode: Modes.viewing});
          $('#plantsapling').html('Plant a sapling')
          break;
        default:
          break;
      }
    }

    this.focusOn = (sapling) => {
      if(this.state.focus) {
        let s = this.state.focus
        s.setState({editing: false})
      }
      this.setState({focus: sapling})
    }

    this.saveFocus = async ()=>{
      try {
        let f = this.state.focus;
        this.setState({currentMode: Modes.viewing})
        await f.setState({
          editing: false,
          name: $('#sapling_name').val(),
          welcome: $('#sapling_description').val()
        });
        let prep = f.state;
        prep._id = f.props._id;
        let toSave = JSON.stringify(prep)
        fetch('/api/saplings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: toSave,
        }).then(async response=>{
          if(response.ok) {
            
          }
        })
      }
      catch(e) {
        alert('Unable to save your data!');
        console.log(e)
      }
    }

    this.editsapling = ()=>{
      this.setState({currentMode: Modes.editing})
      this.state.focus.setState({editing: true})
    }

    this.deleteFocus = () => {
      let deleted = this.state.focus;
      fetch('/api/saplings', {
        method: 'DELETE',
        body: deleted.props._id
      }).then((response)=>{
        console.log(response)
        if(response.ok) {
          let modified = this.state.saplings;
          let searched = false;
          let i = 0;
          let t = -1
          console.log(deleted.props.id)
          while(!searched) {
            console.log('checking index '+i)
            console.log(modified[i])
            if(i>=modified.length) {
              searched = true
              console.log('Search ended without finding anything')
            }
            else if(modified[i].props._id==deleted.props._id) {
              t = i;
              searched=true;
            }
             else i++
          }
          if(t>-1) modified.splice(i,1);
          this.setState({seedlings: modified})
        }
        else {
          alert('There was an error deleting this sapling.')
        };
      })
    }

  }

  componentDidMount() {
    this.lookupsaplings();
  }

  render() {
    return (
      <div>
        <MapContainer id='mymap' center={home} zoom={14} scrollWheelZoom={true} className={styles.map}>
          <TileLayer 
            url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
            attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"/>
          <SeedBed saplings={this.state.saplings} action={this.focusOn}></SeedBed>
          <Controller action={this.planting} />
        </MapContainer>
        <br/>
        <div className={styles.controller}>
          <button onClick={this.toggleMode} id='plantsapling'>Plant a sapling</button>
        </div>
        <SidePanel focus={this.state.focus} editsapling={this.editsapling} savesapling={this.saveFocus} deletesapling={this.deleteFocus} mode={this.state.currentMode}></SidePanel>
      </div>
    );
  }
}

class SidePanel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if(this.props.focus==null) {
      return(<div className={styles.sidepanel}>Click on a seed for more information</div>)
    }
    else {
      let f = this.props.focus;
      if(f.state.editing) {
        return (
          <div className={styles.sidepanel}>
            <b>Name:</b> <input type="text" id="sapling_name" defaultValue={f.state.name}/><br/>
            <i>Drag marker to new location</i><br/>
            <b>Welcoming message:</b><br/>
            <textarea id="sapling_description" defaultValue={f.state.welcome}></textarea><br/><br/>
            <button onClick={this.props.savesapling}>Save sapling</button>
          </div>
        )
      }
      else {
        return (
          <div className={styles.sidepanel}>
              <h1>{f.state.name}</h1>
              <i>Latitude {f.state.position[0]}<br/>Longitude {f.state.position[1]}</i><br/>
              <p>{f.state.welcome}</p>
              <br/><br/>
              <button onClick={this.props.editsapling}>Edit sapling</button><br/><br/>
              <button onClick={this.props.deletesapling}>Delete sapling</button>
          </div>
        )}
    }
  }
}


export default PlanningMap;
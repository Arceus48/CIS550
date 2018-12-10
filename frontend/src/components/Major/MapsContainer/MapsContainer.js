import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
const mapStyles = {
    width: '100%',
    height: '100%'
};

const initialState = {
    showingInfoWindow: false,  //Hides or the shows the infoWindow
    activeMarker: {},          //Shows the active marker upon click
    selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
}

class MapsContainer extends Component {
    constructor(props){
        super();
        this.state = initialState;
    }

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onInfoWindowOpen(props, e) {
        const name = this.state.selectedPlace.name;
        const business_id = this.state.selectedPlace.business_id;
        let button = (<p> Restaurant homepage: <button onClick={this.props.handleThirdPage} name={name} value={business_id} className="btn btn-link"> {name}</button></p>);
        ReactDOM.render(React.Children.only(button), document.getElementById("buttonDiv"));
    }

    onClose = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    }

    render(){
        const results = this.props.results;
        const markers = results.map((result, index) => {
            return(
                <Marker key = {index}
                    onClick={this.onMarkerClick}
                    name={result.restaurant_name}
                    business_id ={result.business_id}
                    stars={result.stars}
                    review_count={result.review_count}
                    parking={(result.parking) ? 'Yes' : 'No'}
                    is_open={(result.is_open) ? 'Yes' : 'No'}
                    take_out={(result.take_out) ? 'Yes' : 'No'}
                    info={'Shake shack, (NYSE: SHAK) is an American fast casual restaurant chain based in New York City. It started out as a hot dog cart inside Madison Square Park in 2001, and its popularity steadily grew. In 2004, it moved to a stand within the park, expanding its menu from New York-style hotdogs to one with hamburgers, hotdogs, fries and its namesake milkshakes. The company advertises it uses natural, hormone and antibiotic free Angus beef.'}
                    position={{lat: result.latitude, lng: result.longitude}} />
            );
        });
        const place = this.state.selectedPlace;
        let initialCenter = {
            lat: 36.120457,
            lng: -115.073631
        };
        if(results.length > 0) initialCenter.lat = results[0].latitude;
        if(results.length > 0) initialCenter.lng = results[0].longitude;
        return (
            <Map google={this.props.google}
                zoom={11}
                style={mapStyles}
                initialCenter={ initialCenter }
            >
                {markers}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                    onOpen={e => this.onInfoWindowOpen(this.props, e)}
                    >
                    <div id="infoWindowInnerDiv">
                        <h1 id="firstHeading" className="firstHeading">{place.name}</h1>
                        <p><b>Review Stars:</b> {place.stars} </p>
                        <p><b>Review Count:</b> {place.review_count} </p>
                        <p><b>Parking:</b> {place.parking} </p>
                        <p><b>Opening:</b> {place.is_open} </p>
                        <p><b>Take out:</b> {place.take_out} </p>
                        <div id="buttonDiv"></div>
                    </div>
                </InfoWindow>
            
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCxWo2Lf8qF305mGEr-x5Dh4gIZy4JpEmU'
})(MapsContainer);


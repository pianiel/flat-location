import {default as React, Component} from "react";
import {default as update} from "react-addons-update";

import {default as canUseDOM} from "can-use-dom";
import {default as _} from "lodash";

import {default as InfoBox} from './info.jsx';
import {default as DirectionsMap} from './map.jsx';


export default class GettingStarted extends Component {

    state = {
        directionsService: new google.maps.DirectionsService(),
        geocoder: new google.maps.Geocoder(),
        newFlatLoc: 'E1 1HL', //
        mapCenter: new google.maps.LatLng(51.5154542, -0.0655901),
        travelMode: google.maps.TravelMode.WALKING,
        people: [
            {
                name: 'Piotr',
                office: 'E1W 1AZ', //new google.maps.LatLng(51.5248645, -0.0916461),
                colour: '#0000FF',
            },
            {
                name: 'Karolina',
                office: 'EC2A 3AT', //new google.maps.LatLng(51.5264841, -0.0804561),
                colour: '#FF0000',
            },
            {
                name: 'Gabi',
                office: 'EC3M 7HA',
                colour: '#00FFFF',
            }
        ],
    }

    constructor (props, context) {
        super(props, context);
        this.fetchDirectionsAll();
        this.geocodeAll();
    }

    fetchDirectionsAll () {
        this.state.people.forEach((person) => {
            let {name, office} = person;
            this.fetchDirections(name, this.state.newFlatLoc, office, this.state.travelMode);
        });
    }

    fetchDirections (name, origin, destination, travelMode) {
        this.state.directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: travelMode
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.updateDirections(name, result);
            } else {
                console.error(`error fetching directions ${ result }`);
            }
        });
    }

    updateDirections (name, directions) {
        let newData = _.map(this.state.people, (person) => {
            if (person.name === name) {
//                debugger;
                return {...person, directions: directions};
            }
            return person;
        });
        this.setState({people: newData});
    }


    geocodeAll () {
        this.state.people.forEach((person) => this.geocode(person.name, person.office));
    }

    geocode(name, address) {
        this.state.geocoder.geocode({ address: address + ', London' }, (result, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                let location = result[0].geometry.location;
                let newData = _.map(this.state.people, (person) => {
                    if (person.name === name) {
                        return {...person, officeLatLng: location};
                    }
                    return person;
                });
                this.setState({people: newData});

            } else {
                console.log('geocoding not successful');
            }
        });
    }



    handleMapClick (event) {
        this.setState({ newFlatLoc: event.latLng });
        this.fetchDirectionsAll();
    }

    render () {
        const {newFlatLoc, mapCenter, people} = this.state;

        return (
            <div id="container">
                <header>
                    <div>
                        <h1>London Flat Hunting</h1>
                    </div>
                    <div>
                        <h4>Hello</h4>
                    </div>
                </header>
                <div id="content">
                    <div id="sidebar">
                        <InfoBox people={people} />
                    </div>
                    <DirectionsMap mapCenter={mapCenter}
                                   people={people}
                                   onMapClick={::this.handleMapClick}
                    />
                </div>
            </div>
        );
    }
}

import React, { Component } from "react";
import update from "react-addons-update";
import { Panel } from 'react-bootstrap';

import canUseDOM from "can-use-dom";
import _ from "lodash";

import InfoBox from './info.jsx';
import DirectionsMap, { MapsDisclaimer } from './map.jsx';


export default class FlatHunting extends Component {

    state = {
        directionsService: new google.maps.DirectionsService(),
        geocoder: new google.maps.Geocoder(),
        newFlatLoc: 'E1 1HL', //
        newFlatName: 'E1 1HL',
        mapCenter: new google.maps.LatLng(51.5154542, -0.0655901),
        travelMode: google.maps.TravelMode.WALKING,
        people: [
            {
                name: 'Piotr',
                office: 'E1W 1AZ', //new google.maps.LatLng(51.5248645, -0.0916461),
                colour: '#3C0063',
            },
            {
                name: 'Karolina',
                office: 'EC2A 3AT', //new google.maps.LatLng(51.5264841, -0.0804561),
                colour: '#C70028',
            },
            {
                name: 'Gabi',
                office: 'EC3M 7HA',
                colour: '#00AFB2',
            },
            {
                name: 'Vilius',
                office: 'EC3M 4AJ',
                colour: '#FF8726',
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
        this.state.geocoder.geocode({ address }, (result, status) => {
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
                console.log('Cannot find coordinates for given address');
            }
        });
    }

    reverseGeocode (location) {
        this.state.geocoder.geocode({ location }, (result, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                if (result.length > 0) {
                    let location = result[0].formatted_address;
                    this.setState({ newFlatName: location });
                }
            } else {
                console.log('Cannot convert new flat coordinates to an address');
            }
        });
    }

    handleMapClick (event) {
        this.setState({ newFlatLoc: event.latLng });
        this.fetchDirectionsAll();
        this.reverseGeocode(event.latLng);
    }

    handleSearchBoxChanged (searchBox) {
        const places = searchBox.getPlaces()
        this.handleMapClick({ latLng: places[0].geometry.location });
    }

    render () {
        const {newFlatLoc, newFlatName, mapCenter, people} = this.state;

        return (
            <div id="container">
                <header>
                    <div>
                        <h1>London Flat Hunting</h1>
                    </div>
                    <div>
                        <h4>Enter address or click on the map to see distances for this location</h4>
                    </div>
                </header>
                <div id="content">
                    <div id="sidebar">
                        <Panel><strong>New flat:</strong> {newFlatName}</Panel>
                        <InfoBox people={people} />
                        <MapsDisclaimer container={people[0].directions} />
                    </div>
                    <DirectionsMap mapCenter={mapCenter}
                                   people={people}
                                   onMapClick={::this.handleMapClick}
                                   onSearchBoxChanged={::this.handleSearchBoxChanged}
                    />
                </div>
            </div>
        );
    }
}

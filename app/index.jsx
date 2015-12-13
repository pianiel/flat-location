import {default as React, Component} from "react";
import {default as update} from "react-addons-update";

import {default as canUseDOM} from "can-use-dom";
import {default as _} from "lodash";

import {default as InfoBox} from './info.jsx';
import {default as DirectionsMap} from './map.jsx';


export default class GettingStarted extends Component {

    state = {
        directionsService: new google.maps.DirectionsService(),
        newFlatLoc: 'E1 1HL', //
        mapCenter: new google.maps.LatLng(51.5154542, -0.0655901),
        travelMode: google.maps.TravelMode.WALKING,
        people: [
            {
                name: 'Piotr',
                office: 'E1W 1LA', //new google.maps.LatLng(51.5248645, -0.0916461),
                colour: '#0000FF',
            },
            {
                name: 'Karolina',
                office: 'EC2A 3AT', //new google.maps.LatLng(51.5264841, -0.0804561),
                colour: '#FF0000',
            },
        ],
    }

    constructor (props, context) {
        super(props, context);
        this.fetchDirectionsAll();
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
        })
        this.setState({people: newData});
    }

    handleMapClick (event) {
        this.setState({ newFlatLoc: event.latLng });
        this.fetchDirectionsAll();
    }

    render () {
        const {newFlatLoc, mapCenter, people} = this.state;

        return (
            <div id="container">
                <InfoBox people={people} />
                <DirectionsMap mapCenter={mapCenter}
                               people={people}
                               onMapClick={::this.handleMapClick}
                />
            </div>
        );
    }
}

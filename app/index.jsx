import {default as React, Component} from "react";
import {default as update} from "react-addons-update";

import {default as canUseDOM} from "can-use-dom";
import {default as _} from "lodash";

import {GoogleMapLoader, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps";
import {triggerEvent} from "react-google-maps/lib/utils";

import {default as InfoBox} from './info.jsx';


export default class GettingStarted extends Component {

    state = {
        directionsService: new google.maps.DirectionsService(),
        newFlatLoc: 'E1 1HL', //
        mapCenter: new google.maps.LatLng(51.5154542, -0.0655901),
        travelMode: google.maps.TravelMode.WALKING,
        data: [
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
        this.handleWindowResize = _.throttle(::this.handleWindowResize, 500);

        this.fetchDirectionsAll();
    }

    fetchDirectionsAll () {
        this.state.data.forEach((person) => {
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
                console.log('fetched directions');
                this.updateDirections(name, result);
            } else {
                console.error(`error fetching directions ${ result }`);
            }
        });
    }

    updateDirections (name, directions) {
        let newData = _.map(this.state.data, (person) => {
            if (person.name === name) {
                return {...person, directions: directions};
            }
            return person;
        })
        this.setState({data: newData});
    }

    componentDidMount () {
        if (!canUseDOM) {
            return;
        }
        window.addEventListener("resize", this.handleWindowResize);
    }

    componentWillUnmount () {
        if (!canUseDOM) {
            return;
        }
        window.removeEventListener("resize", this.handleWindowResize);
    }

    handleWindowResize () {
        console.log("handleWindowResize", this._googleMapComponent);
        triggerEvent(this._googleMapComponent, "resize");
    }

    /*
     * This is called when you click on the map.
     * Go and try click now.
     */
    handleMapClick (event) {
        this.setState({ newFlatLoc: event.latLng });
        this.fetchDirectionsAll();
    }

    render () {
        const {newFlatLoc, mapCenter, data} = this.state;

        const directionsOpts = {
            draggable: false,
            polylineOptions: {
                strokeOpacity: 0.7,
                strokeWeight: 4,
            }
        };

        return (
            <div id="container">
            <InfoBox people={data} />
            <GoogleMapLoader
                id="map"
                containerElement={
                    <div {...this.props} style={{height: "100%", width: "100%"}} />
                }
                googleMapElement={
                    <GoogleMap
                        ref={(map) => (this._googleMapComponent = map) && console.log(map.getZoom())}
                        defaultZoom={9}
                        defaultCenter={mapCenter}
                        onClick={::this.handleMapClick} >
                    { _.map(data, (person) => {
                        const dirOpts = {
                            ...directionsOpts,
                            polylineOptions: {
                                ...directionsOpts.polylineOptions,
                                strokeColor: person.colour,
                            }
                        };
                        if (person.directions !== undefined)
                            return (
                                <DirectionsRenderer
                                    options={dirOpts}
                                    directions={person.directions} />
                            );
                    }) }
                    </GoogleMap>
                }
            />
            </div>
        );
    }
}

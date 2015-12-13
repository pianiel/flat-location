import {default as React, Component} from "react";
import {default as update} from "react-addons-update";

import {default as canUseDOM} from "can-use-dom";
import {default as _} from "lodash";

import {GoogleMapLoader, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps";
import {triggerEvent} from "react-google-maps/lib/utils";


export default class GettingStarted extends Component {

    state = {
        directionsService: new google.maps.DirectionsService(),
        myrdleStreet: new google.maps.LatLng(51.5155358, -0.0654131),
        travelMode: google.maps.TravelMode.WALKING,
        data: [
            {
                name: 'Piotr',
                office: new google.maps.LatLng(51.5248645, -0.0916461),
                colour: '#0000FF',
                directions: null,
            },
            {
                name: 'Karolina',
                office: new google.maps.LatLng(51.5264841, -0.0804561),
                colour: '#FF0000',
                directions: null,
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
            this.fetchDirections(name, this.state.myrdleStreet, office, this.state.travelMode);
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
        this.setState({ myrdleStreet: event.latLng });
        this.fetchDirectionsAll();

    }

    handleMarkerRightclick (index, event) {
        /*
         * All you modify is data, and the view is driven by data.
         * This is so called data-driven-development. (And yes, it's now in
         * web front end and even with google maps API.)
         */
        var {markers} = this.state;
        markers = update(markers, {
            $splice: [
                [index, 1]
            ],
        });
        this.setState({ markers });
    }

    render () {
        const {myrdleStreet, data} = this.state;

        const directionsOpts = {
            draggable: false,
            polylineOptions: {
                strokeOpacity: 0.7,
                strokeWeight: 5,
            }
        };

        return (
            <GoogleMapLoader
                containerElement={
                    <div {...this.props} style={{height: "100%", width: "100%"}} />
                }
                googleMapElement={
                    <GoogleMap
                        ref={(map) => (this._googleMapComponent = map) && console.log(map.getZoom())}
                        defaultZoom={13}
                        defaultCenter={myrdleStreet}
                        onClick={::this.handleMapClick} >
                    { _.map(data, (person) => {
                        const dirOpts = {
                            ...directionsOpts,
                            polylineOptions: {
                                ...directionsOpts.polylineOptions,
                                strokeColor: person.colour,
                            }
                        };
                        if (person.directions !== null)
                            return (
                                <DirectionsRenderer
                                    options={dirOpts}
                                    directions={person.directions} />
                            );
                    }) }
                    </GoogleMap>
                }
            />
        );
    }
}

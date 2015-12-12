import {default as React, Component} from "react";
import {default as update} from "react-addons-update";

import {default as canUseDOM} from "can-use-dom";
import {default as _} from "lodash";

import {GoogleMapLoader, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps";
import {triggerEvent} from "react-google-maps/lib/utils";


export default class GettingStarted extends Component {

    state = {
        markers: [{
            position: {
                lat: 50,
                lng: 20,
            },
            key: "Poland",
            defaultAnimation: 2
        }],
        origin: new google.maps.LatLng(51.5, -0.1),
        destination: new google.maps.LatLng(51.51, -0.12),
        directions: null,
    }

    constructor (props, context) {
        super(props, context);
        this.handleWindowResize = _.throttle(::this.handleWindowResize, 500);
    }

    componentDidMount () {
        if (!canUseDOM) {
            return;
        }
        window.addEventListener("resize", this.handleWindowResize);



        const DirectionsService = new google.maps.DirectionsService();

        DirectionsService.route({
            origin: this.state.origin,
            destination: this.state.destination,
            travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status == google.maps.DirectionsStatus.OK) {
                this.setState({
                    directions: result
                });
                console.log('fetched directions');
            } else {
                console.error(`error fetching directions ${ result }`);
            }
        });
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
        var {markers} = this.state;
        markers = update(markers, {
            $push: [
                {
                    position: event.latLng,
                    defaultAnimation: 2,
                    key: Date.now(),// Add a key property for: http://fb.me/react-warning-keys
                },
            ],
        });
        this.setState({ markers });

        if (3 === markers.length) {
            this.props.toast(
                "Right click on the marker to remove it",
                "Also check the code!"
            );
        }
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
        const {origin, directions} = this.state;

        return (
            <GoogleMapLoader
                containerElement={
                    <div
                        {...this.props}
                        style={{
                                height: "100%",
                                width: "100%"
                            }}
                              />
                }
                googleMapElement={
                    <GoogleMap
                        ref={(map) => (this._googleMapComponent = map) && console.log(map.getZoom())}
                        defaultZoom={13}
                        defaultCenter={origin}
                        onClick={::this.handleMapClick}>
                                {this.state.markers.map((marker, index) => {
                                     return (
                                         <Marker
                                             {...marker}
                                             onRightclick={this.handleMarkerRightclick.bind(this, index)} />
                                     );
                                 })}
                    { directions ? <DirectionsRenderer directions={directions} /> : null }
                    </GoogleMap>
                }
            />
        );
    }
}

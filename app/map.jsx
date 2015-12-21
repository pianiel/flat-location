import {default as React, Component} from "react";

import {default as canUseDOM} from "can-use-dom";
import {default as _} from "lodash";

import {GoogleMapLoader, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps";
import {triggerEvent} from "react-google-maps/lib/utils";


export default class DirectionsMap extends Component {

    constructor (props, context) {
        super(props, context);
        this.handleWindowResize = _.throttle(::this.handleWindowResize, 500);
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

    render () {

        const { people, mapCenter, onMapClick } = this.props;

        const directionsOpts = {
            draggable: false,
            preserveViewport: true,
            polylineOptions: {
                strokeOpacity: 0.7,
                strokeWeight: 4,
            }
        };

        return (
            <GoogleMapLoader
                containerElement={
                    <div id="map" {...this.props} style={{height: "100%", width: "100%"}} />
                                 }
                googleMapElement={
                    <GoogleMap
                        ref={(map) => this._googleMapComponent = map}
                        defaultZoom={14}
                        defaultCenter={mapCenter}
                        onClick={(event) => {
                                let result = onMapClick(event);
                                let latLngList = [
                                    ..._.map(people, (person) => person.officeLatLng),
                                    event.latLng,
                                ];
                                let bounds = new google.maps.LatLngBounds ();
                                for (var i = 0; i < latLngList.length; i++) {
                                    bounds.extend(latLngList[i]);
                                }
                                this._googleMapComponent.fitBounds(bounds);
                                return result;
                            }} >
                                { _.map(people, (person) => {
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
                                                  key={'directions_renderer-' + person.name}
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


export class MapsDisclaimer extends Component {
    render () {
        if (this.props.container !== undefined) {
            let route = this.props.container.routes[0];

            return (
                <div id="disclaimer">
                    <p><small>{route.warnings[0]}</small></p>
                    <p><small>{route.copyrights}</small></p>
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}

import React, { Component } from "react";
import canUseDOM from "can-use-dom";
import _ from "lodash";
import {
    GoogleMapLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer,
    SearchBox,
} from "react-google-maps";
import { triggerEvent } from "react-google-maps/lib/utils";

import { colours } from './colours';

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


    handleMapClick (event) {
        this.props.onMapClick(event);
        this.fitBoundsToLocations(event.latLng);
    }

    fitBoundsToLocations (location) {
        let latLngList = [
            ..._.map(this.props.people, (person) => person.officeLatLng),
            location,
        ];
        let bounds = new google.maps.LatLngBounds ();
        for (var i = 0; i < latLngList.length; i++) {
            bounds.extend(latLngList[i]);
        }
        this._googleMapComponent.fitBounds(bounds);
    }

    render () {

        const { people, mapCenter, onMapClick, onSearchBoxChanged } = this.props;

        const directionsOpts = {
            draggable: false,
            preserveViewport: true,
            polylineOptions: {
                strokeOpacity: 0.7,
                strokeWeight: 4,
            }
        };

        const searchBoxStyle = {
            border: "1px solid transparent",
            borderRadius: "1px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            boxSizing: "border-box",
            MozBoxSizing: "border-box",
            fontSize: "14px",
            height: "32px",
            marginTop: "9px",
            outline: "none",
            padding: "0 12px",
            textOverflow: "ellipses",
            width: "400px",
        };

        const commutingDirections = people.map((person, index) => {
            const dirOpts = {
                ...directionsOpts,
                polylineOptions: {
                    ...directionsOpts.polylineOptions,
                    strokeColor: colours[index],
                }
            };
            if (person.directions !== undefined)
                return (
                    <DirectionsRenderer
                        key={'directions_renderer-' + person.name}
                        options={dirOpts}
                        directions={person.directions}
                    />
                );
        })

        const searchBox = <SearchBox
                              controlPosition={google.maps.ControlPosition.TOP_LEFT}
                              bounds={this._googleMapComponent ? this._googleMapComponent.getBounds() : null}
                              placeholder="Enter desired location"
                              ref="searchBox"
                              onPlacesChanged={() => {
                                      onSearchBoxChanged(this.refs.searchBox);
                                      const places = this.refs.searchBox.getPlaces();
                                      this.fitBoundsToLocations(places[0].geometry.location)
                                  }}
                              style={searchBoxStyle}
                          />;

        const mapElement = <GoogleMap
                               ref={(map) => this._googleMapComponent = map}
                               defaultZoom={14}
                               defaultCenter={mapCenter}
                               onClick={ ::this.handleMapClick } >
                        { searchBox }
                        { commutingDirections }
        </GoogleMap>;

        return (
            <GoogleMapLoader
                containerElement={ <div id="map" {...this.props} /> }
                googleMapElement={ mapElement }
            />
        );
    }
}


export function MapsDisclaimer(props) {
    return (
        <div id="disclaimer">
            <div>{props.route.warnings[0]}</div>
            <div>{props.route.copyrights}</div>
        </div>
    );
}

import {default as React, Component} from "react";


export default class InfoBox extends Component {

    render () {
        const { people } = this.props;

        return (
            <div id="info">
                <ul>
                    {_.map(people, (person) => {
                         if (person.directions !== undefined) {
                             return (
                                <PersonInfo person={person} key={'info-' + person.name} />
                             );
                         }
                     })}
                </ul>
            </div>
        );
    }
}

function Duration (props) {
    return (
        <div> {Math.floor(props.value / 60.0 * 100) / 100} min </div>
    );
}

function Distance (props) {
    return (
        <div> {Math.floor(props.value / 1000.0 * 10) / 10} km </div>
    );
}

class PersonInfo extends Component {

    render () {
        const { person } = this.props;
        const leg = person.directions.routes[0].legs[0];

        return (
            <li>
                <div>{person.name}</div>
                <Duration value={leg.duration.value} />
                <Distance value={leg.distance.value} />
            </li>
        );
    }

}

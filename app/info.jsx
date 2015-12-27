import {default as React, Component} from "react";
import {Table} from 'react-bootstrap';


export default class InfoBox extends Component {

    render () {
        const { people } = this.props;

        return (
            <div id="info">
                <Table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Who</th>
                            <th>Duration (walking)</th>
                            <th>Distance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(people, (person) => {
                             if (person.directions !== undefined) {
                                 return (
                                     <PersonRow person={person} key={'info-' + person.name} />
                                 );
                             }
                         })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

function formatMetric(value, units, precision) {
    const factor = Math.pow(10, precision);
    return Math.floor(value / units * factor) / factor;
}

function Duration (props) {
    const precision = 1;
    return (
        <span> {formatMetric(props.value, 60, precision)} min </span>
    );
}

function Distance (props) {
    const precision = 1;
    return (
        <span> {formatMetric(props.value, 1000, precision)} km </span>
    );
}

class PersonRow extends Component {

    render () {
        const { person } = this.props;
        const leg = person.directions.routes[0].legs[0];
        const colourBoxStyle = {
            backgroundColor: person.colour,
            width: '15px',
        };

        return (
            <tr>
                <td style={colourBoxStyle}></td>
                <td>{person.name}</td>
                <td> <Duration value={leg.duration.value} /> </td>
                <td> <Distance value={leg.distance.value} /> </td>
            </tr>
        );
    }

}

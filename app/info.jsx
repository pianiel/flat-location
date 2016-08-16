import React, { Component } from "react";
import { Table } from 'react-bootstrap';
import { colours } from './colours';

export default class InfoBox extends Component {
    render () {
        const { people } = this.props;

        const createPersonRow = (person, index) =>
            person.directions && <PersonRow
                                     person={person}
                                     key={'info-' + person.name}
                                     index={ index }
                                 />;
        return (
            <Table>
                <thead>
                    <tr>
                        <th>Who</th>
                        <th>Duration (walking)</th>
                        <th>Distance</th>
                    </tr>
                </thead>
                <tbody>{ people.map(createPersonRow) }</tbody>
            </Table>
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
        <span>{ `${ formatMetric(props.value, 60, precision)} min` }</span>
    );
}

function Distance (props) {
    const precision = 1;
    return (
        <span>{ `${ formatMetric(props.value, 1000, precision) } km` }</span>
    );
}

class PersonRow extends Component {
    render () {
        const { person } = this.props;
        const leg = person.directions.routes[0].legs[0];

        return (
            <tr
                className={ `person-row person-${ this.props.index }` }
                style={{ borderColor: colours[this.props.index] }}
            >
                <td>{ person.name }</td>
                <td><Duration value={ leg.duration.value } /></td>
                <td><Distance value={ leg.distance.value } /></td>
            </tr>
        );
    }
}

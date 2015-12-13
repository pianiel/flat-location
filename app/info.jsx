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


class PersonInfo extends Component {

    render () {
        const { person } = this.props;
        return (
            <li>
                {
                    person.name + ' ' +
                    person.directions.routes[0].legs[0].duration.value + ' ' +
                    person.directions.routes[0].legs[0].distance.value
                }
            </li>
        );
    }

}

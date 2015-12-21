import './index.scss';

import 'bootstrap-sass-loader';


import {default as React} from 'react';
import {default as ReactDOM} from 'react-dom';

import { default as App } from './index.jsx';

ReactDOM.render(<App />, document.getElementById('app'));

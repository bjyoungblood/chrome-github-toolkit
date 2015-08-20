import React, { Component } from 'react';
import Options from './Options';
import Popup from './Popup';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import 'material-design-lite/material.css';
import 'material-design-lite/material.js';

import store from '../utils/store';

export default class App extends Component {
  static propTypes = {
    page: React.PropTypes.string
  }

  render() {
    return (
      <div>
        <Provider store={store}>
          {() => {
            if (this.props.page === 'options') {
              return <Options />;
            } else if (this.props.page === 'popup') {
              return <Popup />;
            }

            return <div>{"Welcome to the page that doesn't exist!"}</div>;
          } }
        </Provider>
        {
          (() => {
            if (__DEVELOPMENT__) {
            // if (false) {
              return (
                <DebugPanel top right bottom>
                  <DevTools store={store}
                            monitor={LogMonitor} />
                </DebugPanel>
              );
            }
          })()
        }
      </div>
    );
  }
}

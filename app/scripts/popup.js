Object.assign = require('object-assign');
window.Promise = require('bluebird');
import React from 'react';
import '../assets/app.css';

chrome.storage.local.get('state', (obj) => {
  let state = obj.state;
  if (state) {
    window.state = JSON.parse(state);
  }

  setTimeout(() => {
    let Root = require('../containers/Root');
    React.render(
      <Root page="popup" />,
      document.querySelector('#root')
    );
  }, 0);
});

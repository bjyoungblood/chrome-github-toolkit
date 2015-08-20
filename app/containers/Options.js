import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Cell } from 'react-mdl';

import OptionsLayout from '../components/options/OptionsLayout';
import ProfileCard from '../components/options/ProfileCard';
import * as Actions from '../actions/Actions';

function select(state) {
  return {
    token: state.token
  };
}

class Options extends Component {
  static propTypes = {
    token: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  render() {
    const { token, dispatch } = this.props;
    const actions = bindActionCreators(Actions, dispatch);

    return (
      <OptionsLayout>
        <Grid>
          <Cell col={12}>
            <h3>Settings</h3>

            <ProfileCard
              onLogin={actions.requestToken}
              onLogout={actions.logout}
              token={token}
            />
          </Cell>
        </Grid>
      </OptionsLayout>
    );
  }

}

export default connect(select)(Options);

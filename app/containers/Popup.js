import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Cell, Card, CardText, Spinner } from 'react-mdl';

import PopupLayout from '../components/PopupLayout';
import ConvertToPR from '../components/ConvertToPR';
import * as Actions from '../actions/Actions';
import getLocation from '../utils/get-location';

function select(state) {
  return {
    token: state.token,
    branches: state.branches,
    pullRequests: state.pullRequests,
    convert: state.convert,
  };
}

class Popup extends Component {
  static propTypes = {
    token: PropTypes.object.isRequired,
    branches: PropTypes.object.isRequired,
    pullRequests: PropTypes.object.isRequired,
    convert: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { token, dispatch } = this.props;
    const actions = bindActionCreators(Actions, dispatch);

    actions.convertPrClear();

    if (! token.token) {
      return;
    }

    getLocation()
      .then((location) => {
        actions.fetchBranches(token.token, location.owner, location.repo);
        actions.fetchPullRequests(token.token, location.owner, location.repo);
      })
      .error((err) => {
        if (err.message === 'Location does not match') {
          return;
        }
        throw err;
      });
  }

  onConvert(opts) {
    getLocation()
      .then((location) => {
        this.props.dispatch(Actions.convertIssue(
          this.props.token.token,
          location.owner,
          location.repo,
          location.issue,
          opts.base,
          opts.head
        ));
      });
  }

  onOpenOptions(event) {
    event.preventDefault();
    chrome.runtime.openOptionsPage();
  }

  renderConversionState() {
    if (this.props.convert.lastError) {
      return (
        <Cell col="12">
          <span className="text__warn">Error! {this.props.convert.lastError}</span>
        </Cell>
      );
    }

    if (! this.props.convert.pullRequest) {
      return null;
    }

    return (
      <div>
        Converted issue #{this.props.convert.pullRequest.number}
      </div>
    );
  }

  renderSetup() {
    return (
      <div>
        Missing Github API token. <a href="#" onClick={this.onOpenOptions}>Fix it!</a>
      </div>
    );
  }

  renderBody() {
    if (this.props.branches.loading || this.props.pullRequests.loading) {
      return (<Spinner />);
    }

    if (this.props.convert.loading) {
      return (<div>Converting...</div>);
    }

    return (
      <ConvertToPR
        branches={this.props.branches.list}
        pullRequests={this.props.pullRequests.list}
        onConvert={this.onConvert.bind(this)}
      />
    );
  }

  render() {
    let body;

    if (! this.props.token.token) {
      body = this.renderSetup();
    } else {
      body = (
        <div>
          <Cell col={12}>
            <span className="mdl-typography--title">Convert to Pull Request</span>
          </Cell>

          {this.renderConversionState()}
          {this.renderBody()}
        </div>
      );
    }

    return (
      <PopupLayout>
        <Grid>

          {body}

        </Grid>
      </PopupLayout>
    );
  }

}

export default connect(select)(Popup);

import React, { Component, PropTypes } from 'react';
import { Grid, Cell, Button } from 'react-mdl';
import BranchList from './BranchList';

class ConvertToPR extends Component {

  static propTypes = {
    onConvert: PropTypes.func.isRequired,
    branches: PropTypes.array.isRequired,
    pullRequests: PropTypes.array.isRequired,
  }

  constructor(...args) {
    super(...args);

    this.state = {
      head: null,
      headOpen: true,
      base: null,
      baseOpen: false,
    };
  }

  onBranchChange(which, branch) {
    if (which === 'head') {
      this.setState({
        head: branch,
        headOpen: false,
        baseOpen: this.state.base ? this.state.baseOpen : true,
      });

      if (branch === this.state.base) {
        this.setState({
          base: null,
          baseOpen: true,
        });
      }
    }

    if (which === 'base') {
      this.setState({
        base: branch,
        baseOpen: false,
      });
    }
  }

  onConvert(event) {
    if (this.state.base && this.state.head) {
      this.props.onConvert({
        head: this.state.head,
        base: this.state.base,
      });
    }
  }

  onToggleHeads() {
    // if a head branch is set, allow to toggle freely
    if (this.state.head) {
      this.setState({
        headOpen: !this.state.headOpen,
        baseOpen: false,
      });

      return;
    }

    this.setState({
      headOpen: true,
      baseOpen: false,
    });
  }

  onToggleBases() {
    if (! this.state.head) {
      return;
    }

    if (this.state.base) {
      this.setState({
        headOpen: false,
        baseOpen: ! this.state.baseOpen,
      });

      return;
    }

    this.setState({
      baseOpen: true,
    });
  }

  getHeadBranches() {
    return this.props.branches
      .filter((branch) => {
        if (branch.name === 'master' || branch.name === 'develop') {
          return false;
        }

        for (let pullRequest of this.props.pullRequests) {
          if (pullRequest.head.ref === branch.name) {
            return false;
          }
        }

        return true;
      })
      .map((branch) => branch.name);
  }

  getBaseBranches() {
    return this.props.branches
      .filter((branch) => branch.name !== this.state.head)
      .sort((a, b) => {
        if (a.name === 'develop' && b.name === 'master') {
          return -1;
        }
        if (a.name === 'master' && b.name === 'develop') {
          return 1;
        }
        if (a.name === 'develop' || a.name === 'master') {
          return -1;
        }
        if (b.name === 'develop' || b.name === 'master') {
          return 1;
        }

        return 0;
      })
      .map((branch) => branch.name);
  }

  renderBaseWarning() {
    if (! this.state.base) {
      return null;
    }

    if (this.state.base === 'develop') {
      return null;
    }

    return (
      <div className="branch-warning text__warn">Are you sure?</div>
    );
  }

  render() {
    if (this.props.branches.length === 0) {
      return (<div>No branches found.</div>);
    }

    return (
      <div className="convert--wrapper">
        <BranchList
          title="Head"
          onChange={this.onBranchChange.bind(this, 'head')}
          onToggle={this.onToggleHeads.bind(this)}
          open={this.state.headOpen}
          branches={this.getHeadBranches()}
          value={this.state.head}
        />
        <BranchList
          title="Base"
          warn={this.state.base && (this.state.base !== 'develop')}
          onChange={this.onBranchChange.bind(this, 'base')}
          onToggle={this.onToggleBases.bind(this)}
          open={this.state.baseOpen}
          branches={this.getBaseBranches()}
          value={this.state.base}
        />
        {this.renderBaseWarning()}
        <Button primary="true" onClick={this.onConvert.bind(this)}>Convert</Button>
      </div>
    );
  }

}

export default ConvertToPR;

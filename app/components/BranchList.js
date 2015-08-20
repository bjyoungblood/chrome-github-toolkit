import React from 'react';
import cx from 'classnames';
import BranchListItem from './BranchListItem';

class BranchList extends React.Component {

  static propTypes = {
    title: React.PropTypes.string.isRequired,
    branches: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onToggle: React.PropTypes.func.isRequired,
    open: React.PropTypes.bool.isRequired,
    warn: React.PropTypes.bool,
    value: React.PropTypes.string,
  };

  constructor(props = {}, context = {}) {
    super(props, context);
  }

  onSelectBranch(branch, event) {
    event.preventDefault();
    this.props.onChange(branch);
  }

  onTitleClick() {
    this.props.onToggle();
  }

  renderTitle() {
    if (! this.props.value) {
      return this.props.title;
    }

    return this.props.title + ': ' + this.props.value;
  }

  render() {
    if (! this.props.branches.length) {
      return (<div>No eligible branches found.</div>);
    }

    let classes = cx({
      'branch-list--container': true,
      'branch-list--container__open': this.props.open,
      'branch-list--container__warn': this.props.warn,
    });

    return (
      <div className={classes}>
        <span
          className="branch-list--title mdl-typography--subhead"
          onClick={this.onTitleClick.bind(this)}
        >{this.renderTitle()}</span>
        <div className="branch-list--wrapper">
          <ul className="branch-list">
            {this.props.branches.map((branch) => {
              return (
                <BranchListItem
                  key={branch}
                  name={branch}
                  onClick={this.onSelectBranch.bind(this, branch)}
                />
              );
            }) }
          </ul>
        </div>
      </div>
    );
  }

}

export default BranchList;

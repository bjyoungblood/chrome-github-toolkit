import React from 'react';

class BranchListItem extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
  }

  render() {
    return (
      <li
        className="branch-list--item"
        key={this.props.name}
        onClick={this.props.onClick}
      >{this.props.name}</li>
    );
  }
}

export default BranchListItem;

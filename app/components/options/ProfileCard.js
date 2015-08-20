import React from 'react';
import {
  Card, CardTitle, CardText, CardActions, Button, Icon, Spinner,
} from 'react-mdl';

class ProfileCard extends React.Component {

  static propTypes = {
    onLogin: React.PropTypes.func.isRequired,
    onLogout: React.PropTypes.func.isRequired,
    token: React.PropTypes.object.isRequired,
  }

  onAuthClick(event) {
    event.preventDefault();

    if (this.props.token.loading) {
      return;
    }

    this.props.onLogin();
  }

  renderCardBody() {
    if (this.props.token.loading) {
      return <Spinner />;
    }

    if (! this.props.token.token) {
      return (
        <h4>Not authenticated.</h4>
      );
    }

    return <div>Authenticated!</div>;
  }

  renderLoginButton() {
    return (
      <Button colored={true} disabled={this.props.token.loading} raised={true} onClick={this.onAuthClick.bind(this)}>
        Log in with Github
      </Button>
    );
  }

  renderCardActions() {
    if (! this.props.token.token) {
      return this.renderLoginButton();
    }

    return (<Button onClick={this.props.onLogout}>Logout</Button>);
  }

  render() {
    return (
      <Card shadowLevel={1} className="options-card">
        <CardTitle expand={true} className="mdl-color--primary mdl-color-text--primary-contrast">
          <h2 className="mdl-card__title-text">Github Login</h2>
        </CardTitle>
        <CardText>
          {this.renderCardBody()}
        </CardText>
        <CardActions border={true}>
          {this.renderCardActions()}
        </CardActions>
      </Card>
    );
  }

}

export default ProfileCard;

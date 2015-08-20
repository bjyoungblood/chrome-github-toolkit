import React from 'react';
import {
  Layout, Header, Content
} from 'react-mdl';

class PopupLayout extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
  }

  render() {
    return (
      <Layout fixedHeader={true}>
        <Header title="Github Toolkit" />
        <Content>
          {this.props.children}
        </Content>
      </Layout>
    );
  }

}

export default PopupLayout;

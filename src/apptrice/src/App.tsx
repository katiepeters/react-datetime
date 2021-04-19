import * as React from 'react';
import { MenuLinkList, SidebarLayout } from './components';
import router from './state/router';
import store from './state/store';

class App extends React.Component {
  render() {
    let CurrentScreen = router.location.matches[0];

    return (
      <SidebarLayout sidebar={ this.renderMenu() } >
        <CurrentScreen
          store={store}
          router={router} />
      </SidebarLayout>
    );
  }

  renderMenu() {
    return (
      <div>
        <h2>Trading bots</h2>
        <MenuLinkList
          backgroundColor="#122e44"
          active={this.getActiveItem()}
          items={this.getMenuItems()} />
      </div>
    );
  }

  getMenuItems() {
    return [
      { id: 'deployments', label: 'Deployments', link: `#/deployments` },
      { id: 'bots', label: 'Bots', link: `#/bots` }
    ]
  }

  getActiveItem() {
    const {pathname} = router.location;

    if( pathname.startsWith('/deployments') ){
      return 'deployments';
    }
    if( pathname.startsWith('/bots')) {
      return 'bots';
    }

    return '';
  }

  componentDidMount() {
    const refresh = () => this.forceUpdate();

    store.addChangeListener( refresh );
    router.onChange( refresh );
  }
}

export default App;
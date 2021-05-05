import * as React from 'react';
import AppMenu from './AppMenu';
import { SidebarLayout } from './components';
import quickStore from './state/quickStore';
import router from './state/router';
import store from './state/store';

class App extends React.Component {
  render() {
    let CurrentScreen = router.location.matches[0];

    return (
      <SidebarLayout sidebar={ this.renderMenu() }
        sidebarWidth={65}
        bgColor="#082238">
        <CurrentScreen
          quickStore={quickStore}
          store={store}
          router={router} />
      </SidebarLayout>
    );
  }

  renderMenu() {
    return (
      <AppMenu currentPath={ router.location.pathname } />
    );
  }

  componentDidMount() {
    const refresh = () => this.forceUpdate();

    store.addChangeListener( refresh );
    quickStore.addChangeListener( refresh );
    router.onChange( refresh );
  }
}

export default App;
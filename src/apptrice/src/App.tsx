import * as React from 'react';
import AppMenu from './AppMenu';
import { SidebarLayout } from './components';
import Toaster from './components/toaster/Toaster';
import quickStore from './state/quickStore';
import router from './state/router';
import store from './state/store';
import localStore from './state/localStore';
import apiClient from './state/apiClient';

class App extends React.Component {
  constructor(props: any) {
    super(props);
    apiClient.initialize(localStore.getApiUrl());
  }

  render() {
    let CurrentScreen = router.location.matches[0];

    return (
      <div>
        <SidebarLayout sidebar={this.renderMenu()}
          sidebarWidth={65}
          bgColor="#082238">
          <CurrentScreen
            quickStore={quickStore}
            store={store}
            router={router}
            localStore={localStore} />
        </SidebarLayout>
        <Toaster />
      </div>
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
    localStore.addChangeListener( refresh );
  }
}

export default App;
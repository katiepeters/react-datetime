import * as React from 'react';
import AppMenu from './AppMenu';
import { SidebarLayout } from './components';
import Toaster from './components/toaster/Toaster';
import quickStore from './state/quickStore';
import router from './state/router';
import store from './state/store';
import localStore from './state/localStore';
import apiClient from './state/apiClient';
import DataLoader from './utils/DataLoader';
import lorese from './state/dataManager';
import { LoreseProvider } from './state/ReactLorese';

class App extends React.Component {
  constructor(props: any) {
    super(props);
    apiClient.initialize(localStore.getApiUrl());
  }

  render() {
    let CurrentScreen = router.location.matches[0];

    return (
      <div>
        <LoreseProvider lorese={lorese}>
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
        </LoreseProvider>
      </div>
    );
  }

  renderMenu() {
    return (
      <AppMenu
        title="Tradingbots"
        items={ menuItems }
        currentPath={ router.location.pathname }
        primary />
    );
  }

  componentDidMount() {
    const refresh = () => this.forceUpdate();

    store.addChangeListener( refresh );
    quickStore.addChangeListener( refresh );
    router.onChange( refresh );
    localStore.addChangeListener( refresh );
    DataLoader.onChange = refresh;
  }
}

const menuItems = [
  { name: 'Deploys', icon: "rocket", link: "#/deployments" },
  {name: 'Bots', icon: "robot", link: "#/bots" },
  {name: 'API accounts', icon: "plug", link: "#/exchanges" },
  { name: 'Settings', icon: "cogs", link: "#/settings" },
];

export default App;
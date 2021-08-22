import * as React from 'react';
import AppMenu from './AppMenu';
import { SidebarLayout } from './components';
import Toaster from './components/toaster/Toaster';
import quickStore from './state/quickStore';
import router from './state/router';
import localStore from './state/localStore';
import apiClient from './state/apiClient';
import DataLoader from './utils/DataLoader';
import * as lorese from './state/dataManager';
import { LoreseConnector } from './state/ReactLorese';
import { getAuthenticatedId } from './state/selectors/account.selectors';

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
            authenticatedId={getAuthenticatedId()}
            quickStore={quickStore}
            router={router}
            localStore={localStore} />
        </SidebarLayout>
        <Toaster />
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


export default LoreseConnector(App, lorese);
import * as React from 'react';
import AppMenu from './AppMenu';
import { SidebarLayout } from './components';
import Toaster from './components/toaster/Toaster';
import router from './state/router';
import apiClient from './state/apiClient';
import DataLoader from './utils/DataLoader';
import * as lorese from './state/stateManager';
import { LoreseConnector } from './state/ReactLorese';
import { getAuthenticatedId } from './state/selectors/account.selectors';
import { getApiUrl } from './state/selectors/environment.selectors';

class App extends React.Component {
  constructor(props: any) {
    super(props);
    apiClient.initialize(getApiUrl());
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
            router={router} />
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
    router.onChange( refresh );
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
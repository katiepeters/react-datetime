import * as React from 'react';
import Menu from './components/Menu';
import router from './state/router';
import store from './state/store';

class App extends React.Component {
  render() {
    let CurrentScreen = router.location.matches[0];

    return (
      <div style={styles.appContainer as React.CSSProperties}>
        <Menu />
        <div style={styles.screen as React.CSSProperties}>
          <CurrentScreen
            store={store}
            router={router} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    const refresh = () => this.forceUpdate();

    store.addChangeListener( refresh );
    router.onChange( refresh );
  }
}

export default App;


const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'stretch',
    minHeight: '100vh'
  },

  screen: {
    display: 'flex',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column'
  }
}
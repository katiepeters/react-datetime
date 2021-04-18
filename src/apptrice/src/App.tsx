import * as React from 'react';
import Menu from './components/Menu';
import router from './state/router';
import store from './state/store';

class App extends React.Component {
  render() {
    let CurrentScreen = router.location.matches[0];

    return (
      <div style={styles.appContainer as React.CSSProperties}>
        <div style={styles.menuWrapper as React.CSSProperties}>
          <Menu />
        </div>
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
    height: '100vh'
  },

  menuWrapper: {
    display: 'flex',
    alignItems: 'stretch',
    width: 200,
  },

  screen: {
    display: 'flex',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
    minWidth: 0
  }
}
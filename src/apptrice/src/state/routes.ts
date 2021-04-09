import HomeScreen from "../screens/home/HomeScreen"
import BotListScreen from '../screens/bots/BotListScreen'
import BotEditorScreen from "../screens/botEditor/BotEditorScreen";
import BacktestingScreen from "../screens/backtesting/BacktestingScreen";

const routes = [
	{path: '/', cb: HomeScreen},
	{path: '/bots', cb: BotListScreen},
	{path: '/botEditor/:id', cb: BotEditorScreen},
	{path: '/backtesting/:id', cb: BacktestingScreen}
];

export default routes;
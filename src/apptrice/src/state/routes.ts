import HomeScreen from "../screens/home/HomeScreen"
import BotListScreen from '../screens/bots/BotListScreen'
import BotEditorScreen from "../screens/botEditor/BotEditorScreen";

const routes = [
	{path: '/', cb: HomeScreen},
	{path: '/bots', cb: BotListScreen},
	{path: '/botEditor/:id', cb: BotEditorScreen}
];

export default routes;
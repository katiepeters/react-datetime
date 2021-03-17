import HomeScreen from "../screens/home/HomeScreen"
import EditorScreen from "../screens/editor/EditorScreen"

const routes = [
	{path: '/', cb: HomeScreen},
	{path: '/editor', cb: EditorScreen}
];

export default routes;
import {createContext} from 'react';

interface LayoutContext {
	bottomHandlers: any,
	sideHandlers: any
}

export default createContext<LayoutContext>({
	bottomHandlers: {},
	sideHandlers: {}
});
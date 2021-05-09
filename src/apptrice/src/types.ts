import localStore from "./state/localStore";
import quickStore from "./state/quickStore";
import store from "./state/store";

export interface ScreenProps {
	store: typeof store,
	router: any,
	quickStore: typeof quickStore,
	localStore: typeof localStore
}

export interface FormCaption {
	type: 'error' | 'warning' | 'info',
	message: any
}
export interface FormErrors {
	[field: string]: FormCaption
}
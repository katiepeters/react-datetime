import localStore from "./state/localStore";
import quickStore from "./state/quickStore";

export interface ScreenProps {
	authenticatedId: string,
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
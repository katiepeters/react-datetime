import localStore from "./state/localStore";

export interface ScreenProps {
	authenticatedId: string,
	router: any,
	localStore: typeof localStore
}

export interface FormCaption {
	type: 'error' | 'warning' | 'info',
	message: any
}
export interface FormErrors {
	[field: string]: FormCaption
}
import quickStore from "./state/quickStore";

export interface ScreenProps {
	store: any,
	router: any,
	quickStore: typeof quickStore
}

export interface FormCaption {
	type: 'error' | 'warning' | 'info',
	message: any
}
export interface FormErrors {
	[field: string]: FormCaption
}
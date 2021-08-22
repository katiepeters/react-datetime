export interface ScreenProps {
	authenticatedId: string,
	router: any
}

export interface FormCaption {
	type: 'error' | 'warning' | 'info',
	message: any
}
export interface FormErrors {
	[field: string]: FormCaption
}
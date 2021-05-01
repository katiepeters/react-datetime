import quickStore from "./state/quickStore";

export interface ScreenProps {
	store: any,
	router: any,
	quickStore: typeof quickStore
}
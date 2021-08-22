import { selector, StoreAccount } from '../dataManager';

export const getAuthenticatedId = selector<void,string>( (store) => {
	return store.authenticatedId;
});

export const getAuthenticatedAccount = selector<void,StoreAccount|void>( (store) => {
	return store.accounts[getAuthenticatedId()];
});

export const getAccount = selector<string,StoreAccount|void>( (store, accountId) => {
	return store.accounts[accountId];
});
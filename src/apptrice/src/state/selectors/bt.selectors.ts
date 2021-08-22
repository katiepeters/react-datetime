import { BtActive } from "../../utils/backtest/Bt.types";
import { selector } from "../stateManager";

export const getActiveBt = selector<void, BtActive|void>( (store) => {
	return store.transientData.activeBt;
});
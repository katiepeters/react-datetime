import Emitter from 'eventemitter3';
import { BotCandles, Orders } from '../../../lambdas/lambda.types';
import { ConsoleEntry } from '../../../lambdas/model.types';
import { BtActive } from '../utils/backtest/Bt.types';

let emitter = new Emitter();
let changeTimer:any = false;

let activeBt: BtActive | undefined;

const quickStore = {
	addChangeListener( clbk: () => void ){
		return emitter.on('change', clbk);
	},
	removeChangeListener( clbk: () => void  ){
		return emitter.off('change', clbk);
	},
	emitChange() {
		if( changeTimer ) return;
		changeTimer = setTimeout( () => {
			changeTimer = false;
			emitter.emit('change');
		});
	},

	getActiveBt(): BtActive | undefined {
		return activeBt;
	},

	setActiveBt( bt: BtActive | undefined ){
		activeBt = bt;
		this.emitChange();
	}
}

export default quickStore;
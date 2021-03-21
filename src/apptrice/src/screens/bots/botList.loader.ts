import store from '../../state/store'
import apiCacher, { DbBot } from '../../state/apiCacher'
import DataLoader, { DataLoaderConfig } from '../../utils/DataLoader'

const config: DataLoaderConfig<DbBot[]> = {
	getFromCache(id: string): DbBot[] | undefined {
		let account = store.accounts[id];
		if( account && account.bots ){
			return account.bots.map( (botId:string) => store.bots[botId] );
		}
	},
	loadData(id: string){
		return apiCacher.loadBotList( id );
	}
}

export default new DataLoader<DbBot[]>(config);
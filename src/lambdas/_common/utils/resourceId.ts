import slugid from 'slugid';

interface CompoundId {
	resourceId: string,
	accountId: string
}

interface TripleId {
	resourceId: string,
	parentId: string,
	accountId: string
}

export function createId(): string {
	return slugid.nice();
}

export function createResourceId(accountId: string): string {
	return slugid.nice() + accountId;
}

export function parseId(id: string): CompoundId {
	return {
		resourceId: id.slice(0,22),
		accountId: id.slice(22)
	}
}

export function parseTripleId(id: string): TripleId {
	return {
		resourceId: id.slice(0,22),
		parentId: id.slice(22,44),
		accountId: id.slice(44)
	}
}

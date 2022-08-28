export interface ClanOrPlayer {
	name: string;
	tag: string;
}

export interface ClanAlias extends ClanOrPlayer {
	alias: string;
}

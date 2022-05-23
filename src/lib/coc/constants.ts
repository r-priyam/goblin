export const Troops: { [key: number]: string } = {
	// elixir troops
	0: 'Barbarian',
	1: 'Archer',
	2: 'Goblin',
	3: 'Giant',
	4: 'Wall Breaker',
	5: 'Balloon',
	6: 'Wizard',
	7: 'Healer',
	8: 'Dragon',
	9: 'P.E.K.K.A',
	23: 'Baby Dragon',
	24: 'Miner',
	53: 'Yeti',
	59: 'Electro Dragon',
	65: 'Dragon Rider',

	// dark troops
	10: 'Minion',
	11: 'Hog Rider',
	12: 'Valkyrie',
	13: 'Golem',
	15: 'Witch',
	17: 'Lava Hound',
	22: 'Bowler',
	58: 'Ice Golem',
	82: 'Headhunter',

	// super troops
	26: 'Super Barbarian',
	27: 'Super Archer',
	28: 'Super Wall Breaker',
	29: 'Super Giant',
	55: 'Sneaky Goblin',
	57: 'Rocket Balloon',
	63: 'Inferno Dragon',
	64: 'Super Valkyrie',
	66: 'Super Witch',
	76: 'Ice Hound',
	80: 'Super Bowler',
	81: 'Super Dragon',
	83: 'Super Wizard',
	84: 'Super Minion',

	// special troops
	47: 'Royal Ghost',

	// siege machines
	51: 'Wall Wrecker',
	52: 'Battle Blimp',
	62: 'Stone Slammer',
	75: 'Siege Barracks',
	87: 'Log Launcher',
	91: 'Flame Flinger'
};

export const Spells: { [key: number]: string } = {
	0: 'Lightning Spell',
	1: 'Healing Spell',
	2: 'Rage Spell',
	3: 'Jump Spell',
	5: 'Freeze Spell',
	9: 'Poison Spell',
	10: 'Earthquake Spell',
	11: 'Haste Spell',
	16: 'Clone Spell',
	17: 'Skeleton Spell',
	28: 'Bat Spell',
	35: 'Invisibility Spell'
};

export const ErrorMessages: { [key: string]: string } = {
	500: 'Something went wrong when requesting from the API.',
	504: 'Request to API was timed out, Please try again!',
	503: 'Game API is under maintenance, try again after it ends.',
	429: 'Request was throttled, because amount of requests was above the threshold defined for the used API token.'
};

export const RawPosition: { [key: string]: string } = {
	leader: 'Leader',
	coLeader: 'Co-Leader',
	admin: 'Elder',
	member: 'Member'
};

export const RawWarFrequency: { [key: string]: string } = {
	always: 'Always',
	moreThanOncePerWeek: 'More than once per week',
	oncePerWeek: 'Once per week',
	lessThanOncePerWeek: 'Less than once per week',
	never: 'Never',
	unknown: 'Not set'
};

export const RawClanType: { [key: string]: string } = {
	open: 'Open',
	inviteOnly: 'Invite Only',
	closed: 'Closed'
};

export const LeagueEmotes: { [key: number]: string } = {
	29_000_000: '<:Unranked:601618883853680653>',
	29_000_001: '<:BronzeLeagueIII:601611929311510528>',
	29_000_002: '<:BronzeLeagueII:601611942850986014>',
	29_000_003: '<:BronzeLeagueI:601611950228635648>',
	29_000_004: '<:SilverLeagueIII:601611958067920906>',
	29_000_005: '<:SilverLeagueII:601611965550428160>',
	29_000_006: '<:SilverLeagueI:601611974849331222>',
	29_000_007: '<:GoldLeagueIII:601611988992262144>',
	29_000_008: '<:GoldLeagueII:601611996290613249>',
	29_000_009: '<:GoldLeagueI:601612010492526592>',
	29_000_010: '<:CrystalLeagueIII:601612021472952330>',
	29_000_011: '<:CrystalLeagueII:601612033976434698>',
	29_000_012: '<:CrystalLeagueI:601612045359775746>',
	29_000_013: '<:MasterLeagueIII:601612064913621002>',
	29_000_014: '<:MasterLeagueII:601612075474616399>',
	29_000_015: '<:MasterLeagueI:601612085327036436>',
	29_000_016: '<:ChampionLeagueIII:601612099226959892>',
	29_000_017: '<:ChampionLeagueII:601612113345249290>',
	29_000_018: '<:ChampionLeagueI:601612124447440912>',
	29_000_019: '<:TitanLeagueIII:601612137491726374>',
	29_000_020: '<:TitanLeagueII:601612148325744640>',
	29_000_021: '<:TitanLeagueI:601612159327141888>',
	29_000_022: '<:LegendLeague:601612163169255436>'
};

export const WarLeagueEmotes: { [key: string]: string } = {
	Unranked: '<:Unranked:601618883853680653>',
	'Bronze League I': '<:BronzeLeagueI:774314462789369876>',
	'Bronze League II': '<:BronzeLeagueII:774314462161272864>',
	'Bronze League III': '<:BronzeLeagueIII:774314462629986304>',
	'Silver League I': '<:SilverLeagueI:774314463054266398>',
	'Silver League II': '<:SilverLeagueII:774314463091884042>',
	'Silver League III': '<:SilverLeagueIII:774314463204999208>',
	'Gold League I': '<:GoldLeagueI:774314462664327189>',
	'Gold League II': '<:GoldLeagueII:774314462974443540>',
	'Gold League III': '<:GoldLeagueIII:774314463045091378>',
	'Crystal League I': '<:CrystalLeagueI:774314462895013978>',
	'Crystal League II': '<:CrystalLeagueII:774314462534041642>',
	'Crystal League III': '<:CrystalLeagueIII:774314462995284019>',
	'Master League I': '<:MasterLeagueI:774314463049285662>',
	'Master League II': '<:MasterLeagueII:774314463263719425>',
	'Master League III': '<:MasterLeagueIII:774314463116656660>',
	'Champion League I': '<:ChampionLeagueI:774314462693949490>',
	'Champion League II': '<:ChampionLeagueII:774314462605082684>',
	'Champion League III': '<:ChampionLeagueIII:774314462693425183>'
};

export const LabelEmotes: { [key: string]: string } = {
	'Active Daily': '<:ActiveDaily:701551994351124682>',
	'Active Donator': '<:ActiveDonator:701551993944277013>',
	'Amateur Attacker': '<:AmateurAttacker:701551994372096111>',
	'Base Designing': '<:BaseDesigning:701551994015580261>',
	'Builder Base': '<:BuilderBase:701551994250330152>',
	'Clan Capital': '<:ClanCapital:975463242048622682>',
	'Clan Games': '<:ClanGames:701551994279559248>',
	'Clan Wars': '<:ClanWars:701551994321633302>',
	'Clan War League': '<:ClanWarLeague:701551994288078848>',
	Competitive: '<:Competitive:701551994283753513>',
	Donations: '<:Donations:701551994468565104>',
	Farming: '<:Farming:701551994833207307>',
	'Friendly Wars': '<:FriendlyWars:701551994598326384>',
	Friendly: '<:Friendly:701551994384416901>',
	'Hungry Learner': '<:HungryLearner:701551994472628236>',
	International: '<:International:701551994606714881>',
	Newbie: '<:Newbie:701551994556383273>',
	Relaxed: '<:Relaxed:701551994736869387>',
	Talkative: '<:Talkative:701551994393067633>',
	Teacher: '<:Teacher:701551994766229604>',
	'Trophy Pushing': '<:TrophyPushing:701551994669629501>',
	Underdog: '<:Underdog:701551994585743432>',
	Veteran: '<:Veteran:701551996263596124>'
};

export const HomeBaseTroopEmotes: { [key: string]: string } = {
	Barbarian: '<:Barbarian:701626910207115274>',
	Archer: '<:Archer:701626909498409040>',
	Giant: '<:Giant:701626915026370671>',
	Goblin: '<:Goblin:701626915165044828>',
	'Wall Breaker': '<:wallbreaker:763264884040663040>',
	Balloon: '<:Balloon:701626912241352745>',
	Wizard: '<:Wizard:701626914841821186> ',
	Healer: '<:Healer:701626914930163783>',
	Dragon: '<:Dragon:701626910752374804>',
	'P.E.K.K.A': '<:PEKKA:701626915328491610>',
	'Baby Dragon': '<:BabyDragon:701626909586358364>',
	Miner: '<:Miner:701626913793245255>',
	'Electro Dragon': '<:ElectroDragon:701626910735728672>',
	Yeti: '<:Yeti:701626914816655431>',
	'Dragon Rider': '<:DragonRider:854373772412977152>',
	Minion: '<:Minion:701626915311583294>',
	'Hog Rider': '<:HogRider:701626914506276895>',
	Valkyrie: '<:Valkyrie:701626915680681994>',
	Golem: '<:Golem:701626915395600394>',
	Witch: '<:Witch:701626915173433385> ',
	'Lava Hound': '<:LavaHound:701626915479355483>',
	Bowler: '<:Bowler:701626910614093844>',
	'Ice Golem': '<:IceGolem:701626913701101668>',
	Headhunter: '<:Headhunter:742121658386481262>'
};

export const BuilderBaseTroopEmotes: { [key: string]: string } = {
	'Raged Barbarian': '<:RagedBarbarian:701625285107515462>',
	'Sneaky Archer': '<:SneakyArcher:701625285279219765>',
	'Boxer Giant': '<:BoxerGiant:701625285061115915>',
	'Beta Minion': '<:BetaMinion:701625285069504562>',
	Bomber: '<:Bomber:701625279562383410>',
	'Baby Dragon': '<:BabyDragon:701625278849351721>',
	'Cannon Cart': '<:CannonCart:701625284847206400>',
	'Night Witch': '<:NightWitch:701625285161910372>',
	'Drop Ship': '<:DropShip:701625285061115955>',
	'Super P.E.K.K.A': '<:SuperPEKKA:701625285031886941>',
	'Hog Glider': '<:HogGlider:701625283354296331>'
};

export const SpellEmotes: { [key: string]: string } = {
	'Lightning Spell': '<:LightningSpell:742119333974638602>',
	'Healing Spell': '<:HealingSpell:701613920368066660>',
	'Rage Spell': '<:RageSpell:701613920703611003>',
	'Jump Spell': '<:JumpSpell:701613920355352596>',
	'Freeze Spell': '<:FreezeSpell:742119333538299954>',
	'Clone Spell': '<:CloneSpell:701613916542992445>',
	'Invisibility Spell': '<:InvisibilitySpell:785540460914671646>',
	'Poison Spell': '<:PoisonSpell:701613920011550722>',
	'Earthquake Spell': '<:EarthquakeSpell:701613918396612629>',
	'Haste Spell': '<:HasteSpell:701613920045236316>',
	'Skeleton Spell': '<:SkeletonSpell:701613919948636282>',
	'Bat Spell': '<:BatSpell:701613916198797402>'
};

export const HeroEmotes: { [key: string]: string } = {
	'Barbarian King': '<:BarbarianKing:838081409850671114>',
	'Archer Queen': '<:ArcherQueen:838081404125970484>',
	'Grand Warden': '<:GrandWarden:838081425671716895>',
	'Royal Champion': '<:RoyalChampion:838081414448283698>',
	'Battle Machine': '<:BattleMachine:838081431905239050>'
};

export const HeroPetEmotes: { [key: string]: string } = {
	'L.A.S.S.I': '<:LASSI:830510531168829521>',
	'Electro Owl': '<:ElectroOwl:830511434269982790>',
	'Mighty Yak': '<:MightyYak:830510531222962278>',
	Unicorn: '<:Unicorn:830510531483795516>'
};

export const SiegeMachineEmotes: { [key: string]: string } = {
	'Wall Wrecker': '<:WallWrecker:701628825142034482>',
	'Battle Blimp': '<:BattleBlimp:701628824395317328>',
	'Stone Slammer': '<:StoneSlammer:701628824688918588>',
	'Siege Barracks': '<:SiegeBarracks:701628824651169913>',
	'Log Launcher': '<:LogLauncher:785540240358113312>',
	'Flame Flinger': '<:FlameFlinger:918875579904847873>'
};

export const SuperTroopEmotes: { [key: string]: string } = {
	'Super Barbarian': '<:SuperBarbarian:701626916087529673>',
	'Super Archer': '<:SuperArcher:750010593045643355>',
	'Super Giant': '<:SuperGiant:701626915902980197>',
	'Sneaky Goblin': '<:SneakyGoblin:701626916129734787>',
	'Super Wall Breaker': '<:SuperWallBreaker:701626916133666896>',
	'Rocket Balloon': '<:RocketBalloon:854368171682431006>',
	'Super Wizard': '<:SuperWizard:785536616864153610>',
	'Super Dragon': '<:SuperDragon:918876075809964072>',
	'Inferno Dragon': '<:InfernoDragon:742121658386743366>',
	'Super Minion': '<:SuperMinion:771375748916576286>',
	'Super Valkyrie': '<:SuperValkyrie:771375748815519825>',
	'Super Witch': '<:SuperWitch:742121660324511818>',
	'Ice Hound': '<:IceHound:785539963068481546>',
	'Super Bowler': '<:SuperBowler:892035736168185876>'
};

export const MiscEmotes: { [key: string]: string } = {
	Info: '<:Info:978189428138836058>',
	Leader: '<:Crown:836470125255327774>',
	'Co-Leader': '',
	Elder: '',
	Member: '',
	Win: '<:Win:976663857974104064>',
	Lose: '<:Lose:882707645964898325>',
	Draw: '<:Draw:882860602186412033>',
	Streak: '<:Streak:882701330035114067>',
	HomeTrophy: '<:HomeTrophy:976670888424534026>',
	BuilderTrophy: '<:BuilderTrophy:836314424469094464>',
	Members: '<:Members:976673068908945450>',
	TownHall: '<:Hall:976733387857485854>',
	Exp: '<:Exp:978130453133418536>',
	Gold: '<:Gold:978127614910816267>',
	Elixir: '<:Elixir:978127550872178788>',
	Dark: '<:Dark:978127674709016586>',
	ClanGold: '<:ClanGold:978127724096942101>',
	ClanGames: '<:ClanGames:978129366066278400>',
	WarStars: '<:WarStars:978129022410166282>',
	GoldStar: '<:GoldStar:978187920475291679>',
	Sword: '<:Sword:978173762795110401>',
	Shield: '<:Shield:978181796523020308>',
	In: '<:In:978176368238026773>',
	Out: '<:Out:978174817708683294>',
	Clan: '<:Clan:978180829643681802>',
	SiegeDonations: '<:SiegeDonations:978184895530688533>',
	TroopDonations: '<:TroopDonations:978184984168894465>',
	SpellDonations: '<:SpellDonations:978185026216808488>'
};

export const TownHallEmotes: { [key: string | number]: string } = {
	1: '<:01:768856748848840784>',
	2: '<:02:768856766481956934>',
	3: '<:03:768856819468206130>',
	4: '<:04:768856818532745218>',
	5: '<:05:768856818800787476>',
	6: '<:06:768856819656949780>',
	7: '<:07:768856819241975819>',
	8: '<:08:768856818646384671>',
	9: '<:09:768856818649661470>',
	10: '<:10:768856818361171968>',
	11: '<:11:768856818679414794>',
	12: '<:12:768856866314780713>',
	13: '<:13:768828624538697728>',
	14: '<:14:860768790596812800>'
};

export const BlueNumberEmotes: { [key: number]: string } = {
	1: '<:01:813801187727245422>',
	2: '<:02:813801187992141824>',
	3: '<:03:813801187882172466>',
	4: '<:04:813801188809375764>',
	5: '<:05:813801189417156638>',
	6: '<:06:813801188810162187>',
	7: '<:07:813801189622939648>',
	8: '<:08:813801189401034812>',
	9: '<:09:813801189127749722>',
	10: '<:10:813801189518737438>',
	11: '<:11:813801189581914162>',
	12: '<:12:813801189321736222>',
	13: '<:13:813801189425545226>',
	14: '<:14:813801188968366110>',
	15: '<:15:813801189765939220>',
	16: '<:16:813801189308760114>',
	17: '<:17:813801189032460328>',
	18: '<:18:813801189397233684>',
	19: '<:19:813801190302154752>',
	20: '<:20:813801190335709204>',
	21: '<:21:813801189316624464>',
	22: '<:22:813801190265061417>',
	23: '<:23:813801189275598899>',
	24: '<:24:813801190138576898>',
	25: '<:25:813801190339903498>',
	26: '<:26:813801189560942612>',
	27: '<:27:813801190290489345>',
	28: '<:28:813801189929910344>',
	29: '<:29:813801189165629470>',
	30: '<:30:813801188981211187>',
	31: '<:31:813801189426331690>',
	32: '<:32:813801189413748747>',
	33: '<:33:813803157230452746>',
	34: '<:34:813801190088638544>',
	35: '<:35:813801190294028288>',
	36: '<:36:813801189372067911>',
	37: '<:37:813801189992824912>',
	38: '<:38:813801189019615233>',
	39: '<:39:813801189162483752>',
	40: '<:40:813801189032460378>',
	41: '<:41:813801189166153768>',
	42: '<:42:813801189161959454>',
	43: '<:43:813801189145575444>',
	44: '<:44:813801189774589962>',
	45: '<:45:813801189136269348>',
	46: '<:46:813801190377652234>',
	47: '<:47:813801189137317948>',
	48: '<:48:813801189174804510>',
	49: '<:49:813801190353666048>',
	50: '<:50:813801189258035210>'
};

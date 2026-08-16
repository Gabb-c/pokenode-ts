import { MainClient } from "@clients";
import { ENDPOINTS } from "@constants";
import { type Case, caseFor, mistypedFields, sortKeys } from "../helpers/model-keys";

/**
 * Tier 3: the only suite that talks to the real PokéAPI.
 *
 * It exists to answer one question the hermetic suites structurally cannot —
 * *has the upstream response shape changed?* — so it asserts the key set of one
 * stable resource per model rather than any particular value. A failure here is
 * upstream drift, and means `src/models` is out of date; it is not a regression
 * in the client.
 *
 * A case names a model and says how to fetch one. The keys it expects are read
 * out of `src/models` by {@link caseFor}, so there is no list here to fall out
 * of step with a type: a model that gains a field needs no edit to this file.
 * The compiler checks that the fetch really does return the model named.
 *
 * Coverage is deliberately total: every endpoint in `src/constants/endpoints.ts`
 * has a case, and so does every shape reachable from one. A model with no case
 * is a model that can drift silently, which is the one failure mode this tier
 * exists to prevent.
 *
 * Key sets are all this checks. A field that keeps its name but changes type —
 * `base_experience` going `number` to `null`, an object becoming a list — still
 * passes, and no amount of extra resources here would catch it. Widening the
 * assertion to values would trade that for a suite that fails on every ordinary
 * content update, which is the worse deal.
 *
 * The client is shared, so every case below re-reads a resource an earlier one
 * already fetched from cache instead of asking the API again.
 *
 * Runs on a schedule, never on a pull request. See `.github/workflows/live.yml`.
 */

const client = new MainClient();

/** The index the API serves at its root, listing every endpoint it offers. */
const INDEX_URL = "https://pokeapi.co/api/v2/";

/**
 * Endpoints the client deliberately does not model.
 *
 * `/meta` reports the deploy the API is running — commit hash, deploy date, tag
 * — rather than any Pokémon data, so there is nothing for `src/models` to say
 * about it.
 */
const UNMODELLED = new Set(["/meta"]);

/**
 * Picks the sample a nested case asserts against. An empty list is drift in its
 * own right — it would leave the case asserting nothing — so it fails here
 * rather than passing silently.
 */
const sample = <T>(items: readonly T[], what: string): T => {
  const [item] = items;

  if (item === undefined) {
    throw new Error(`The PokéAPI returned no ${what} to check`);
  }

  return item;
};

/**
 * Unwraps a nullable field a nested case digs through. Each caller picks a
 * resource that populates the field, so a `null` here is drift too.
 */
const present = <T>(value: T | null | undefined, what: string): T => {
  if (value === null || value === undefined) {
    throw new Error(`The PokéAPI returned no ${what} to check`);
  }

  return value;
};

/*
 * Resources several cases share. Each is a thunk rather than a value so the
 * suite stays lazy, and the client cache means the second caller never hits the
 * network.
 */
const berry = () => client.berry.getBerryByName("cheri");
const contestEffect = () => client.contest.getContestEffectById(1);
const locationArea = () => client.location.getLocationAreaByName("canalave-city-area");
const itemPocket = () => client.item.getItemPocketByName("misc");
const masterBall = () => client.item.getItemByName("master-ball");
/** Master Ball is held by nothing; Leftovers is. */
const leftovers = () => client.item.getItemByName("leftovers");
const pound = () => client.move.getMoveByName("pound");
/** Pound is taught by no TM or HM, so it carries no machines to sample. */
const thunderbolt = () => client.move.getMoveByName("thunderbolt");
/** Pound's stats have never been changed, and it lowers nothing. */
const tackle = () => client.move.getMoveByName("tackle");
const swordsDance = () => client.move.getMoveByName("swords-dance");
const ability = () => client.pokemon.getAbilityByName("stench");
const nature = () => client.pokemon.getNatureByName("hardy");
const pokeathlonStat = () => client.pokemon.getPokeathlonStatByName("speed");
const pokemonShape = () => client.pokemon.getPokemonShapeByName("ball");
const species = () => client.pokemon.getPokemonSpeciesByName("bulbasaur");
/** HP is affected by no move and no nature; Attack is affected by both. */
const attackStat = () => client.pokemon.getStatByName("attack");
const hpStat = () => client.pokemon.getStatByName("hp");
const normalType = () => client.pokemon.getTypeByName("normal");
/** Normal's damage relations have never changed; Dark's did in Generation VI. */
const darkType = () => client.pokemon.getTypeByName("dark");
const bulbasaur = () => client.pokemon.getPokemonByName("bulbasaur");
const bulbasaurForm = () => client.pokemon.getPokemonFormByName("bulbasaur");
/** Bulbasaur holds nothing and is caught in no wild area; Pikachu does both. */
const pikachu = () => client.pokemon.getPokemonByName("pikachu");
/** Bulbasaur has never been retyped, lost an ability, or had its stats revised. */
const clefairy = () => client.pokemon.getPokemonByName("clefairy");
const gengar = () => client.pokemon.getPokemonByName("gengar");
const butterfree = () => client.pokemon.getPokemonByName("butterfree");
const gender = () => client.pokemon.getGenderByName("female");
const pokedex = () => client.game.getPokedexByName("kanto");

/**
 * Shapes reached by digging through another resource. Each step of a dig gets
 * its own thunk so a case body stays a single reference — nesting the digs
 * inline instead would re-derive the same chain once per case.
 */
const berryItem = async () => (await berry()).item;
const berryFlavorMap = async () => sample((await berry()).flavors, "berry flavor");
const pocketName = async () => sample((await itemPocket()).names, "name");
const contestTypeName = async () =>
  sample((await client.contest.getContestTypeByName("cool")).names, "contest name");
const contestEffectFlavorText = async () =>
  sample((await contestEffect()).flavor_text_entries, "contest flavor text");
const flingEffectEntry = async () =>
  sample((await client.item.getItemFlingEffectByName("badly-poison")).effect_entries, "effect");
const itemPrice = async () => sample((await masterBall()).prices, "item price");
const itemSprites = async () => (await masterBall()).sprites;
const itemEffect = async () => sample((await masterBall()).effect_entries, "effect entry");
const itemFlavorText = async () =>
  sample((await masterBall()).flavor_text_entries, "flavor text entry");
const itemGameIndex = async () => sample((await masterBall()).game_indices, "game index");
const itemHolder = async () => sample((await leftovers()).held_by_pokemon, "item holder");
const itemHolderVersion = async () =>
  sample((await itemHolder()).version_details, "item holder version");
const machineVersionDetail = async () =>
  sample((await thunderbolt()).machines, "machine version detail");
const moveMeta = async () => present((await pound()).meta, "move meta data");
const contestCombos = async () => present((await pound()).contest_combos, "contest combo set");
const contestComboDetail = async () => (await contestCombos()).normal;
const moveFlavorText = async () => sample((await pound()).flavor_text_entries, "move flavor text");
const pastMoveStatValues = async () =>
  sample((await tackle()).past_values, "past move stat values");
const moveStatChange = async () => sample((await swordsDance()).stat_changes, "move stat change");
const damageClassDescription = async () =>
  sample((await client.move.getMoveDamageClassByName("status")).descriptions, "description");
const growthRateLevel = async () =>
  sample((await client.pokemon.getGrowthRateByName("slow")).levels, "level");
const palParkEncounter = async () =>
  sample(
    (await client.location.getPalParkAreaByName("forest")).pokemon_encounters,
    "pal park encounter",
  );
const encounterMethodRate = async () =>
  sample((await locationArea()).encounter_method_rates, "encounter method rate");
const encounterVersionDetails = async () =>
  sample((await encounterMethodRate()).version_details, "encounter version details");
const areaPokemonEncounter = async () =>
  sample((await locationArea()).pokemon_encounters, "pokemon encounter");
const pokedexEntry = async () => sample((await pokedex()).pokemon_entries, "pokedex entry");
const abilityEffectChange = async () => sample((await ability()).effect_changes, "effect change");
const abilityFlavorText = async () =>
  sample((await ability()).flavor_text_entries, "ability flavor text");
const abilityPokemon = async () => sample((await ability()).pokemon, "ability pokemon");
const genderSpecies = async () =>
  sample((await gender()).pokemon_species_details, "pokemon species gender");
const natureStatChange = async () =>
  sample((await nature()).pokeathlon_stat_changes, "nature stat change");
const battleStylePreference = async () =>
  sample((await nature()).move_battle_style_preferences, "move battle style preference");
const pokeathlonAffectSets = async () => (await pokeathlonStat()).affecting_natures;
const pokeathlonAffect = async () =>
  sample((await pokeathlonAffectSets()).increase, "pokeathlon stat affect");
const awesomeName = async () => sample((await pokemonShape()).awesome_names, "awesome name");
const genus = async () => sample((await species()).genera, "genus");
const speciesDexEntry = async () => sample((await species()).pokedex_numbers, "pokedex number");
const palParkEncounterArea = async () =>
  sample((await species()).pal_park_encounters, "pal park encounter area");
const speciesVariety = async () => sample((await species()).varieties, "variety");
const speciesFlavorText = async () =>
  sample((await species()).flavor_text_entries, "species flavor text");
const statAffectingMoves = async () => (await attackStat()).affecting_moves;
const statAffectingNatures = async () => (await attackStat()).affecting_natures;
const moveStatAffect = async () => sample((await statAffectingMoves()).increase, "affecting move");
const characteristicResource = async () =>
  sample((await hpStat()).characteristics, "characteristic");
const typePokemon = async () => sample((await normalType()).pokemon, "type pokemon");
const typeRelations = async () => (await normalType()).damage_relations;
const typeRelationsPast = async () =>
  sample((await darkType()).past_damage_relations, "past damage relations");
const typeSprites = async () => (await normalType()).sprites;

/*
 * The Pokémon sprite tree. Every generation is its own model, and upstream adds
 * to it whenever a new game ships, so each level gets its own case.
 */
const pokemonSprites = async () => (await bulbasaur()).sprites;
const otherSprites = async () => present((await pokemonSprites()).other, "other sprites");
const versionSprites = async () => (await pokemonSprites()).versions;
const generationISprites = async () => (await versionSprites())["generation-i"];
const generationIISprites = async () => (await versionSprites())["generation-ii"];
const generationIIISprites = async () => (await versionSprites())["generation-iii"];
const generationIVSprites = async () => (await versionSprites())["generation-iv"];
const generationVSprites = async () => (await versionSprites())["generation-v"];
const generationVISprites = async () => (await versionSprites())["generation-vi"];
const generationVIISprites = async () => (await versionSprites())["generation-vii"];
const generationVIIISprites = async () => (await versionSprites())["generation-viii"];
const generationIXSprites = async () => (await versionSprites())["generation-ix"];
const blackWhiteSprites = async () => (await generationVSprites())["black-white"];
const formSprites = async () => (await bulbasaurForm()).sprites;
const formVersionSprites = async () => (await formSprites()).versions;

/*
 * Pikachu's wild encounters. The dig is four levels deep, so each level is
 * named rather than nested into the case that needs it.
 */
const pikachuEncounters = async () =>
  client.pokemon.getPokemonLocationAreaById((await pikachu()).id);
const encounterArea = async () => sample(await pikachuEncounters(), "location area encounter");
const encounterVersion = async () =>
  sample((await encounterArea()).version_details, "version encounter detail");
const encounterDetail = async () =>
  sample((await encounterVersion()).encounter_details, "encounter");
/**
 * Most encounters constrain nothing about the Pokémon they yield and so carry a
 * `null` here; the first one that does not is what this case asserts against.
 */
const encounterPokemonDetail = async () =>
  present(
    (await pikachuEncounters())
      .flatMap((area) => area.version_details)
      .flatMap((version) => version.encounter_details)
      .map((detail) => detail.pokemon_details)
      .find((details) => details !== null),
    "encounter pokemon detail",
  );

const heldItem = async () => sample((await pikachu()).held_items, "held item");
const heldItemVersion = async () => sample((await heldItem()).version_details, "held item version");
const pokemonAbility = async () => sample((await bulbasaur()).abilities, "ability");
const pokemonType = async () => sample((await bulbasaur()).types, "type");
const pokemonStat = async () => sample((await bulbasaur()).stats, "stat");
const pokemonMove = async () => sample((await bulbasaur()).moves, "pokemon move");
const pokemonMoveVersion = async () =>
  sample((await pokemonMove()).version_group_details, "move version");
const pokemonGameIndex = async () => sample((await bulbasaur()).game_indices, "game index");
const pastType = async () => sample((await clefairy()).past_types, "past type");
const pastAbility = async () => sample((await gengar()).past_abilities, "past ability");
const pastAbilitySlot = async () => sample((await pastAbility()).abilities, "past ability slot");
const pastStat = async () => sample((await butterfree()).past_stats, "past stat");
const formCondition = async () =>
  sample(
    // Darmanitan's zen mode is the case that carries `base_form`; a form
    // triggered by a held item, such as a Mega Stone, omits it.
    (await client.pokemon.getPokemonFormByName("darmanitan-zen")).trigger_conditions,
    "form trigger condition",
  );

const evolutionChain = () => client.evolution.getEvolutionChainById(2);
const chainLink = async () => (await evolutionChain()).chain;
const evolvesTo = async () => sample((await chainLink()).evolves_to, "evolution");
const evolutionDetail = async () =>
  sample((await evolvesTo()).evolution_details, "evolution detail");

/** One resource per endpoint in `src/constants/endpoints.ts`. */
const RESOURCES: Case[] = [
  caseFor("Berry", berry),
  caseFor("BerryFirmness", () => client.berry.getBerryFirmnessByName("very-soft")),
  caseFor("BerryFlavor", () => client.berry.getBerryFlavorByName("spicy")),
  caseFor("ContestType", () => client.contest.getContestTypeByName("cool")),
  caseFor("ContestEffect", contestEffect),
  caseFor("SuperContestEffect", () => client.contest.getSuperContestEffectById(1)),
  caseFor("Currency", () => client.currency.getCurrencyByName("poke-dollar")),
  caseFor("EncounterMethod", () => client.encounter.getEncounterMethodByName("walk")),
  caseFor("EncounterCondition", () => client.encounter.getEncounterConditionByName("swarm")),
  caseFor("EncounterConditionValue", () =>
    client.encounter.getEncounterConditionValueByName("swarm-yes"),
  ),
  caseFor("EvolutionChain", evolutionChain),
  caseFor("EvolutionTrigger", () => client.evolution.getEvolutionTriggerByName("level-up")),
  caseFor("Generation", () => client.game.getGenerationByName("generation-i")),
  caseFor("Pokedex", pokedex),
  caseFor("Version", () => client.game.getVersionByName("red")),
  caseFor("VersionGroup", () => client.game.getVersionGroupByName("red-blue")),
  caseFor("Item", masterBall),
  caseFor("ItemAttribute", () => client.item.getItemAttributeByName("countable")),
  caseFor("ItemCategory", () => client.item.getItemCategoryByName("stat-boosts")),
  caseFor("ItemFlingEffect", () => client.item.getItemFlingEffectByName("badly-poison")),
  caseFor("ItemPocket", itemPocket),
  caseFor("Location", () => client.location.getLocationByName("canalave-city")),
  caseFor("LocationArea", locationArea),
  caseFor("PalParkArea", () => client.location.getPalParkAreaByName("forest")),
  caseFor("Region", () => client.location.getRegionByName("kanto")),
  caseFor("Machine", () => client.machine.getMachineById(1)),
  caseFor("Move", pound),
  caseFor("MoveAilment", () => client.move.getMoveAilmentByName("paralysis")),
  caseFor("MoveBattleStyle", () => client.move.getMoveBattleStyleByName("attack")),
  caseFor("MoveCategory", () => client.move.getMoveCategoryByName("ailment")),
  caseFor("MoveDamageClass", () => client.move.getMoveDamageClassByName("status")),
  caseFor("MoveLearnMethod", () => client.move.getMoveLearnMethodByName("level-up")),
  caseFor("MoveTarget", () => client.move.getMoveTargetByName("specific-move")),
  caseFor("Ability", ability),
  caseFor("Characteristic", () => client.pokemon.getCharacteristicById(1)),
  caseFor("EggGroup", () => client.pokemon.getEggGroupByName("monster")),
  caseFor("Gender", gender),
  caseFor("GrowthRate", () => client.pokemon.getGrowthRateByName("slow")),
  caseFor("Nature", nature),
  caseFor("PokeathlonStat", pokeathlonStat),
  caseFor("Pokemon", bulbasaur),
  caseFor("PokemonColor", () => client.pokemon.getPokemonColorByName("black")),
  caseFor("PokemonForm", bulbasaurForm),
  caseFor("PokemonHabitat", () => client.pokemon.getPokemonHabitatByName("cave")),
  caseFor("PokemonShape", pokemonShape),
  caseFor("PokemonSpecies", species),
  caseFor("Stat", hpStat),
  caseFor("Type", normalType),
  caseFor("Language", () => client.utility.getLanguageByName("ja-Hrkt")),
];

/**
 * Shapes that only ever appear nested inside another resource, so a top-level
 * key set never reaches them.
 */
const NESTED: Case[] = [
  caseFor("NamedAPIResource", berryItem),
  caseFor("APIResource", characteristicResource),
  caseFor("BerryFlavorMap", berryFlavorMap),
  caseFor("Name", pocketName),
  caseFor("ContestName", contestTypeName),
  caseFor("ContestFlavorText", contestEffectFlavorText),
  caseFor("Effect", flingEffectEntry),
  caseFor("ItemPrice", itemPrice),
  caseFor("ItemSprites", itemSprites),
  caseFor("VerboseEffect", itemEffect),
  caseFor("VersionGroupFlavorText", itemFlavorText),
  caseFor("GenerationGameIndex", itemGameIndex),
  caseFor("ItemHolderPokemon", itemHolder),
  caseFor("ItemHolderPokemonVersionDetail", itemHolderVersion),
  caseFor("MachineVersionDetail", machineVersionDetail),
  caseFor("MoveMetaData", moveMeta),
  caseFor("ContestComboSets", contestCombos),
  caseFor("ContestComboDetail", contestComboDetail),
  caseFor("MoveFlavorText", moveFlavorText),
  caseFor("PastMoveStatValues", pastMoveStatValues),
  caseFor("MoveStatChange", moveStatChange),
  caseFor("Description", damageClassDescription),
  caseFor("GrowthRateExperienceLevel", growthRateLevel),
  caseFor("PalParkEncounterSpecies", palParkEncounter),
  caseFor("EncounterMethodRate", encounterMethodRate),
  caseFor("EncounterVersionDetails", encounterVersionDetails),
  caseFor("PokemonEncounter", areaPokemonEncounter),
  caseFor("PokemonEntry", pokedexEntry),
  caseFor("AbilityEffectChange", abilityEffectChange),
  caseFor("AbilityFlavorText", abilityFlavorText),
  caseFor("AbilityPokemon", abilityPokemon),
  caseFor("PokemonSpeciesGender", genderSpecies),
  caseFor("NatureStatChange", natureStatChange),
  caseFor("MoveBattleStylePreference", battleStylePreference),
  caseFor("NaturePokeathlonStatAffectSets", pokeathlonAffectSets),
  caseFor("NaturePokeathlonStatAffect", pokeathlonAffect),
  caseFor("AwesomeName", awesomeName),
  caseFor("Genus", genus),
  caseFor("PokemonSpeciesDexEntry", speciesDexEntry),
  caseFor("PalParkEncounterArea", palParkEncounterArea),
  caseFor("PokemonSpeciesVariety", speciesVariety),
  caseFor("FlavorText", speciesFlavorText),
  caseFor("MoveStatAffectSets", statAffectingMoves),
  caseFor("MoveStatAffect", moveStatAffect),
  caseFor("NatureStatAffectSets", statAffectingNatures),
  caseFor("TypePokemon", typePokemon),
  caseFor("TypeRelations", typeRelations),
  caseFor("TypeRelationsPast", typeRelationsPast),
  caseFor("TypeSprites", typeSprites),
  caseFor("GenerationIIITypeSprites", async () => (await typeSprites())["generation-iii"]),
  caseFor("GenerationIVTypeSprites", async () => (await typeSprites())["generation-iv"]),
  caseFor("GenerationVTypeSprites", async () => (await typeSprites())["generation-v"]),
  caseFor("GenerationVITypeSprites", async () => (await typeSprites())["generation-vi"]),
  caseFor("GenerationVIITypeSprites", async () => (await typeSprites())["generation-vii"]),
  caseFor("GenerationVIIITypeSprites", async () => (await typeSprites())["generation-viii"]),
  caseFor("GenerationIXTypeSprites", async () => (await typeSprites())["generation-ix"]),
  caseFor("TypeGameSprites", async () => (await typeSprites())["generation-iii"].colosseum),
  caseFor("PokemonAbility", pokemonAbility),
  caseFor("PokemonType", pokemonType),
  caseFor("PokemonStat", pokemonStat),
  caseFor("PokemonMove", pokemonMove),
  caseFor("PokemonMoveVersion", pokemonMoveVersion),
  caseFor("VersionGameIndex", pokemonGameIndex),
  caseFor("PokemonPastType", pastType),
  caseFor("PokemonPastAbility", pastAbility),
  caseFor("PokemonPastAbilitySlot", pastAbilitySlot),
  caseFor("PokemonPastStat", pastStat),
  caseFor("PokemonHeldItem", heldItem),
  caseFor("PokemonHeldItemVersion", heldItemVersion),
  caseFor("LocationAreaEncounter", encounterArea),
  caseFor("VersionEncounterDetail", encounterVersion),
  caseFor("Encounter", encounterDetail),
  caseFor("EncounterPokemonDetail", encounterPokemonDetail),
  caseFor("PokemonFormCondition", formCondition),
  caseFor("ChainLink", chainLink),
  caseFor("EvolutionDetail", evolutionDetail),
];

/** The Pokémon sprite tree, one case per level. */
const SPRITES: Case[] = [
  caseFor("PokemonSprites", pokemonSprites),
  caseFor("OtherPokemonSprites", otherSprites),
  caseFor("DreamWorld", async () => (await otherSprites()).dream_world),
  caseFor("OfficialArtwork", async () => (await otherSprites())["official-artwork"]),
  caseFor("Home", async () => (await otherSprites()).home),
  caseFor("Showdown", async () => (await otherSprites()).showdown),
  caseFor("VersionSprites", versionSprites),
  caseFor("GenerationISprites", generationISprites),
  caseFor("RedBlue", async () => (await generationISprites())["red-blue"]),
  caseFor("Yellow", async () => (await generationISprites()).yellow),
  caseFor("GenerationIISprites", generationIISprites),
  caseFor("Crystal", async () => (await generationIISprites()).crystal),
  caseFor("Gold", async () => (await generationIISprites()).gold),
  caseFor("Silver", async () => (await generationIISprites()).silver),
  caseFor("GenerationIIISprites", generationIIISprites),
  caseFor("Emerald", async () => (await generationIIISprites()).emerald),
  caseFor("FireredLeafgreen", async () => (await generationIIISprites())["firered-leafgreen"]),
  caseFor("RubySapphire", async () => (await generationIIISprites())["ruby-sapphire"]),
  caseFor("GenerationIVSprites", generationIVSprites),
  caseFor("DiamondPearl", async () => (await generationIVSprites())["diamond-pearl"]),
  caseFor("HeartgoldSoulsilver", async () => (await generationIVSprites())["heartgold-soulsilver"]),
  caseFor("Platinum", async () => (await generationIVSprites()).platinum),
  caseFor("GenerationVSprites", generationVSprites),
  caseFor("BlackWhite", blackWhiteSprites),
  caseFor("Animated", async () => (await blackWhiteSprites()).animated),
  caseFor("GenerationVISprites", generationVISprites),
  caseFor(
    "OmegarubyAlphasapphire",
    async () => (await generationVISprites())["omegaruby-alphasapphire"],
  ),
  caseFor("XY", async () => (await generationVISprites())["x-y"]),
  caseFor("GenerationVIISprites", generationVIISprites),
  caseFor("GenerationViiIcons", async () => (await generationVIISprites()).icons),
  caseFor("UltraSunUltraMoon", async () => (await generationVIISprites())["ultra-sun-ultra-moon"]),
  caseFor("GenerationVIIISprites", generationVIIISprites),
  caseFor("GenerationViiiIcons", async () => (await generationVIIISprites()).icons),
  caseFor(
    "BrilliantDiamondShiningPearl",
    async () => (await generationVIIISprites())["brilliant-diamond-shining-pearl"],
  ),
  caseFor("GenerationIXSprites", generationIXSprites),
  caseFor("ScarletViolet", async () => (await generationIXSprites())["scarlet-violet"]),
  caseFor("PokemonFormSprites", formSprites),
  caseFor("PokemonFormVersionSprites", formVersionSprites),
  caseFor(
    "PokemonFormGenerationVIIISprites",
    async () => (await formVersionSprites())["generation-viii"],
  ),
];

describe("PokéAPI contract", () => {
  it.each(RESOURCES)("%s should keep the shape the model declares", async (_model, get, shape) => {
    const resource = await get();

    expect(sortKeys(Object.keys(resource))).toEqual(shape.keys);
    expect(mistypedFields(shape, resource)).toEqual([]);
  });

  it.each(NESTED)("nested %s should keep the shape the model declares", async (_m, get, shape) => {
    const resource = await get();

    expect(sortKeys(Object.keys(resource))).toEqual(shape.keys);
    expect(mistypedFields(shape, resource)).toEqual([]);
  });

  it.each(SPRITES)("sprite %s should keep the shape the model declares", async (_m, get, shape) => {
    const resource = await get();

    expect(sortKeys(Object.keys(resource))).toEqual(shape.keys);
    expect(mistypedFields(shape, resource)).toEqual([]);
  });

  it("should paginate a list the way the client expects", async () => {
    const list = await client.berry.listBerries(0, 5);

    expect(sortKeys(Object.keys(list))).toEqual(["count", "next", "previous", "results"]);
    expect(list.results).toHaveLength(5);
  });

  it("should model every endpoint the API advertises", async () => {
    const index = await client.utility.getResourceByUrl<Record<string, string>>(INDEX_URL);
    const advertised = Object.keys(index)
      .map((name) => `/${name}`)
      .filter((path) => !UNMODELLED.has(path));

    expect(sortKeys(advertised)).toEqual(sortKeys([...Object.values(ENDPOINTS)]));
  });
});

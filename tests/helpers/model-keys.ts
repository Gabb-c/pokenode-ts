import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type * as M from "@models";

/**
 * Ties a drift case to the model it stands for.
 *
 * `keyof T` cannot be read at runtime, so the keys a case asserts have to come
 * from somewhere other than the type system. They are read out of `src/models`
 * directly, by {@link declaredKeys} below, which means a model and its expected
 * key list can never disagree: there is only one statement of the shape, and
 * the live run checks the API against it.
 *
 * {@link Models} is what keeps a case honest about *which* model it names. The
 * fetch a case supplies is checked against the named model, so pairing one
 * resource with another model's name fails to compile rather than failing the
 * live run and looking like upstream drift.
 */
export interface Models {
  APIResource: M.APIResource;
  APIResourceList: M.APIResourceList;
  Ability: M.Ability;
  AbilityEffectChange: M.AbilityEffectChange;
  AbilityFlavorText: M.AbilityFlavorText;
  AbilityPokemon: M.AbilityPokemon;
  Animated: M.Animated;
  AwesomeName: M.AwesomeName;
  Berry: M.Berry;
  BerryFirmness: M.BerryFirmness;
  BerryFlavor: M.BerryFlavor;
  BerryFlavorMap: M.BerryFlavorMap;
  BlackWhite: M.BlackWhite;
  BrilliantDiamondShiningPearl: M.BrilliantDiamondShiningPearl;
  ChainLink: M.ChainLink;
  Characteristic: M.Characteristic;
  ContestComboDetail: M.ContestComboDetail;
  ContestComboSets: M.ContestComboSets;
  ContestEffect: M.ContestEffect;
  ContestFlavorText: M.ContestFlavorText;
  ContestName: M.ContestName;
  ContestType: M.ContestType;
  Crystal: M.Crystal;
  Currency: M.Currency;
  Description: M.Description;
  DiamondPearl: M.DiamondPearl;
  DreamWorld: M.DreamWorld;
  Effect: M.Effect;
  EggGroup: M.EggGroup;
  Emerald: M.Emerald;
  Encounter: M.Encounter;
  EncounterCondition: M.EncounterCondition;
  EncounterConditionValue: M.EncounterConditionValue;
  EncounterMethod: M.EncounterMethod;
  EncounterMethodRate: M.EncounterMethodRate;
  EncounterPokemonDetail: M.EncounterPokemonDetail;
  EncounterVersionDetails: M.EncounterVersionDetails;
  EvolutionChain: M.EvolutionChain;
  EvolutionDetail: M.EvolutionDetail;
  EvolutionTrigger: M.EvolutionTrigger;
  FireredLeafgreen: M.FireredLeafgreen;
  FlavorBerryMap: M.FlavorBerryMap;
  FlavorText: M.FlavorText;
  Gender: M.Gender;
  Generation: M.Generation;
  GenerationGameIndex: M.GenerationGameIndex;
  GenerationIIISprites: M.GenerationIIISprites;
  GenerationIIITypeSprites: M.GenerationIIITypeSprites;
  GenerationIISprites: M.GenerationIISprites;
  GenerationISprites: M.GenerationISprites;
  GenerationIVSprites: M.GenerationIVSprites;
  GenerationIVTypeSprites: M.GenerationIVTypeSprites;
  GenerationIXSprites: M.GenerationIXSprites;
  GenerationIXTypeSprites: M.GenerationIXTypeSprites;
  GenerationVIIISprites: M.GenerationVIIISprites;
  GenerationVIIITypeSprites: M.GenerationVIIITypeSprites;
  GenerationVIISprites: M.GenerationVIISprites;
  GenerationVIITypeSprites: M.GenerationVIITypeSprites;
  GenerationVISprites: M.GenerationVISprites;
  GenerationVITypeSprites: M.GenerationVITypeSprites;
  GenerationVSprites: M.GenerationVSprites;
  GenerationVTypeSprites: M.GenerationVTypeSprites;
  GenerationViiIcons: M.GenerationViiIcons;
  GenerationViiiIcons: M.GenerationViiiIcons;
  Genus: M.Genus;
  Gold: M.Gold;
  GrowthRate: M.GrowthRate;
  GrowthRateExperienceLevel: M.GrowthRateExperienceLevel;
  HeartgoldSoulsilver: M.HeartgoldSoulsilver;
  Home: M.Home;
  Item: M.Item;
  ItemAttribute: M.ItemAttribute;
  ItemCategory: M.ItemCategory;
  ItemFlingEffect: M.ItemFlingEffect;
  ItemHolderPokemon: M.ItemHolderPokemon;
  ItemHolderPokemonVersionDetail: M.ItemHolderPokemonVersionDetail;
  ItemPocket: M.ItemPocket;
  ItemPrice: M.ItemPrice;
  ItemSprites: M.ItemSprites;
  Language: M.Language;
  Location: M.Location;
  LocationArea: M.LocationArea;
  LocationAreaEncounter: M.LocationAreaEncounter;
  Machine: M.Machine;
  MachineVersionDetail: M.MachineVersionDetail;
  Move: M.Move;
  MoveAilment: M.MoveAilment;
  MoveBattleStyle: M.MoveBattleStyle;
  MoveBattleStylePreference: M.MoveBattleStylePreference;
  MoveCategory: M.MoveCategory;
  MoveDamageClass: M.MoveDamageClass;
  MoveFlavorText: M.MoveFlavorText;
  MoveLearnMethod: M.MoveLearnMethod;
  MoveMetaData: M.MoveMetaData;
  MoveStatAffect: M.MoveStatAffect;
  MoveStatAffectSets: M.MoveStatAffectSets;
  MoveStatChange: M.MoveStatChange;
  MoveTarget: M.MoveTarget;
  Name: M.Name;
  NamedAPIResource: M.NamedAPIResource;
  NamedAPIResourceList: M.NamedAPIResourceList;
  Nature: M.Nature;
  NaturePokeathlonStatAffect: M.NaturePokeathlonStatAffect;
  NaturePokeathlonStatAffectSets: M.NaturePokeathlonStatAffectSets;
  NatureStatAffectSets: M.NatureStatAffectSets;
  NatureStatChange: M.NatureStatChange;
  OfficialArtwork: M.OfficialArtwork;
  OmegarubyAlphasapphire: M.OmegarubyAlphasapphire;
  OtherPokemonSprites: M.OtherPokemonSprites;
  PalParkArea: M.PalParkArea;
  PalParkEncounterArea: M.PalParkEncounterArea;
  PalParkEncounterSpecies: M.PalParkEncounterSpecies;
  PastMoveStatValues: M.PastMoveStatValues;
  Platinum: M.Platinum;
  PokeathlonStat: M.PokeathlonStat;
  Pokedex: M.Pokedex;
  Pokemon: M.Pokemon;
  PokemonAbility: M.PokemonAbility;
  PokemonColor: M.PokemonColor;
  PokemonCries: M.PokemonCries;
  PokemonEncounter: M.PokemonEncounter;
  PokemonEntry: M.PokemonEntry;
  PokemonForm: M.PokemonForm;
  PokemonFormCondition: M.PokemonFormCondition;
  PokemonFormGenerationVIIISprites: M.PokemonFormGenerationVIIISprites;
  PokemonFormSprites: M.PokemonFormSprites;
  PokemonFormVersionSprites: M.PokemonFormVersionSprites;
  PokemonHabitat: M.PokemonHabitat;
  PokemonHeldItem: M.PokemonHeldItem;
  PokemonHeldItemVersion: M.PokemonHeldItemVersion;
  PokemonMove: M.PokemonMove;
  PokemonMoveVersion: M.PokemonMoveVersion;
  PokemonPastAbility: M.PokemonPastAbility;
  PokemonPastAbilitySlot: M.PokemonPastAbilitySlot;
  PokemonPastStat: M.PokemonPastStat;
  PokemonPastType: M.PokemonPastType;
  PokemonShape: M.PokemonShape;
  PokemonSpecies: M.PokemonSpecies;
  PokemonSpeciesDexEntry: M.PokemonSpeciesDexEntry;
  PokemonSpeciesGender: M.PokemonSpeciesGender;
  PokemonSpeciesVariety: M.PokemonSpeciesVariety;
  PokemonSprites: M.PokemonSprites;
  PokemonStat: M.PokemonStat;
  PokemonType: M.PokemonType;
  RedBlue: M.RedBlue;
  Region: M.Region;
  RubySapphire: M.RubySapphire;
  ScarletViolet: M.ScarletViolet;
  Showdown: M.Showdown;
  Silver: M.Silver;
  Stat: M.Stat;
  SuperContestEffect: M.SuperContestEffect;
  Type: M.Type;
  TypeGameSprites: M.TypeGameSprites;
  TypePokemon: M.TypePokemon;
  TypeRelations: M.TypeRelations;
  TypeRelationsPast: M.TypeRelationsPast;
  TypeSprites: M.TypeSprites;
  UltraSunUltraMoon: M.UltraSunUltraMoon;
  VerboseEffect: M.VerboseEffect;
  Version: M.Version;
  VersionEncounterDetail: M.VersionEncounterDetail;
  VersionGameIndex: M.VersionGameIndex;
  VersionGroup: M.VersionGroup;
  VersionGroupFlavorText: M.VersionGroupFlavorText;
  VersionSprites: M.VersionSprites;
  XY: M.XY;
  Yellow: M.Yellow;
}

/** A model the drift suite can name. */
export type ModelName = keyof Models;

const MODELS_DIR = fileURLToPath(new URL("../../src/models", import.meta.url));

/** `export interface Name {` or `export type Name = {`, and nothing else. */
/**
 * A model declaration, with the type parameters of a generic one discarded:
 * `NamedAPIResource<T = unknown>` is registered as `NamedAPIResource`, since the
 * argument says what a link points at and not what the response contains.
 */
const DECLARATION = /^export (?:interface (\w+)(?:<[^>]*>)?\s*|type (\w+)(?:<[^>]*>)?\s*=\s*)\{$/;

/** The start of a property at the top level of a declaration body. */
const PROPERTY = /^ {2}"?([\w-]+)"?\??:\s*(.*)$/;

/**
 * A property whose type opens an object literal inline. The reader cannot tell
 * where such a body ends, so it refuses to guess.
 */
const INLINE_OBJECT = /^ {2}"?[\w-]+"?\??:.*\{$/;

/** What a value can be at run time, as far as this check is concerned. */
type Kind = "string" | "number" | "boolean" | "object" | "array";

/** One property of a model, as declared. */
export interface Field {
  /** The property name. */
  key: string;
  /** The annotation as written, quoted back in failure messages. */
  annotation: string;
  /** The kinds the value may take. */
  kinds: Set<Kind>;
  /** Whether `null` is one of them. */
  nullable: boolean;
  /** The permitted values, when the annotation is a union of literals. */
  literals: Set<string | number> | null;
  /** The kind of an array's elements, when the annotation is an array. */
  element: Kind | null;
}

/** A model's declared shape: the keys it has, and what each one holds. */
export interface Shape {
  keys: string[];
  fields: Field[];
}

const modelFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) return modelFiles(path);

    return entry.name.endsWith(".ts") ? [path] : [];
  });

/** `export type Name =`, with whatever follows on the same line. */
const TYPE_ALIAS = /^export type (\w+)\s*=\s*(.*)$/;

/** A named union of literals, as {@link parseAnnotation} resolves it. */
interface Alias {
  kind: "string" | "number";
  values: (string | number)[];
}

/**
 * The literal unions `src/models` declares under a name, so a field annotated
 * with one is read as the values it stands for rather than as an opaque object.
 *
 * Without this a named union is indistinguishable from a model reference: it
 * matches the same `^[A-Z]\w*$`, so `name: EvolutionTriggerName` would be
 * recorded as an object and every live string reported as mistyped, while the
 * values it permits went unchecked.
 *
 * One level deep, and literals only. An alias built out of other aliases stays
 * unresolved and its field reads as an object, which fails loudly rather than
 * quietly widening the check.
 */
const literalAliases = (): Map<string, Alias> => {
  const aliases = new Map<string, Alias>();

  for (const file of modelFiles(MODELS_DIR)) {
    const lines = readFileSync(file, "utf8").split("\n");
    let pending: { name: string; text: string } | null = null;

    for (const line of lines) {
      if (pending === null) {
        const alias = TYPE_ALIAS.exec(line);

        // `export type X = {` opens an object body, which `declaredShapes` reads.
        if (alias === null || alias[2]?.endsWith("{") === true) continue;

        pending = { name: alias[1] as string, text: alias[2] ?? "" };
      } else {
        pending.text += ` ${line.trim()}`;
      }

      if (!pending.text.trimEnd().endsWith(";")) continue;

      const members = pending.text
        .trim()
        .replace(/;$/, "")
        .replace(/^\|/, "")
        .split("|")
        .map((member) => member.trim());
      const strings = members.every((member) => member.startsWith('"') && member.endsWith('"'));
      const numbers = members.every((member) => /^-?\d+$/.test(member));

      if (strings) {
        aliases.set(pending.name, {
          kind: "string",
          values: members.map((member) => member.slice(1, -1)),
        });
      } else if (numbers) {
        aliases.set(pending.name, { kind: "number", values: members.map(Number) });
      }

      pending = null;
    }
  }

  return aliases;
};

const ALIASES = literalAliases();

/**
 * Turns one annotation into the coarse shape {@link mistypedFields} checks.
 *
 * The models use a small, closed grammar — primitives, named types, arrays of
 * either, literal unions, and an optional `| null` — with no intersections or
 * parenthesised types, so splitting on `|` is enough. A named type may carry one
 * type argument (`NamedAPIResource<Berry>`), which says what a link points at
 * and makes no difference to the shape of the response. A union *inside* those
 * angle brackets would defeat the split, and throws rather than parsing wrong.
 *
 * An annotation outside that grammar throws instead of being skipped: a field
 * the reader quietly gave up on would weaken the check with nothing to show for
 * it.
 */
const parseAnnotation = (model: string, key: string, annotation: string): Field => {
  const field: Field = {
    key,
    annotation,
    kinds: new Set(),
    nullable: false,
    literals: new Set(),
    element: null,
  };

  for (const member of annotation.replace(/^\|/, "").split("|")) {
    const type = member.trim();

    if (type === "null") {
      field.nullable = true;
    } else if (type === "string" || type === "number" || type === "boolean") {
      field.kinds.add(type);
      field.literals = null;
    } else if (type.startsWith('"') && type.endsWith('"')) {
      field.kinds.add("string");
      field.literals?.add(type.slice(1, -1));
    } else if (/^-?\d+$/.test(type)) {
      field.kinds.add("number");
      field.literals?.add(Number(type));
    } else if (type.endsWith("[]")) {
      const element = type.slice(0, -2);

      field.kinds.add("array");
      field.literals = null;
      field.element =
        element === "string" || element === "number" || element === "boolean" ? element : "object";
    } else if (/^[A-Z]\w*(<[A-Z]\w*>)?$/.test(type)) {
      const alias = ALIASES.get(type);

      if (alias === undefined) {
        field.kinds.add("object");
        field.literals = null;
      } else {
        field.kinds.add(alias.kind);

        for (const value of alias.values) {
          field.literals?.add(value);
        }
      }
    } else {
      throw new Error(
        `${model}.${key} is declared \`${annotation}\`, which ` +
          `tests/helpers/model-keys.ts cannot read. Teach parseAnnotation the new form.`,
      );
    }
  }

  if (field.literals?.size === 0) field.literals = null;

  return field;
};

/**
 * Reads the declared shape of every model under `src/models`.
 *
 * This is a reader, not a TypeScript parser: it leans on the models being flat
 * declarations of plain properties, which is what they are and what Biome keeps
 * them as. Anything it is not equipped to read — a nested object literal, a
 * duplicated name — throws rather than being silently skipped, because a shape
 * that is quietly wrong would surface as upstream drift that is not real.
 *
 * A property's text is buffered until it ends in a semicolon, so a union spread
 * over several lines is read as the one annotation it is.
 */
const declaredShapes = (): Map<string, Shape> => {
  const shapes = new Map<string, Shape>();

  for (const file of modelFiles(MODELS_DIR)) {
    const lines = readFileSync(file, "utf8").split("\n");
    let model: string | null = null;
    let pending: { key: string; text: string } | null = null;

    const finish = (): void => {
      if (model === null || pending === null) return;

      const shape = shapes.get(model);
      const annotation = pending.text.replace(/;$/, "").trim();

      shape?.keys.push(pending.key);
      shape?.fields.push(parseAnnotation(model, pending.key, annotation));
      pending = null;
    };

    for (const line of lines) {
      const declaration = DECLARATION.exec(line);

      if (declaration) {
        model = declaration[1] ?? declaration[2] ?? null;

        if (model !== null && shapes.has(model)) {
          throw new Error(`Two models under src/models are both named ${model}`);
        }

        if (model !== null) shapes.set(model, { keys: [], fields: [] });
        continue;
      }

      if (model === null) continue;

      if (pending !== null) {
        pending.text += ` ${line.trim()}`;
        if (pending.text.endsWith(";")) finish();
        continue;
      }

      if (line === "}") {
        model = null;
        continue;
      }

      if (INLINE_OBJECT.test(line)) {
        throw new Error(
          `${model} declares a property with an inline object type, which ` +
            `tests/helpers/model-keys.ts cannot read. Give the type a name of its own.`,
        );
      }

      const property = PROPERTY.exec(line);

      if (property?.[1] === undefined) continue;

      pending = { key: property[1], text: property[2] ?? "" };
      if (pending.text.endsWith(";")) finish();
    }
  }

  return shapes;
};

const SHAPES = declaredShapes();

/** What a live value turned out to be. */
const kindOf = (value: unknown): Kind => {
  if (Array.isArray(value)) return "array";

  const type = typeof value;

  return type === "string" || type === "number" || type === "boolean" ? type : "object";
};

/** Renders a live value for a failure message, without dumping a whole payload. */
const describe = (value: unknown): string => {
  const kind = kindOf(value);

  if (kind === "array") return `an array of ${(value as unknown[]).length}`;
  if (kind === "object") return "an object";

  return JSON.stringify(value);
};

/**
 * Reports every field whose live value contradicts the model.
 *
 * The check is coarse on purpose. It asks whether a value is still a string, a
 * number, an object, an array, or `null` where the model allows one — the
 * changes that break a consumer — and never what a string says or how long an
 * array is, which change with every ordinary content update upstream.
 *
 * Like the key check, it sees only the one resource its case fetched.
 */
export const mistypedFields = (shape: Shape, resource: object): string[] => {
  const values = resource as Record<string, unknown>;

  return shape.fields.flatMap((field) => {
    if (!(field.key in values)) return [];

    const value = values[field.key];
    const declared = `${field.key}: declared \`${field.annotation}\``;

    if (value === null) {
      return field.nullable ? [] : [`${declared}, got null`];
    }

    const kind = kindOf(value);

    if (!field.kinds.has(kind)) return [`${declared}, got ${describe(value)}`];

    if (field.literals !== null && (kind === "string" || kind === "number")) {
      return field.literals.has(value as string | number)
        ? []
        : [`${declared}, got ${describe(value)}`];
    }

    if (kind === "array" && field.element !== null) {
      const [element] = value as unknown[];

      if (element !== undefined && kindOf(element) !== field.element) {
        return [`${declared}, got an array of ${kindOf(element)}`];
      }
    }

    return [];
  });
};

/**
 * Code-unit order, not locale order.
 *
 * Both sides of a drift assertion have to sort identically, and PokéAPI keys
 * are ASCII snake_case: `localeCompare` would weigh the underscores by the
 * runner's collation and could order `base_form` against `baseline` one way on
 * CI and another way locally.
 */
const byCodeUnit = (a: string, b: string): number => {
  if (a === b) return 0;

  return a < b ? -1 : 1;
};

/** Sorts observed keys the way {@link caseFor} sorts the declared ones. */
export const sortKeys = (keys: string[]): string[] => [...keys].sort(byCodeUnit);

/**
 * The declared shape of one field, for a check that needs more than the one
 * resource a {@link Case} fetches.
 *
 * {@link mistypedFields} already rejects a value outside `literals`, but it sees
 * only that case's resource — a union whose members are spread across a section
 * is never exercised by it. `values.live.spec.ts` uses this to sweep wider.
 *
 * The key has to exist on the model named, so a case cannot drift onto a field
 * that was renamed and still compile.
 */
export const fieldOf = <K extends ModelName>(model: K, key: keyof Models[K] & string): Field => {
  const field = SHAPES.get(model)?.fields.find((candidate) => candidate.key === key);

  if (field === undefined) {
    throw new Error(`No field named ${key} was found on ${model} under src/models`);
  }

  if (field.literals === null) {
    throw new Error(`${model}.${key} is declared \`${field.annotation}\`, not a union of literals`);
  }

  return field;
};

/** One row of a drift table: the model, what to fetch, and the shape it declares. */
export type Case = [model: string, fetchResource: () => Promise<object>, shape: Shape];

/**
 * Builds a drift row. The fetch has to return the named model, so a row cannot
 * pair one resource with another model's shape and still compile.
 */
export const caseFor = <K extends ModelName>(
  model: K,
  fetchResource: () => Promise<Models[K]>,
): Case => {
  const shape = SHAPES.get(model);

  if (shape === undefined || shape.keys.length === 0) {
    throw new Error(`No model named ${model} was found under src/models`);
  }

  return [model, fetchResource, { keys: sortKeys(shape.keys), fields: shape.fields }];
};

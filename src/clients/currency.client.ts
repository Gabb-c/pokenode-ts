import { ENDPOINTS } from "@constants";
import type { Currency, NamedAPIResourceList } from "@models";
import { BaseClient } from "./base";

/**
 * ### Currency Client
 *
 * Client used to access the Currency Endpoints:
 *
 * - [Currencies](https://pokeapi.co/docs/v2#currencies)
 *
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#currencies-section)
 */
export class CurrencyClient extends BaseClient {
  /** Get a Currency by its name. */
  public async getCurrencyByName(name: string): Promise<Currency> {
    return this.getResource(ENDPOINTS.CURRENCY, name);
  }

  /** Get a Currency by its ID. */
  public async getCurrencyById(id: number): Promise<Currency> {
    return this.getResource(ENDPOINTS.CURRENCY, id);
  }

  /** List Currencies. Page defaults to 20 entries from offset 0. */
  public async listCurrencies(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Currency>> {
    return this.getListResource<Currency>(ENDPOINTS.CURRENCY, offset, limit);
  }
}

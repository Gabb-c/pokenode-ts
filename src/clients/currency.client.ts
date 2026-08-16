import { ENDPOINTS } from "@constants";
import type { Currency, NamedAPIResourceList } from "@models";
import { BaseClient } from "./base";

/**
 * ### Currency Client
 *
 * Client used to access the Currency Endpoints:
 *  - [Currencies](https://pokeapi.co/docs/v2#currencies)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#currencies-section)
 */
export class CurrencyClient extends BaseClient {
  /**
   * Get a Currency by its name.
   * @param name The Currency name.
   * @returns The matching Currency.
   */
  public async getCurrencyByName(name: string): Promise<Currency> {
    return this.getResource(ENDPOINTS.CURRENCY, name);
  }

  /**
   * Get a Currency by its ID.
   * @param id The Currency ID.
   * @returns The matching Currency.
   */
  public async getCurrencyById(id: number): Promise<Currency> {
    return this.getResource(ENDPOINTS.CURRENCY, id);
  }

  /**
   * List Currencies.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Currencies.
   */
  public async listCurrencies(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Currency>> {
    return this.getListResource<Currency>(ENDPOINTS.CURRENCY, offset, limit);
  }
}

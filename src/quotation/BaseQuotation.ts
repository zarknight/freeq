import { getStockCodes, getStockType } from "../utils/helpers";
import http from "../utils/request";
import Quotation from "./Quotation";

export type StockOption = {
  prefix: boolean;
};

export default abstract class BaseQuotation implements Quotation {
  pageSize: number = 800;
  stockCodes: string[] = [];
  stockList: string[] = [];

  constructor() {
    this.init();
  }

  abstract get apiUrl(): string;

  protected abstract formatResponseData(
    data: string[],
    args: StockOption
  ): Record<string, any>;

  async init() {
    this.stockCodes = await getStockCodes(true);
    this.stockList = this.generateStockList(this.stockCodes);
  }

  generateStockList(codes: string[]) {
    const list = this.generateStockPrefix(codes);

    if (list.length < this.pageSize) {
      return [list.join(",")];
    }

    const result = [];

    while (list.length > 0) {
      result.push(list.splice(0, this.pageSize).join(","));
    }

    return result;
  }

  protected generateStockPrefix(codes: string[]) {
    return codes.map((code) => getStockType(code) + code.slice(-6));
  }

  /**
   * 获取市场上所有证券的行情
   * @param prefix
   */
  async getMarketSnapshot(prefix = false) {
    return this.getStockData(this.stockList, { prefix });
  }

  /**
   * 获取指定一支或多支证券的行情
   * @param codes 证券代码
   * @param prefix 为 true 时证券代码必须以 sh/sz 开头；为 false 时不返回指数行情
   * @returns 返回实时行情对象，键为证券代码，值为行情信息
   */
  async real(codes: string | string[], prefix = false) {
    return this.getStockData(
      this.generateStockList(typeof codes === "string" ? [codes] : codes),
      { prefix }
    );
  }

  protected async getStockData(stockList: string[], args: StockOption) {
    const list = await this.fetchStockData(stockList);
    return this.formatResponseData(list, args);
  }

  protected async getStockByRange(params: string) {
    const url: string = this.apiUrl + params;
    const { data } = await http.get(url, { headers: this.getHeaders() });
    return data;
  }

  protected async fetchStockData(stockList: string[]): Promise<string[]> {
    return Promise.all(stockList.map((item) => this.getStockByRange(item)));
  }

  protected getHeaders(): Record<string, string> {
    return {
      "Accept-Encoding": "gzip, deflate, sdch",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 Safari/537.36",
    };
  }
}

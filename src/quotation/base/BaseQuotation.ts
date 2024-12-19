import { getStockCodes, getStockType } from "../../utils/helpers";
import http from "../../utils/request";
import Quotation from "./Quotation";

export type StockOption = {
  prefix: boolean;
};

/**
 * 行情基础类
 */
export default abstract class BaseQuotation implements Quotation {
  pageSize: number = 800;
  stockCodes: string[] = [];
  stockParams: string[] = [];

  constructor() {
    this.init();
  }

  abstract get apiUrl(): string;

  protected abstract formatResponseData(
    data: string[],
    args: StockOption
  ): Record<string, any>;

  async init() {
    // 获取所有证券代码
    this.stockCodes = await getStockCodes(true);

    // 生成证券代码对应的所有请求参数
    this.stockParams = this.generateStockParams(this.stockCodes);
  }

  /**
   * 生成请求参数
   * @param codes 证券代码
   */
  generateStockParams(codes: string[]) {
    const list = this.generateStockPrefix(codes);

    if (list.length < this.pageSize) {
      return [list.join(",")];
    }

    const params = [];

    while (list.length > 0) {
      params.push(list.splice(0, this.pageSize).join(","));
    }

    return params;
  }

  /**
   * 补全证券代码对应的市场前缀
   */
  protected generateStockPrefix(codes: string[]) {
    return codes.map((code) => getStockType(code) + code.slice(-6));
  }

  /**
   * 获取市场上所有证券的行情
   * @param prefix
   */
  async getMarketSnapshot(prefix = false) {
    return this.getStockData(this.stockParams, { prefix });
  }

  /**
   * 获取指定一支或多支证券的行情
   * @param codes 证券代码
   * @param prefix 当它的值为 true 时，证券代码必须冠以 sh/sz 前缀；而值为 false 时，则不返回指数行情
   * @returns 返回实时行情对象，键为证券代码，值为行情信息
   */
  async real(codes: string | string[], prefix = false) {
    const params = this.generateStockParams(
      typeof codes === "string" ? [codes] : codes
    );
    return this.getStockData(params, { prefix });
  }

  /**
   * 发送请求，获取证券信息
   * @param params 请求证券信息的参数列表
   * @returns
   */
  protected async getStockByRange(params: string) {
    const url: string = this.apiUrl + params;
    const { data } = await http.get(url, { headers: this.getHeaders() });
    return data;
  }

  /**
   * 获取证券的行情数据
   * @param params 请求证券信息的参数列表
   * @returns 行情数据列表
   */
  protected async fetchStockData(params: string[]): Promise<string[]> {
    return Promise.all(params.map((p) => this.getStockByRange(p)));
  }

  /**
   * 获取证券的行情数据
   * @param params 请求证券信息的参数列表
   * @returns 行情数据列表
   */
  protected async getStockData(params: string[], args: StockOption) {
    const list = await this.fetchStockData(params);
    return this.formatResponseData(list, args);
  }

  /**
   * 获取发起请求的请求头信息
   * @returns 请求头
   */
  protected getHeaders(): Record<string, string> {
    return {
      "Accept-Encoding": "gzip, deflate, sdch",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 Safari/537.36",
    };
  }
}

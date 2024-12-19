import BaseQuotation, { StockOption } from "./base/BaseQuotation";

/**
 * 港股行情
 */
export default class HKQuotation extends BaseQuotation {
  private regValidData: RegExp = /v_(.*?)=\"(.*?)\"/;

  get apiUrl(): string {
    return "http://sqt.gtimg.cn/utf8/q=";
  }

  protected generateStockPrefix(codes: string[]): string[] {
    return codes.map((code) => `r_hk${code}`);
  }

  protected formatResponseData(
    data: string[],
    args: StockOption
  ): Record<string, any> {
    const result: Record<string, any> = {};
    const list = data.join("").replace(/\s/g, "").split(";");

    for (const item of list) {
      const matched = this.regValidData.exec(item);

      if (matched) {
        const info = matched[2].split("~");

        result[info[2]] = {
          // 当前手数
          lotSize: parseFloat(info[0]),
          // 股票名称
          name: info[1],
          // 当前价格
          price: parseFloat(info[3]),
          // 昨收价
          lastPrice: parseFloat(info[4]),
          // 开盘价
          openPrice: parseFloat(info[5]),
          // 成交量
          amount: parseFloat(info[6]),
          // 成交时间
          time: info[30],
          // 涨跌幅
          dtd: parseFloat(info[32]),
          // 最高价
          high: parseFloat(info[33]),
          // 最低价
          low: parseFloat(info[34]),
        };
      }
    }

    return result;
  }
}

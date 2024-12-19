import { getStockType } from "../utils/helpers";
import BaseQuotation, { StockOption } from "./base/BaseQuotation";

export type KLineDayInfo = [
  number, // 0: 日期
  number, // 1: 开盘价
  number, // 2: 收盘价
  number, // 3: 最高价
  number, // 4: 最低价
  number // 5: 成交量
];

export default class KLineDayQuotation extends BaseQuotation {
  pageSize: number = 1;

  get apiUrl(): string {
    return "http://web.ifzq.gtimg.cn/appstock/app/fqkline/get?_var=kline_dayqfq&param=";
  }

  protected generateStockPrefix(codes: string[], day: number = 1500): string[] {
    return codes.map((code) => `${getStockType(code)}${code},day,,,${day},qfq`);
  }

  protected formatResponseData(
    data: string[],
    args: StockOption
  ): Record<string, any> {
    const result: Record<string, KLineDayInfo[]> = {};

    for (const item of data) {
      const res = JSON.parse(item.substring(item.indexOf("=") + 1));

      for (const [key, value] of Object.entries<any>(res.data)) {
        const code = args.prefix ? key : key.slice(2);
        const info = (value.qfqday || value.get?.("day")) as KLineDayInfo[];

        if (info) {
          result[code] = info;
        }
      }
    }

    return result;
  }
}

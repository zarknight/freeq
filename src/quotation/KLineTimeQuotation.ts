import { getStockType } from "../utils/helpers";
import BaseQuotation, { StockOption } from "./base/BaseQuotation";

export type SequenceItemInfo = {
  // 成交时间
  time: string;
  // 成交价格
  price: number;
  // 成交量
  volume: number;
};

export type KLineTimeQuotationData = {
  // 日期
  date: string;
  // 分时数据
  sequence: SequenceItemInfo[];
};

export default class KLineTimeQuotation extends BaseQuotation {
  pageSize: number = 1;

  get apiUrl(): string {
    return "http://data.gtimg.cn/flashdata/hushen/minute/";
  }

  protected generateStockPrefix(codes: string[]): string[] {
    return codes.map((code) => getStockType(code) + code.slice(-6) + ".js");
  }

  protected async fetchStockData(stockList: string[]): Promise<string[]> {
    const res = await super.fetchStockData(stockList);
    const result: string[] = [];

    for (let i = 0; i < stockList.length; i++) {
      const data = res[i];

      if (data) {
        const code = stockList[i];
        result.push(`${code}#${data}`);
      }
    }

    return result;
  }

  protected formatResponseData(
    data: string[],
    args: StockOption
  ): Record<string, any> {
    const result: Record<string, KLineTimeQuotationData> = {};

    for (const item of data) {
      const [rawCode, value] = item.split("#");
      const info = value.split("\\n\\\n");
      const date = `20${info[1].slice(-6)}`;
      const fullCode = rawCode.slice(0, -3);
      const code = args.prefix ? fullCode : fullCode.slice(2);

      const sequence: SequenceItemInfo[] = [];

      for (let i = 2; i < info.length; i++) {
        const arr = info[i].split(" ");

        sequence.push({
          // 成交时间
          time: arr[0],
          // 成交价格
          price: parseFloat(arr[1]),
          // 成交量
          volume: parseInt(arr[2]),
        });
      }

      result[code] = { date, sequence };
    }

    return result;
  }
}

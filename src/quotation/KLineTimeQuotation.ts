import { getStockType } from "../utils/helpers";
import BaseQuotation, { StockOption } from "./BaseQuotation";

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
    const result: Record<string, any> = {};

    for (const item of data) {
      const [rawCode, value] = item.split("#");
      const info = value.split("\\n\\\n");
      const date = `20${info[1].slice(-6)}`;
      const fullCode = rawCode.slice(0, -3);
      const code = args.prefix ? fullCode : fullCode.slice(2);

      const sequence: {
        time: string;
        price: number;
        volume: number;
      }[] = [];

      for (let i = 2; i < info.length; i++) {
        const arr = info[i].split(" ");

        sequence.push({
          time: arr[0],
          price: parseFloat(arr[1]),
          volume: parseInt(arr[2]),
        });
      }

      result[code] = { date, sequence };
    }

    return result;
  }
}

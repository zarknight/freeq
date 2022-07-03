import BaseQuotation, { StockOption } from "./BaseQuotation";

export default class HKQuotation extends BaseQuotation {
  private regValidData: RegExp = /v_(.*?)=\"(.*?)\"/;

  get apiUrl(): string {
    return "http://sqt.gtimg.cn/utf8/q=";
  }

  protected generateStockPrefix(codes: string[]): string[] {
    return codes.map((code) => `r_hk${code}`);
  }

  formatResponseData(data: string[], args: StockOption): Record<string, any> {
    const result: Record<string, any> = {};
    const list = data.join("").replace(/\s/g, "").split(";");

    for (const item of list) {
      const matched = this.regValidData.exec(item);

      if (matched) {
        const info = matched[2].split("~");

        result[info[2]] = {
          lotSize: parseFloat(info[0]),
          name: info[1],
          price: parseFloat(info[3]),
          lastPrice: parseFloat(info[4]),
          openPrice: parseFloat(info[5]),
          amount: parseFloat(info[6]),
          time: info[30],
          dtd: parseFloat(info[32]),
          high: parseFloat(info[33]),
          low: parseFloat(info[34]),
        };
      }
    }

    return result;
  }
}

import BaseQuotation, { StockOption } from "./BaseQuotation";

export default class SinaQuotation extends BaseQuotation {
  private regValidData = /varhq_str_(\w{2})(\d+)=\"(.*?)\"/i;

  pageSize: number = 800;

  get apiUrl(): string {
    return `http://hq.sinajs.cn/rn=${Date.now()}&list=`;
  }

  formatResponseData(data: string[], args: StockOption): Record<string, any> {
    const result: Record<string, any> = {};
    const list = data.join("").replace(/\s/g, "").split(";");

    for (const item of list) {
      const matched = this.regValidData.exec(item);

      if (matched) {
        const info = matched[3].split(",");

        if (info.length < 29) continue;

        const code = args.prefix ? matched[1] + matched[2] : matched[2];

        result[code] = {
          code,
          name: info[0],
          open: parseFloat(info[1]),
          close: parseFloat(info[2]),
          now: parseFloat(info[3]),
          high: parseFloat(info[4]),
          low: parseFloat(info[5]),
          buy: parseFloat(info[6]),
          sell: parseFloat(info[7]),
          turnover: parseInt(info[8]),
          volume: parseFloat(info[9]),
          bid1_volume: parseInt(info[10]),
          bid1: parseFloat(info[11]),
          bid2_volume: parseInt(info[12]),
          bid2: parseFloat(info[13]),
          bid3_volume: parseInt(info[14]),
          bid3: parseFloat(info[15]),
          bid4_volume: parseInt(info[16]),
          bid4: parseFloat(info[17]),
          bid5_volume: parseInt(info[18]),
          bid5: parseFloat(info[19]),
          ask1_volume: parseInt(info[20]),
          ask1: parseFloat(info[21]),
          ask2_volume: parseInt(info[22]),
          ask2: parseFloat(info[23]),
          ask3_volume: parseInt(info[24]),
          ask3: parseFloat(info[25]),
          ask4_volume: parseInt(info[26]),
          ask4: parseFloat(info[27]),
          ask5_volume: parseInt(info[28]),
          ask5: parseFloat(info[29]),
          datetime: info[30] + " " + info[31],
        };
      }
    }

    return result;
  }

  protected getHeaders(): Record<string, string> {
    return {
      ...super.getHeaders(),
      Referer: "http://finance.sina.com.cn/",
    };
  }
}

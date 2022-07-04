import dayjs from "dayjs";
import { parseFloatSafe } from "../utils/helpers";
import BaseQuotation, { StockOption } from "./BaseQuotation";

export default class TencentQuotation extends BaseQuotation {
  private regValidData: RegExp = /v_(.*?)=\"(.*?)\"/;

  pageSize: number = 60;

  get apiUrl(): string {
    return "http://qt.gtimg.cn/q=";
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

        if (info.length < 50) continue;

        const code = args.prefix ? matched[1] ?? "" : info[2];

        result[code] = {
          code,
          name: info[1],
          now: parseFloat(info[3]),
          close: parseFloat(info[4]),
          open: parseFloat(info[5]),
          volume: parseFloat(info[6]) * 100,
          bid_volume: parseInt(info[7]) * 100,
          ask_volume: parseFloat(info[8]) * 100,
          bid1: parseFloat(info[9]),
          bid1_volume: parseInt(info[10]) * 100,
          bid2: parseFloat(info[11]),
          bid2_volume: parseInt(info[12]) * 100,
          bid3: parseFloat(info[13]),
          bid3_volume: parseInt(info[14]) * 100,
          bid4: parseFloat(info[15]),
          bid4_volume: parseInt(info[16]) * 100,
          bid5: parseFloat(info[17]),
          bid5_volume: parseInt(info[18]) * 100,
          ask1: parseFloat(info[19]),
          ask1_volume: parseInt(info[20]) * 100,
          ask2: parseFloat(info[21]),
          ask2_volume: parseInt(info[22]) * 100,
          ask3: parseFloat(info[23]),
          ask3_volume: parseInt(info[24]) * 100,
          ask4: parseFloat(info[25]),
          ask4_volume: parseInt(info[26]) * 100,
          ask5: parseFloat(info[27]),
          ask5_volume: parseInt(info[28]) * 100,
          最近逐笔成交: info[29],
          datetime: dayjs(info[30]).format("YYYY-MM-DD HH:mm:ss"),
          涨跌: parseFloat(info[31]),
          "涨跌(%)": parseFloat(info[32]),
          high: parseFloat(info[33]),
          low: parseFloat(info[34]),
          "价格/成交量(手)/成交额": info[35],
          "成交量(手)": parseInt(info[36]) * 100,
          "成交额(万)": parseFloat(info[37]) * 10000,
          turnover: parseFloatSafe(info[38]),
          PE: parseFloatSafe(info[39]),
          unknown: info[40],
          high_2: parseFloat(info[41]), // 意义不明
          low_2: parseFloat(info[42]), // 意义不明
          振幅: parseFloat(info[43]),
          流通市值: parseFloatSafe(info[44]),
          总市值: parseFloatSafe(info[45]),
          PB: parseFloat(info[46]),
          涨停价: parseFloat(info[47]),
          跌停价: parseFloat(info[48]),
          量比: parseFloatSafe(info[49]),
          委差: parseFloatSafe(info[50]),
          均价: parseFloatSafe(info[51]),
          "市盈(动)": parseFloatSafe(info[52]),
          "市盈(静)": parseFloatSafe(info[53]),
        };
      }
    }

    return result;
  }
}

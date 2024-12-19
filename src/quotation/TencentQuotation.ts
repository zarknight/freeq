import dayjs from "dayjs";
import { parseFloatSafe } from "../utils/helpers";
import BaseQuotation, { StockOption } from "./base/BaseQuotation";

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
          // 证券代码
          code,
          // 证券名称
          name: info[1],
          // 当前价格
          now: parseFloat(info[3]),
          // 昨日收盘价
          close: parseFloat(info[4]),
          // 今日开盘价
          open: parseFloat(info[5]),
          // 成交量
          volume: parseFloat(info[6]) * 100,
          // 成交额
          bid_volume: parseInt(info[7]) * 100,
          // 买卖盘
          ask_volume: parseFloat(info[8]) * 100,
          // 买一报价
          bid1: parseFloat(info[9]),
          // 买一申请股数
          bid1_volume: parseInt(info[10]) * 100,
          // 买二报价
          bid2: parseFloat(info[11]),
          // 买二申请股数
          bid2_volume: parseInt(info[12]) * 100,
          // 买三报价
          bid3: parseFloat(info[13]),
          // 买三申请股数
          bid3_volume: parseInt(info[14]) * 100,
          // 买四报价
          bid4: parseFloat(info[15]),
          // 买四申请股数
          bid4_volume: parseInt(info[16]) * 100,
          // 买五报价
          bid5: parseFloat(info[17]),
          // 买五申请股数
          bid5_volume: parseInt(info[18]) * 100,
          // 卖一报价
          ask1: parseFloat(info[19]),
          // 卖一申请股数
          ask1_volume: parseInt(info[20]) * 100,
          // 卖二报价
          ask2: parseFloat(info[21]),
          // 卖二申请股数
          ask2_volume: parseInt(info[22]) * 100,
          // 卖三报价
          ask3: parseFloat(info[23]),
          // 卖三申请股数
          ask3_volume: parseInt(info[24]) * 100,
          // 卖四报价
          ask4: parseFloat(info[25]),
          // 卖四申请股数
          ask4_volume: parseInt(info[26]) * 100,
          // 卖五报价
          ask5: parseFloat(info[27]),
          // 卖五申请股数
          ask5_volume: parseInt(info[28]) * 100,
          最近逐笔成交: info[29],
          datetime: dayjs(info[30]).format("YYYY-MM-DD HH:mm:ss"),
          涨跌: parseFloat(info[31]),
          涨跌百分比: parseFloat(info[32]),
          high: parseFloat(info[33]),
          low: parseFloat(info[34]),
          "价格/成交量(手)/成交额": info[35],
          "成交量(手)": parseInt(info[36]) * 100,
          "成交额(万)": parseFloat(info[37]) * 10000,
          turnover: parseFloatSafe(info[38]),
          PE: parseFloatSafe(info[39]),
          未知值: info[40],
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
          动态市盈: parseFloatSafe(info[52]),
          静态市盈: parseFloatSafe(info[53]),
        };
      }
    }

    return result;
  }
}

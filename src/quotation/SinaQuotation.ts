import BaseQuotation, { StockOption } from "./base/BaseQuotation";

export default class SinaQuotation extends BaseQuotation {
  private regValidData = /varhq_str_(\w{2})(\d+)=\"(.*?)\"/i;

  pageSize: number = 800;

  get apiUrl(): string {
    return `http://hq.sinajs.cn/rn=${Date.now()}&list=`;
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
        const info = matched[3].split(",");

        if (info.length < 29) continue;

        const code = args.prefix ? matched[1] + matched[2] : matched[2];

        result[code] = {
          // 证券代码
          code,
          // 证券名称
          name: info[0],
          // 今日开盘价
          open: parseFloat(info[1]),
          // 昨日收盘价
          close: parseFloat(info[2]),
          // 当前价格
          now: parseFloat(info[3]),
          // 今日最高价
          high: parseFloat(info[4]),
          // 今日最低价
          low: parseFloat(info[5]),
          // 竞买价，即“买一”报价
          buy: parseFloat(info[6]),
          // 竞卖价，即“卖一”报价
          sell: parseFloat(info[7]),
          // 成交股票数
          turnover: parseInt(info[8]),
          // 成交金额
          volume: parseFloat(info[9]),
          // 买一申请股数
          bid1_volume: parseInt(info[10]),
          // 买一报价
          bid1: parseFloat(info[11]),
          // 买二申请股数
          bid2_volume: parseInt(info[12]),
          // 买二报价
          bid2: parseFloat(info[13]),
          // 买三申请股数
          bid3_volume: parseInt(info[14]),
          // 买三报价
          bid3: parseFloat(info[15]),
          // 买四申请股数
          bid4_volume: parseInt(info[16]),
          // 买三报价
          bid4: parseFloat(info[17]),
          // 买五申请股数
          bid5_volume: parseInt(info[18]),
          // 买五报价
          bid5: parseFloat(info[19]),
          // 卖一申请股数
          ask1_volume: parseInt(info[20]),
          // 卖一报价
          ask1: parseFloat(info[21]),
          // 卖二申请股数
          ask2_volume: parseInt(info[22]),
          // 卖二报价
          ask2: parseFloat(info[23]),
          // 卖三申请股数
          ask3_volume: parseInt(info[24]),
          // 卖三报价
          ask3: parseFloat(info[25]),
          // 卖四申请股数
          ask4_volume: parseInt(info[26]),
          // 卖四报价
          ask4: parseFloat(info[27]),
          // 卖五申请股数
          ask5_volume: parseInt(info[28]),
          // 卖五报价
          ask5: parseFloat(info[29]),
          // 日期时间
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

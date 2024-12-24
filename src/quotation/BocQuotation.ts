import Quotation from "./base/Quotation";

const reg = /<td.*?>(.*?)<\/td>/gi;

export type ExchangeInfo = {
  // 货币名称
  name: string;

  // 现汇买入价
  buy: number;

  // 现钞卖出价
  sell: number;
};

/**
 * 中国银行外汇牌价（汇率查询）
 */
export default class BocQuotation implements Quotation {
  get apiUrl(): string {
    return "https://www.boc.cn/sourcedb/whpj/index.html";
  }

  /**
   * 获取最新100外币换算人民币汇率列表
   */
  async list(): Promise<ExchangeInfo[]> {
    const list: ExchangeInfo[] = [];

    try {
      const resp = await fetch(this.apiUrl);
      const data = await resp.text();
      const start = data.indexOf(
        '<table cellpadding="0" align="left" cellspacing="0" width="100%">'
      );
      const text = data.substring(start);

      let matches;
      let i = 0;
      let info: ExchangeInfo;

      while ((matches = reg.exec(text))) {
        const content = matches[1];
        const mod = i % 8;

        if (mod === 0) {
          info = { name: content } as ExchangeInfo;
        }

        if (mod === 1) {
          info!.buy = parseFloat(content || "0");
        } else if (mod === 3) {
          info!.sell = parseFloat(content || "0");
        }

        if (mod === 7) {
          list.push(info!);
        }

        i++;
      }
    } catch (e) {
      console.error(e);
    }

    return list;
  }

  /**
   * 获取中行指定货币的最新汇率
   * @param name 货币名称，比如："美元"
   */
  async real(
    codes: string | string[]
  ): Promise<Record<string, ExchangeInfo | undefined>> {
    const result: Record<string, ExchangeInfo | undefined> = {};
    const list = await this.list();
    const names: string[] = typeof codes === "string" ? [codes] : codes;

    names.forEach((name) => {
      result[name] = list.find((item) => item.name === name);
    });

    return result;
  }
}

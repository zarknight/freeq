import http from "../utils/request";
import Quotation from "./Quotation";

const reg = /<td.*?>(.*?)<\/td>/gi;

export type ExchangeInfo = {
  name: string;
  buy: number;
  sell: number;
};

export default class BocQuotation implements Quotation {
  get apiUrl(): string {
    return "https://www.boc.cn/sourcedb/whpj/index.html";
  }

  /**
   * 获取中行最新汇率列表
   */
  async list(): Promise<ExchangeInfo[]> {
    const { data } = await http.get<string>(this.apiUrl);
    const start = data.indexOf(
      '<table cellpadding="0" align="left" cellspacing="0" width="100%">'
    );
    const text = data.substring(start);
    const list: ExchangeInfo[] = [];

    let matches;
    let i = 0;
    let group: ExchangeInfo;

    while ((matches = reg.exec(text))) {
      const content = matches[1];
      const mod = i % 8;

      if (mod === 0) {
        group = { name: content } as ExchangeInfo;
      }

      if (mod === 1) {
        group!.buy = parseFloat(content || "0");
      } else if (mod === 3) {
        group!.sell = parseFloat(content || "0");
      }

      if (mod === 7) {
        list.push(group!);
      }

      i++;
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

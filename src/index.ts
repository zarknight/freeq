import BocQuotation from "./quotation/BocQuotation";
import HKQuotation from "./quotation/HKQuotation";
import KLineDayQuotation from "./quotation/KLineDayQuotation";
import KLineTimeQuotation from "./quotation/KLineTimeQuotation";
import Quotation from "./quotation/base/Quotation";
import SinaQuotation from "./quotation/SinaQuotation";
import TencentQuotation from "./quotation/TencentQuotation";

export * from "./utils/helpers";

export type QuotationSource = "hk" | "qq" | "sina" | "kday" | "ktime" | "boc";

export const use = (source: QuotationSource): Quotation => {
  // 港股行情
  if (source === "hk") {
    return new HKQuotation();
  }

  // 腾讯
  if (source === "qq") {
    return new TencentQuotation();
  }

  // 新浪
  if (source === "sina") {
    return new SinaQuotation();
  }

  // K线日行情
  if (source === "kday") {
    return new KLineDayQuotation();
  }

  // K线分时行情
  if (source === "ktime") {
    return new KLineTimeQuotation();
  }

  // 中国银行
  if (source === "boc") {
    return new BocQuotation();
  }

  throw new Error("No such quotation source");
};

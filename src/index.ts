import BocQuotation from "./quotation/BocQuotation";
import HKQuotation from "./quotation/HKQuotation";
import KLineDayQuotation from "./quotation/KLineDayQuotation";
import KLineTimeQuotation from "./quotation/KLineTimeQuotation";
import Quotation from "./quotation/Quotation";
import SinaQuotation from "./quotation/SinaQuotation";
import TencentQuotation from "./quotation/TencentQuotation";

export * from "./utils/helpers";

export type QuotationSource = "hk" | "qq" | "sina" | "kday" | "ktime" | "boc";

export const use = (source: QuotationSource): Quotation => {
  if (source === "hk") {
    return new HKQuotation();
  }

  if (source === "qq") {
    return new TencentQuotation();
  }

  if (source === "sina") {
    return new SinaQuotation();
  }

  if (source === "kday") {
    return new KLineDayQuotation();
  }

  if (source === "ktime") {
    return new KLineTimeQuotation();
  }

  if (source === "boc") {
    return new BocQuotation();
  }

  throw new Error("No Such Quotation Source");
};

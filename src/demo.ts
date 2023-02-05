import HKQuotation from "./quotation/HKQuotation";
import SinaQuotation from "./quotation/SinaQuotation";
import TencentQuotation from "./quotation/TencentQuotation";
import { getStockCodes, getStockType, use } from ".";

async function run() {
  // const q = use("hk");
  // const q = use("qq");
  // const q = use("sina");
  // const q = use("boc");
  const q = use("kday");
  // const q = use("ktime");

  // const res = await getStockCodes(false);
  // const res = getStockType("600143");
  const res = await q.real(["688312", "688533"], true);

  console.log(res);
}

run();

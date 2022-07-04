import HKQuotation from "./quotation/HKQuotation";
import SinaQuotation from "./quotation/SinaQuotation";
import TencentQuotation from "./quotation/TencentQuotation";
import { getStockCodes, getStockType, cacheStockCodes, use } from ".";

async function run() {
  // const res = await cacheStockCodes();
  // const res = await getStockCodes(false);
  // const res = getStockType('sz100000')
  // const q = use("hk");
  // const q = use("qq");
  // const q = use("sina")
  // const q = use("boc");
  const q = use("kday");
  const res = await q.real(["688312", "688533"], true);

  console.log(res);
}

run();

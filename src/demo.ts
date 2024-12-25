import { getStockCodeName, use } from ".";

async function run() {
  //   const q = use("hk");
  //   const q = use("qq");
  //   const q = use("sina");
  // const q = use("boc");
  //   const q = use("kday");
  //   const q = use("ktime");
  // const res = await q.real(["美元"], true);
  // console.log(res);
  const res1 = await getStockCodeName("贵州茅台", "cn");
  const res2 = await getStockCodeName("600588", "cn");
  const res3 = await getStockCodeName("小米集团", "hk");
  console.log(res1, res2, res3);
}

run();

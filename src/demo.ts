import { use } from ".";

async function run() {
  //   const q = use("hk");
  //   const q = use("qq");
  //   const q = use("sina");
  const q = use("boc");
  //   const q = use("kday");
  //   const q = use("ktime");
  const res = await q.real(["美元"], true);
  console.log(res);
}

run();

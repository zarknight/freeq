import { readFile, writeFile } from "fs/promises";
import path from "path";

const FILE_PATH = path.join(__dirname, "stock_list.json");

const reg = /~([a-z0-9]*)`/gi;

const prefixCodes = [
  "50",
  "51",
  "60",
  "90",
  "110",
  "113",
  "118",
  "132",
  "204",
  "5",
  "6",
  "9",
  "7",
];

export type StockType = "sh" | "sz" | "zz";

/**
 * 获取所有证券代码，并缓存到本地文件中
 */
export async function cacheStockCodes(): Promise<string[]> {
  // TODO: 该地址已不能用
  const url: string = "http://www.shdjt.com/js/lib/astock.js";
  const resp = await fetch(url);
  const data = await resp.text();

  let matches: RegExpExecArray | null;
  const codes: string[] = [];

  while ((matches = reg.exec(data))) {
    codes.push(matches[1]);
  }

  await writeFile(FILE_PATH, JSON.stringify({ stock: codes }), {
    encoding: "utf-8",
  });

  return codes;
}

/**
 * 获取所有证券代码
 * @param realtime 是否拉取远程最新数据
 */
export async function getStockCodes(
  useCache: boolean = true
): Promise<string[]> {
  if (useCache) {
    const json = await readFile(FILE_PATH, { encoding: "utf-8" });
    return JSON.parse(json).stock;
  }

  return cacheStockCodes();
}

/**
 * 获取证券代码对应的证券市场缩写
 * @param code
 */
export function getStockType(code: string): StockType {
  const prefix = (code.slice(0, 2) || "").toLowerCase();

  if (prefix === "sh" || prefix === "sz" || prefix === "zz") {
    return prefix;
  }

  return prefixCodes.some((v) => code.startsWith(v)) ? "sh" : "sz";
}

export function parseFloatSafe(value: string): number | null {
  try {
    return parseFloat(value);
  } catch (e) {}
  return null;
}

export type StockCodeName = {
  type: string;
  code: string;
  fullCode: string;
  name: string;
};

export async function getStockCodeName(
  keyword: string
): Promise<StockCodeName | null> {
  const resp = await fetch(
    `https://suggest3.sinajs.cn/suggest/type=11,12,13,14,15&key=${keyword}`,
    {
      headers: {
        "Accept-Encoding": "gzip, deflate, sdch",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 Safari/537.36",
        Referer: "http://finance.sina.com.cn/",
      },
    }
  );

  // 中文乱码问题
  const buffer = await resp.arrayBuffer();
  const decoder = new TextDecoder("gbk");
  const text = decoder.decode(new DataView(buffer));

  const regValidData: RegExp = /var(.*?)=\"(.*?)\"/;
  const matched = regValidData.exec(text);

  if (matched) {
    const item = matched[2].split(";")?.[0] || "";

    if (item) {
      const list = item.split(",");

      return {
        type: list[1],
        code: list[2],
        fullCode: list[3],
        name: list[4],
      };
    }
  }

  return null;
}

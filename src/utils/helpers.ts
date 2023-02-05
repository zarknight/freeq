import { readFile, writeFile } from "fs/promises";
import path from "path";
import http from "./request";

const FILE_PATH = path.join(__dirname, "stock_list.json");
const reg = /~([a-z0-9]*)`/gi;
const prefixes = [
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
  const url: string = "http://www.shdjt.com/js/lib/astock.js";
  const { data } = await http.get<string>(url);

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
 * 获取证券代码对应的证券市场
 * @param code
 */
export function getStockType(code: string): StockType {
  const prefix = code.slice(0, 2);
  if (prefix === "sh" || prefix === "sz" || prefix === "zz") {
    return prefix;
  }
  return prefixes.some((v) => code.startsWith(v)) ? "sh" : "sz";
}

export function parseFloatSafe(value: string): number | null {
  try {
    return parseFloat(value);
  } catch (e) {}
  return null;
}

import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { GameData, GameManager, MapData } from "../sushido";
import { Direction, Pos } from "../sushido/factory/type";

export type NeosGameData = {
  coin: number;
  day: number;
  menuCodes: string[];
  nextMenuCodes: string[];
  lostCount: number;
  totalCustomerCount: number;
  xLevel: number;
  yLevel: number;
  unitList: { id: string; code: string }[];
  mapData: { id: string; code: string; pos: Pos; direction: Direction }[];
};

export type NextGameData = {
  newMenuCodes: { code: string; needUnits: string[] }[];
  shopUnitCodes: { code: string; prise: number }[];
};

export type ReportGameData = {
  todayCoin: number;
  totalCustomerCount: number;
};

export function newNeosGameData(): NeosGameData {
  return {
    coin: 0,
    day: 0,
    nextMenuCodes: ["サーモンにぎり"],
    menuCodes: [
      "マグロにぎり",
      "鉄火巻",
      "ねぎとろ軍艦",
      "えびにぎり",
      "えびてん",
      "えびてんにぎり",
      "茶碗蒸し",
    ],
    lostCount: 0,
    totalCustomerCount: 0,
    xLevel: 1,
    yLevel: 0,
    unitList: [
      { id: uuidv4(), code: "マグロ箱" },
      { id: uuidv4(), code: "カウンター" },
      { id: uuidv4(), code: "カウンター" },
    ],
    mapData: [{ id: uuidv4(), code: "カウンター", pos: [1, 2], direction: 0 }],
  };
}

export function nextGameData(
  gm: GameManager,
  data: NeosGameData
): NeosGameData {
  return {
    ...data,
    coin: data.coin + gm.todayCoin,
    day: data.day + 1,
  };
}

export function convertNeosGameData(data: NeosGameData): [GameData, MapData] {
  return [
    {
      coin: data.coin,
      dayCount: data.day,
      menuCodes: [
        ...data.menuCodes,
        "マグロにぎり",
        "鉄火巻",
        "ねぎとろ軍艦",
        "えびにぎり",
        "えびてん",
        "ねぎとろ巻き",
        "えびてんにぎり",
        "サーモンにぎり",
        "あぶりサーモンにぎり",
        "たまごにぎり",
        "茶碗蒸し",
        "えびマヨ軍艦",
      ],
      dayTime: 20,
      customerSpawnRatio: 0.8,
      customerSpawnInterval: 5,
      maxCustomerCount: 10,
      customerModel: [
        {
          visualCode: "normal",
          maxOrderCount: 3,
          nextOrderRatio: 0.8,
          paymentScale: 1,
          patienceScale: 1,
          eatScale: 1,
          thinkingOrderScale: 1,
          pickWeight: 1,
          moveSpeed: 1,
        },
        {
          visualCode: "dart",
          maxOrderCount: 2,
          nextOrderRatio: 0.75,
          paymentScale: 0.5,
          patienceScale: 1,
          eatScale: 2,
          thinkingOrderScale: 1.5,
          pickWeight: 0.5,
          moveSpeed: 1.5,
        },
        {
          visualCode: "relax",
          maxOrderCount: 5,
          nextOrderRatio: 0.9,
          paymentScale: 1.5,
          patienceScale: 2,
          eatScale: 0.5,
          thinkingOrderScale: 0.5,
          pickWeight: 0.2,
          moveSpeed: 0.75,
        },
      ],
    },
    [
      ...data.mapData
        .map(({ code, pos, direction }) => [{ code, pos, direction }])
        .flatMap((v) => v)
        .filter((unit) => unit.pos[0] >= 0 && unit.pos[1] >= 0),
      { code: "ダイニングテーブル", pos: [0, -1], direction: 2 },
      { code: "ダイニングテーブル", pos: [1, -1], direction: 2 },
      { code: "ダイニングテーブル", pos: [2, -1], direction: 2 },
      { code: "ダイニングテーブル", pos: [3, -1], direction: 2 },
      { code: "ダイニングテーブル", pos: [4, -1], direction: 2 },
      { code: "ダイニングテーブル", pos: [5, -1], direction: 2 },
      { code: "ダイニングテーブル", pos: [6, -1], direction: 2 },
    ],
  ];
}

export function newGame(data: NeosGameData) {
  return new GameManager(...convertNeosGameData(data));
}

export function reportGame(gm: GameManager): ReportGameData {
  return {
    todayCoin: gm.todayCoin + gm.gameData.coin,
    totalCustomerCount: gm.totalCustomerCount,
  };
}

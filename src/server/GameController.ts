import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { GameData, GameManager, MapData } from "../sushido";
import { Direction, Pos } from "../sushido/factory/type";

export type NeosGameData = {
  coin: number;
  day: number;
  menuCodes: string[];
  newMenuCode: string;
  lostCount: number;
  totalCustomerCount: number;
  xLevel: number;
  yLevel: number;
  mapData: {
    code: string;
    pos: Pos;
    direction: Direction;
    prise: number;
  }[];
};

export type NextGameData = {
  newMenuCodes: { code: string; needUnits: string[] }[];
  shopUnitCodes: { code: string; prise: number }[];
};

export type ReportGameData = {
  todayCoin: number;
  totalCustomerCount: number;
};

const unitCodeList: { code: string; prise: number }[] = [
  { code: "カウンター", prise: 10 },
  { code: "コンロ", prise: 20 },
  { code: "自動にぎるくん", prise: 30 },
  { code: "ミキサー", prise: 30 },
  { code: "コンバイナ", prise: 30 },
  { code: "売却機", prise: 60 },
  { code: "コンベア", prise: 40 },
  { code: "直角コンベアR", prise: 50 },
  { code: "直角コンベアL", prise: 50 },
  // { code: "マグロ箱", prise: 10 },
  // { code: "サーモン箱", prise: 10 },
  // { code: "えび箱", prise: 10 },
  // { code: "てんぷらこ箱", prise: 10 },
  // { code: "なまたまご箱", prise: 10 },
  // { code: "のり箱", prise: 10 },
  // { code: "すめし箱", prise: 10 },
  // { code: "瓶箱", prise: 10 },
];

export function newNeosGameData(): NeosGameData {
  return {
    coin: 0,
    day: 0,
    menuCodes: ["マグロにぎり"],
    newMenuCode: "",
    lostCount: 0,
    totalCustomerCount: 0,
    xLevel: 0,
    yLevel: 0,
    mapData: [
      {
        code: "マグロ箱",
        pos: [2, 5],
        direction: 2,
        prise: 0,
      },
      {
        code: "すめし箱",
        pos: [1, 5],
        direction: 2,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [5, 5],
        direction: 1,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [5, 2],
        direction: 1,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [1, 3],
        direction: 1,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [1, 1],
        direction: 1,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [5, 4],
        direction: 1,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [2, 1],
        direction: 3,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [5, 3],
        direction: 1,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [2, 3],
        direction: 3,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [2, 2],
        direction: 3,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [1, 2],
        direction: 1,
        prise: 0,
      },
    ],
  };
}
function formatPos(pos: Pos) {
  return `[${pos[0]},${pos[1]}]`;
}
function getPoints(data: NeosGameData, count: number) {
  let result: Pos[] = [];
  const existMap: { [key: string]: string } = _.reduce(
    data.mapData,
    (prev, unit) => ({ ...prev, [formatPos(unit.pos)]: unit.code }),
    {}
  );
  for (let y = 0; y < 6 + data.yLevel * 3 && result.length < count; y++) {
    for (let x = 0; x < 6 + data.xLevel * 3 && result.length < count; x++) {
      const p = existMap[formatPos([x, y])];
      if (!p) {
        result.push([x, y]);
      }
    }
  }
  if (result.length < count) {
    for (let x = 6 + data.xLevel * 3; result.length < count; x++) {
      const p = existMap[formatPos([x, 0])];
      if (!p) {
        result.push([x, 0]);
      }
    }
  }
  return result;
}

export function nextGameData(
  gm: GameManager,
  data: NeosGameData
): NeosGameData {
  return {
    ...data,
    coin: data.coin + gm.todayCoin,
    day: data.day + 1,
    mapData: [
      ...data.mapData.filter((unit) => unit.prise === 0),
      ...getPoints(data, 4)
        .map((pos): NeosGameData["mapData"][0][] => {
          const unit = _.sample(unitCodeList);
          return unit
            ? [{ code: unit.code, pos, direction: 0, prise: unit.prise }]
            : [];
        })
        .flatMap((v) => v),
    ],
  };
}

export function convertNeosGameData(data: NeosGameData): [GameData, MapData] {
  const xMax = 6 + data.xLevel * 3;
  const yMax = 6 + data.yLevel * 3;
  return [
    {
      coin: data.coin,
      dayCount: data.day,
      menuCodes: data.menuCodes,
      dayTime: 20,
      xMax: xMax,
      yMax: yMax,
      customerSpawnRatio: 0.8,
      customerSpawnInterval: 5,
      maxCustomerCount: 10,
      customerModel: [
        {
          visualCode: "normal",
          maxOrderCount: 3,
          nextOrderRatio: 0.8,
          paymentScale: 1,
          patienceScale: 2,
          eatScale: 1,
          thinkingOrderScale: 1,
          pickWeight: 1,
          moveSpeed: 2,
        },
        {
          visualCode: "dart",
          maxOrderCount: 2,
          nextOrderRatio: 0.75,
          paymentScale: 0.5,
          patienceScale: 2,
          eatScale: 2,
          thinkingOrderScale: 1.5,
          pickWeight: 0.5,
          moveSpeed: 3,
        },
        {
          visualCode: "relax",
          maxOrderCount: 5,
          nextOrderRatio: 0.9,
          paymentScale: 1.5,
          patienceScale: 3,
          eatScale: 0.5,
          thinkingOrderScale: 0.5,
          pickWeight: 0.2,
          moveSpeed: 1.5,
        },
      ],
    },
    [
      ...data.mapData
        .filter(
          (unit) =>
            unit.prise === 0 &&
            unit.pos[0] >= 0 &&
            unit.pos[1] >= 0 &&
            unit.pos[0] < xMax &&
            unit.pos[1] < yMax
        )
        .map(({ code, pos, direction }) => [{ code, pos, direction }])
        .flatMap((v) => v),
      ..._.range(xMax).map((i): MapData[0] => ({
        code: "ダイニングテーブル",
        pos: [i, -1],
        direction: 2,
      })),
    ],
  ];
}

export function newGame(data: NeosGameData) {
  return new GameManager(...convertNeosGameData(data));
}

export function reportGame(gm: GameManager): ReportGameData {
  return {
    todayCoin: gm.todayCoin,
    totalCustomerCount: gm.totalCustomerCount,
  };
}

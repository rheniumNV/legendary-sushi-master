import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { GameData, GameManager, MapData } from "../sushido";
import { Direction, Pos } from "../sushido/factory/type";
import { SushiUnitModels } from "../sushido/models/SUnitModels";

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
  { code: "カウンター", prise: 200 },
  { code: "コンロ", prise: 400 },
  { code: "自動にぎるくん", prise: 800 },
  { code: "ミキサー", prise: 500 },
  { code: "コンバイナ", prise: 600 },
  { code: "売却機", prise: 2000 },
  { code: "コンベア", prise: 800 },
  { code: "直角コンベアR", prise: 900 },
  { code: "直角コンベアL", prise: 900 },
  { code: "コンベアミキサー", prise: 3000 },
  { code: "コンベア自動にぎるくん", prise: 4000 },
  { code: "コンベアコンロ", prise: 3500 },
  { code: "コンベアコンバイナ", prise: 5000 },
];

const supplyUnitCodeList = [
  { code: "マグロ箱", prise: 600 },
  { code: "サーモン箱", prise: 600 },
  { code: "えび箱", prise: 600 },
  { code: "てんぷらこ箱", prise: 300 },
  { code: "なまたまご箱", prise: 400 },
  { code: "のり箱", prise: 300 },
  { code: "すめし箱", prise: 600 },
  { code: "瓶箱", prise: 300 },
  { code: "たこ箱", prise: 300 },
];

type MenuConfig = {
  code: string;
  requireUnit: string[];
  level: number;
};

const menuList: MenuConfig[] = [
  {
    code: "サーモンにぎり",
    level: 1,
    requireUnit: ["すめし箱", "サーモン箱", "カウンター"],
  },
  {
    code: "えびにぎり",
    level: 1,
    requireUnit: ["すめし箱", "えび箱", "カウンター"],
  },
  {
    code: "たこにぎり",
    level: 1,
    requireUnit: ["すめし箱", "たこ箱", "カウンター"],
  },
  {
    code: "鉄火巻",
    level: 2,
    requireUnit: ["マグロ箱", "のり箱", "すめし箱"],
  },
  {
    code: "あぶりサーモンにぎり",
    level: 2,
    requireUnit: ["すめし箱", "サーモン箱", "カウンター", "コンロ"],
  },
  {
    code: "ねぎとろ巻き",
    level: 3,
    requireUnit: ["すめし箱", "マグロ箱", "カウンター", "のり箱"],
  },
  {
    code: "ねぎとろ軍艦",
    level: 3,
    requireUnit: ["すめし箱", "マグロ箱", "カウンター", "のり箱"],
  },
  {
    code: "茶碗蒸し",
    level: 3,
    requireUnit: ["なまたまご箱", "カウンター", "コンロ", "えび箱", "瓶箱"],
  },
  {
    code: "たまごにぎり",
    level: 3,
    requireUnit: ["すめし箱", "なまたまご箱", "カウンター", "コンロ", "のり箱"],
  },
  {
    code: "えびてん",
    level: 3,
    requireUnit: [
      "なまたまご箱",
      "えび箱",
      "てんぷらこ箱",
      "コンロ",
      "カウンター",
    ],
  },
  {
    code: "えびてんにぎり",
    level: 4,
    requireUnit: [
      "なまたまご箱",
      "えび箱",
      "てんぷらこ箱",
      "コンロ",
      "すめし箱",
      "カウンター",
    ],
  },
  {
    code: "ツナマヨ軍艦",
    level: 4,
    requireUnit: [
      "なまたまご箱",
      "マグロ箱",
      "コンロ",
      "すめし箱",
      "のり箱",
      "カウンター",
    ],
  },
  {
    code: "えびアボカド軍艦",
    level: 3,
    requireUnit: ["アボカド箱", "えび箱", "すめし箱", "のり箱", "カウンター"],
  },
  {
    code: "アボカドサーモンにぎり",
    level: 2,
    requireUnit: ["アボカド箱", "サーモン箱", "すめし箱", "カウンター"],
  },
  {
    code: "えびマヨ軍艦",
    level: 4,
    requireUnit: [
      "えび箱",
      "なまたまご箱",
      "サーモン箱",
      "すめし箱",
      "カウンター",
    ],
  },
  {
    code: "カリフォルニアロール",
    level: 2,
    requireUnit: [
      "アボカド箱",
      "サーモン箱",
      "すめし箱",
      "のり箱",
      "カウンター",
    ],
  },
];

function getNewMenu(data: NeosGameData): MenuConfig | undefined {
  const maxMenuLevel =
    _.max(
      data.menuCodes.map(
        (c) => _.find(menuList, ({ code }) => c === code)?.level ?? 0
      )
    ) ?? 0;
  const setting: { min: number; max: number } | undefined = (() => {
    switch (data.day) {
      case 0:
        return { min: 1, max: 1 };
      case 2:
        return { min: 1, max: 3 };
      case 4:
        return maxMenuLevel >= 2 ? { min: 1, max: 3 } : { min: 2, max: 3 };
      case 6:
        return maxMenuLevel >= 3 ? { min: 1, max: 4 } : { min: 3, max: 4 };
      case 8:
        return { min: 1, max: 4 };
      default:
        return data.day % 2 == 0 ? { min: 1, max: 4 } : undefined;
    }
  })();
  /*
    1(1)
    3(1-3)
    5(1-3)-(2-3)
    7(1-4)-(3-4)
    9(1-4)

    1:100
    2:150
    3:250
    4:400
    */
  if (!setting) {
    return undefined;
  }
  return _.sample(
    menuList.filter(
      (menu) =>
        !_.includes(data.menuCodes, menu.code) &&
        menu.level >= setting.min &&
        menu.level <= setting.max
    )
  );
}

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
        pos: [5, 1],
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
      {
        code: "ゴミ箱",
        pos: [5, 5],
        direction: 1,
        prise: 0,
      },
    ],
  };
}
function formatPos(pos: Pos) {
  return `[${pos[0]},${pos[1]}]`;
}
function getPoints(
  mapData: NeosGameData["mapData"],
  xLevel: number,
  yLevel: number,
  count: number
) {
  let result: Pos[] = [];
  const existMap: { [key: string]: string } = _.reduce(
    mapData,
    (prev, unit) => ({ ...prev, [formatPos(unit.pos)]: unit.code }),
    {}
  );
  for (let y = 0; y < 6 + yLevel * 3 && result.length < count; y++) {
    for (let x = 0; x < 6 + xLevel * 3 && result.length < count; x++) {
      const p = existMap[formatPos([x, y])];
      if (!p) {
        result.push([x, y]);
      }
    }
  }
  if (result.length < count) {
    for (let x = 6 + xLevel * 3; result.length < count; x++) {
      const p = existMap[formatPos([x, 0])];
      if (!p) {
        result.push([x, 0]);
      }
    }
  }
  return result;
}

function joinUnits(
  mapData: NeosGameData["mapData"],
  xLevel: number,
  yLevel: number,
  units: NeosGameData["mapData"]
) {
  return [
    ...mapData,
    ...getPoints(mapData, xLevel, yLevel, units.length).map(
      (pos: Pos, index: number) => {
        return { ...units[index], pos };
      }
    ),
  ];
}

export function nextGameData(
  gm: GameManager,
  data: NeosGameData
): NeosGameData {
  const coin = data.coin + gm.todayCoin;
  const newMenu = getNewMenu(data);
  const exitUnitCodes = _.uniq(data.mapData.map((v) => v.code));
  const prevMapData = data.mapData.filter((unit) => unit.prise === 0);
  const bluePrintCount = 4 + data.xLevel + data.yLevel;
  const mapData = joinUnits(
    newMenu
      ? joinUnits(
          prevMapData,
          data.xLevel,
          data.yLevel,
          newMenu.requireUnit
            .filter((code) => !_.includes(exitUnitCodes, code))
            .map((code) => ({
              code,
              pos: [0, 0],
              direction: 0,
              prise: 0,
            }))
        )
      : prevMapData,
    data.xLevel,
    data.yLevel,
    _.range(bluePrintCount)
      .map((_i): NeosGameData["mapData"] => {
        const unit = _.sample(unitCodeList.filter((v) => v.prise <= coin));
        return unit
          ? [{ code: unit.code, prise: unit.prise, pos: [0, 0], direction: 0 }]
          : [];
      })
      .flatMap((v) => v)
  );

  return {
    ...data,
    coin,
    day: data.day + 1,
    menuCodes: newMenu ? [...data.menuCodes, newMenu.code] : data.menuCodes,
    newMenuCode: newMenu?.code ?? "",
    mapData,
  };
}

const allUnitCodes = _.uniq(_.map(SushiUnitModels, (unit) => unit.code));

export function convertNeosGameData(data: NeosGameData): [GameData, MapData] {
  const xMax = 6 + data.xLevel * 3;
  const yMax = 6 + data.yLevel * 3;

  return [
    {
      coin: data.coin,
      dayCount: data.day,
      menuCodes: data.menuCodes,
      dayTime: 40,
      xMax: xMax,
      yMax: yMax,
      customerSpawnRatio: 0.3,
      customerSpawnInterval: 1,
      maxCustomerCount: xMax * 2 - 1,
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
            unit.pos[1] < yMax &&
            _.includes(allUnitCodes, unit.code)
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

import _ from "lodash";
import { GameData, GameManager, MapData } from "../sushido";
import { Direction, Pos } from "../sushido/factory/type";
import { SushiUnitModels } from "../sushido/models/SUnitModels";

export function pickSample<T>(list: T[], getWeight: (value: T) => number) {
  const sumWeight = _.sumBy(list, (v: T) => getWeight(v));
  const point = Math.random() * sumWeight;
  let cursor = 0;
  for (let i = 0; i < list.length && cursor <= point; i++) {
    const weight = getWeight(list[i]);
    cursor += weight;
    if (cursor > point) {
      return list[i];
    }
  }
}

export type NeosGameData = {
  score: number;
  coin: number;
  day: number;
  rankScore: number;
  rank: string;
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

export type ReportGameData = {
  todayCoin: number;
  totalCustomerCount: number;
  score: number;
  rankScore: number;
  rank: string;
};

const unitCodeList: { code: string; prise: number; weight: number }[] = [
  { code: "カウンター", prise: 200, weight: 1 },
  { code: "コンロ", prise: 400, weight: 1 },
  { code: "自動にぎるくん", prise: 800, weight: 2 },
  { code: "ミキサー", prise: 500, weight: 1 },
  { code: "コンバイナ", prise: 600, weight: 1 },
  { code: "コンベア", prise: 500, weight: 2 },
  { code: "直角コンベアR", prise: 900, weight: 1 },
  { code: "直角コンベアL", prise: 900, weight: 1 },
  { code: "売却機", prise: 2000, weight: 0.5 },
  { code: "コンベアミキサー", prise: 4000, weight: 0.5 },
  { code: "コンベア自動にぎるくん", prise: 5000, weight: 0.5 },
  { code: "コンベアコンロ", prise: 3500, weight: 0.5 },
  { code: "コンベアコンバイナ", prise: 6000, weight: 0.5 },
];

const supplyUnitCodeList = [
  { code: "マグロ箱", prise: 600, weight: 0.5 },
  { code: "サーモン箱", prise: 600, weight: 0.5 },
  { code: "えび箱", prise: 600, weight: 0.5 },
  { code: "てんぷらこ箱", prise: 300, weight: 0.5 },
  { code: "なまたまご箱", prise: 500, weight: 0.5 },
  { code: "のり箱", prise: 400, weight: 0.5 },
  { code: "すめし箱", prise: 800, weight: 1 },
  { code: "瓶箱", prise: 300, weight: 0.5 },
  { code: "たこ箱", prise: 300, weight: 0.5 },
  { code: "いか箱", prise: 300, weight: 0.5 },
  { code: "アボカド箱", prise: 500, weight: 0.5 },
];

type MenuConfig = {
  code: string;
  requireUnit: string[];
  level: number;
};

const menuList: MenuConfig[] = [
  {
    code: "マグロにぎり",
    level: 1,
    requireUnit: ["マグロ箱", "カウンター", "すめし箱"],
  },
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
    code: "いかにぎり",
    level: 1,
    requireUnit: ["すめし箱", "いか箱", "カウンター"],
  },
  {
    code: "いかたこにぎり",
    level: 2,
    requireUnit: ["すめし箱", "いか箱", "たこ箱", "カウンター"],
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
        return data.day > 9 && (data.day - 1) % 3 == 0
          ? { min: 1, max: 4 }
          : undefined;
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
    score: 0,
    coin: 0,
    day: 0,
    rankScore: 0,
    rank: "",
    menuCodes: ["マグロにぎり"],
    newMenuCode: "",
    lostCount: 0,
    totalCustomerCount: 0,
    xLevel: 0,
    yLevel: 0,
    mapData: [
      {
        code: "マグロ箱",
        pos: [3, 5],
        direction: 2,
        prise: 0,
      },
      {
        code: "すめし箱",
        pos: [2, 5],
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
        pos: [3, 3],
        direction: 3,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [3, 1],
        direction: 3,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [2, 1],
        direction: 1,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [2, 3],
        direction: 1,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [2, 2],
        direction: 1,
        prise: 0,
      },
      {
        code: "カウンター",
        pos: [3, 2],
        direction: 3,
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

function getRequireUnitCodes(menuCodes: string[]) {
  return _.uniq(
    menuCodes
      .map((c) => {
        const option = _.find(menuList, ({ code }) => code === c);
        return option?.requireUnit ?? [];
      })
      .flatMap((v) => v)
  );
}

export type DataError = {
  code: string;
  message: { en: string; ja: string };
  pointMessages: { pos: Pos; en: string; ja: string }[];
};

export type NeosDataError = {
  messages: { en: string; ja: string }[];
  pointMessages: { pos: Pos; en: string; ja: string }[];
};

export function getErrors(data: NeosGameData): NeosDataError {
  let errors: DataError[] = [];
  const xMax = 6 + data.xLevel * 3;
  const yMax = 6 + data.yLevel * 3;

  const mapUnits = data.mapData.filter((unit) => unit.prise === 0);
  const mapActiveUnit = mapUnits.filter(
    (unit) =>
      unit.pos[0] >= 0 &&
      unit.pos[1] >= 0 &&
      unit.pos[0] < xMax &&
      unit.pos[1] < yMax
  );

  //level
  if (
    data.xLevel > 2 ||
    data.yLevel > 2 ||
    data.xLevel < 0 ||
    data.yLevel < 0
  ) {
    errors.push({
      code: "SpaceLevelError",
      message: {
        en: "The store is unjustly large.",
        ja: "お店が不正な広さです",
      },
      pointMessages: [],
    });
  }

  //unknown unit
  const unknownUnits = data.mapData.filter(
    (unit) => !_.includes(allUnitCodes, unit.code)
  );
  if (unknownUnits.length > 0) {
    errors.push({
      code: "UnknownUnitError",
      message: {
        en: "There is an unknown unit.",
        ja: "不明なユニットがあります",
      },
      pointMessages: unknownUnits.map((unit) => ({
        pos: unit.pos,
        en: "Unknown Unit.",
        ja: "不明なユニットです",
      })),
    });
  }

  //unit stacks
  const stackUnits = _.filter(
    _.groupBy(mapActiveUnit, ({ pos }) => formatPos(pos)),
    (list) => list.length > 1
  );
  if (stackUnits.length > 0) {
    errors.push({
      code: "UnitStackError",
      message: {
        en: "There are overlapping units.",
        ja: "重なっているユニットがあります",
      },
      pointMessages: stackUnits.map((units) => ({
        pos: units[0].pos,
        en: "This unit is overlapping.",
        ja: "ユニットが重なっています",
      })),
    });
  }

  //lost require unit
  const requireUnitCodes = getRequireUnitCodes(data.menuCodes);
  const lostRequireUnitCodes = requireUnitCodes.filter(
    (code) =>
      !mapUnits.some(
        (unit) =>
          unit.code === code &&
          unit.pos[0] >= 0 &&
          unit.pos[1] >= 0 &&
          unit.pos[0] < xMax &&
          unit.pos[1] < yMax
      )
  );
  if (lostRequireUnitCodes.length > 0) {
    errors.push({
      code: "LostUnitError",
      message: {
        en: "There are some menus that cannot be made due to lack of units.",
        ja: "ユニットが足りず作れないメニューがあります",
      },
      pointMessages: lostRequireUnitCodes
        .map((code) =>
          mapUnits
            .filter((unit) => unit.code === code)
            .map((unit) => ({
              pos: unit.pos,
              en: "There are menu items that cannot be made without this unit.",
              ja: `このユニットがないと作れないメニューがあります`,
            }))
        )
        .flatMap((v) => v),
    });
  }
  return {
    messages: errors.map(({ message }) => message),
    pointMessages: errors
      .map(({ pointMessages }) => pointMessages)
      .flatMap((v) => v),
  };
}

export function nextGameData(
  gm: GameManager,
  data: NeosGameData
): NeosGameData {
  const coin = data.coin + gm.todayCoin;
  const newMenu = getNewMenu(data);
  const menuCodes = newMenu
    ? [...data.menuCodes, newMenu.code]
    : data.menuCodes;
  const prevMapData = data.mapData.filter((unit) => unit.prise === 0);
  const exitUnitCodes = _.uniq(prevMapData.map((v) => v.code));
  const bluePrintCount = 4 + data.xLevel + data.yLevel;
  const requireUnitCodes = getRequireUnitCodes(menuCodes);
  const bluePrintNormalUnitList = unitCodeList.filter((v) => v.prise <= coin);
  const bluePrintSupplyUnitList = supplyUnitCodeList.filter(
    (v) => _.includes(requireUnitCodes, v.code) && v.prise <= coin
  );
  let supplyCount = 0;
  const bluePrintCodes = _.range(bluePrintCount).map(() => {
    const unit = pickSample(
      supplyCount > 1
        ? bluePrintNormalUnitList
        : [...bluePrintNormalUnitList, ...bluePrintSupplyUnitList],
      (u) => u.weight
    );
    if (_.includes(bluePrintSupplyUnitList, unit)) {
      supplyCount++;
    }
    return unit;
  });

  const today = new Date();
  const isAprilFool = today.getMonth() === 3 && today.getDate() === 1;

  const mapData = [
    ...(newMenu
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
      : prevMapData),
    ...[
      ...bluePrintCodes,
      ...(isAprilFool ? [{ code: "ネオロイド箱", prise: 200 }] : []),
    ]
      .map((unit, i): NeosGameData["mapData"] => {
        return unit
          ? [
              {
                code: unit.code,
                prise: unit.prise,
                pos: [i, -2],
                direction: 0,
              },
            ]
          : [];
      })
      .flatMap((v) => v),
  ];

  const score = gm.score;
  const rankScore = data.day === 9 ? score : data.rankScore;
  const rank =
    data.day === 9
      ? score > 80000
        ? "SS"
        : score > 40000
        ? "S"
        : score > 20000
        ? "A"
        : score > 10000
        ? "B"
        : "C"
      : data.rank;

  return {
    ...data,
    score,
    coin,
    rankScore,
    rank,
    day: data.day + 1,
    menuCodes,
    newMenuCode: newMenu?.code ?? "",
    totalCustomerCount: data.totalCustomerCount + gm.totalCustomerCount,
    mapData,
  };
}

export function reroll(data: NeosGameData): NeosGameData {
  const bluePrintCount = data.mapData.filter((u) => u.prise > 0).length;
  const cleanMap = data.mapData.filter((u) => u.prise === 0);
  const requireUnitCodes = getRequireUnitCodes(data.menuCodes);
  const bluePrintUnitList = [
    ...unitCodeList.filter((v) => v.prise <= data.coin),
    ...supplyUnitCodeList.filter((v) => _.includes(requireUnitCodes, v.code)),
  ];
  return {
    ...data,
    mapData: joinUnits(
      cleanMap,
      data.xLevel,
      data.yLevel,
      _.range(bluePrintCount)
        .map((_i): NeosGameData["mapData"] => {
          const unit = _.sample(bluePrintUnitList);
          return unit
            ? [
                {
                  code: unit.code,
                  prise: unit.prise,
                  pos: [0, 0],
                  direction: 0,
                },
              ]
            : [];
        })
        .flatMap((v) => v)
    ),
  };
}

const allUnitCodes = _.uniq(_.map(SushiUnitModels, (unit) => unit.code));

export function convertNeosGameData(data: NeosGameData): [GameData, MapData] {
  const xMax = 6 + data.xLevel * 3;
  const yMax = 6 + data.yLevel * 3;

  return [
    {
      score: data.score,
      coin: data.coin,
      dayCount: data.day,
      menuCodes: data.menuCodes,
      dayTime: Math.min(Math.max(60, data.day * 5 + 40), 180),
      xMax: xMax,
      yMax: yMax,
      customerSpawnRatio: 0.3,
      customerSpawnInterval: 2,
      maxCustomerCount: xMax * 2 - 1,
      customerModel: [
        {
          visualCode: "あぶすと",
          maxOrderCount: 3,
          nextOrderRatio: 0.8,
          paymentScale: 1,
          patienceScale: 1,
          eatScale: 1,
          thinkingOrderScale: 0.5,
          pickWeight: 0.5,
          moveSpeed: 1,
        },
        {
          visualCode: "むにょわ",
          maxOrderCount: 2,
          nextOrderRatio: 1,
          paymentScale: 1,
          patienceScale: 1,
          eatScale: 1,
          thinkingOrderScale: 0.5,
          pickWeight: 0.5,
          moveSpeed: 0.8,
        },
        {
          visualCode: "むにょに",
          maxOrderCount: 2,
          nextOrderRatio: 1,
          paymentScale: 1,
          patienceScale: 1,
          eatScale: 1,
          thinkingOrderScale: 0.5,
          pickWeight: 0.5,
          moveSpeed: 0.8,
        },
        {
          visualCode: "にんじん",
          maxOrderCount: 6,
          nextOrderRatio: 0.6,
          paymentScale: 1,
          patienceScale: 1,
          eatScale: 2,
          thinkingOrderScale: 0.5,
          pickWeight: 0.5,
          moveSpeed: 1,
        },
        {
          visualCode: "ねおねこ",
          maxOrderCount: 3,
          nextOrderRatio: 0.8,
          paymentScale: 1,
          patienceScale: 1,
          eatScale: 1,
          thinkingOrderScale: 0.7,
          pickWeight: 0.5,
          moveSpeed: 1,
        },
        {
          visualCode: "ねおふぁ",
          maxOrderCount: 3,
          nextOrderRatio: 0.8,
          paymentScale: 1,
          patienceScale: 1,
          eatScale: 1,
          thinkingOrderScale: 0.5,
          pickWeight: 0.5,
          moveSpeed: 1,
        },
        {
          visualCode: "れにうむ",
          maxOrderCount: 3,
          nextOrderRatio: 0.5,
          paymentScale: 1,
          patienceScale: 1,
          eatScale: 1.5,
          thinkingOrderScale: 1,
          pickWeight: 0.5,
          moveSpeed: 1.2,
        },
        {
          visualCode: "おれんじ",
          maxOrderCount: 3,
          nextOrderRatio: 0.8,
          paymentScale: 1.5,
          patienceScale: 2,
          eatScale: 2,
          thinkingOrderScale: 1,
          pickWeight: 0.5,
          moveSpeed: 2,
        },
        {
          visualCode: "まるしば",
          maxOrderCount: 3,
          nextOrderRatio: 0.8,
          paymentScale: 1,
          patienceScale: 0.7,
          eatScale: 0.7,
          thinkingOrderScale: 0.5,
          pickWeight: 0.5,
          moveSpeed: 0.7,
        },
        {
          visualCode: "けつじょ",
          maxOrderCount: 6,
          nextOrderRatio: 0.9,
          paymentScale: 1,
          patienceScale: 0.7,
          eatScale: 3,
          thinkingOrderScale: 0.3,
          pickWeight: 0.5,
          moveSpeed: 1.3,
        },
        {
          visualCode: "かずかず",
          maxOrderCount: 3,
          nextOrderRatio: 0.4,
          paymentScale: 1.2,
          patienceScale: 0.6,
          eatScale: 1,
          thinkingOrderScale: 0.4,
          pickWeight: 0.5,
          moveSpeed: 1.5,
        },
        {
          visualCode: "ぞぞかす",
          maxOrderCount: 3,
          nextOrderRatio: 0.3,
          paymentScale: 1,
          patienceScale: 2,
          eatScale: 1,
          thinkingOrderScale: 2,
          pickWeight: 0.5,
          moveSpeed: 1.7,
        },
        {
          visualCode: "ぐへへへ",
          maxOrderCount: 3,
          nextOrderRatio: 0.6,
          paymentScale: 1.1,
          patienceScale: 0.6,
          eatScale: 0.8,
          thinkingOrderScale: 1,
          pickWeight: 0.5,
          moveSpeed: 1.5,
        },
        {
          visualCode: "まちよう",
          maxOrderCount: 4,
          nextOrderRatio: 0.4,
          paymentScale: 1.1,
          patienceScale: 0.5,
          eatScale: 1,
          thinkingOrderScale: 1,
          pickWeight: 0.5,
          moveSpeed: 0.8,
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

export function reportGame(
  gm: GameManager,
  data: NeosGameData
): ReportGameData {
  return {
    todayCoin: gm.todayCoin,
    totalCustomerCount: gm.totalCustomerCount,
    score: gm.score,
    rankScore: data.rankScore,
    rank: data.rank,
  };
}

import { Customer, CustomerModel } from "./Customer";
import { FactoryManager } from "./factory/FactoryManager";
import { Direction, Pos, SObjModel, SUnitOptions } from "./factory/type";

export type GameEvent =
  | { code: "grabObj"; userId: string; objId: string }
  | { code: "releaseObj"; userId: string; unitId: string }
  | {
      code: "startInteractUnit";
      userId: string;
      unitId: string;
    }
  | {
      code: "endInteractUnit";
      userId: string;
      unitId: string;
    };

export type FactoryModel = {
  unitModel: { [key: string]: SUnitOptions };
  objModel: { [key: string]: SObjModel };
};

export type GameData = {
  coin: number;
  dayCount: number;
  menuCodes: string[];
  dayTime: number;
  customerSpawnRatio: number;
  customerSpawnInterval: number;
  maxCustomerCount: number;
  customerModel: CustomerModel[];
};

export type MapData = {
  code: string;
  pos: [number, number];
  direction: Direction;
}[];

export type GameReport = {};

const defaultGame: GameData = {
  coin: 0,
  dayCount: 0,
  menuCodes: ["マグロにぎり", "鉄火巻", "ねぎとろ巻き", "ねぎとろ軍艦"],
  dayTime: 60,
  customerSpawnRatio: 0.7,
  customerSpawnInterval: 1,
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
};

const defaultMap: MapData = [
  { code: "マグロ箱", pos: [0, 0], direction: 0 },
  { code: "すめし箱", pos: [1, 0], direction: 0 },
  { code: "コンベア", pos: [0, 1], direction: 0 },
  { code: "コンベア", pos: [2, 0], direction: 3 },
  { code: "コンベア", pos: [2, 1], direction: 0 },
  { code: "コンベア", pos: [2, 3], direction: 0 },
  { code: "自動にぎるくん", pos: [2, 2], direction: 0 },
  { code: "ミキサー", pos: [0, 2], direction: 0 },
  { code: "コンベア", pos: [0, 3], direction: 0 },
  { code: "コンベア", pos: [1, 4], direction: 1 },
  { code: "コンバイナ", pos: [2, 4], direction: 0 },
  { code: "コンベア", pos: [3, 4], direction: 1 },
  { code: "のり箱", pos: [4, 4], direction: 0 },
  { code: "コンバイナ", pos: [0, 4], direction: 0 },
  { code: "コンベア", pos: [0, 5], direction: 0 },
  { code: "売却機", pos: [0, 6], direction: 0 },
  { code: "コンベア", pos: [3, 0], direction: 3 },
  { code: "コンバイナ", pos: [4, 0], direction: 0 },
  { code: "コンベア", pos: [5, 0], direction: 3 },
  { code: "コンバイナ", pos: [6, 0], direction: 0 },
  { code: "コンベア", pos: [7, 0], direction: 1 },
  { code: "マグロ箱", pos: [8, 0], direction: 0 },
  { code: "コンベア", pos: [8, 1], direction: 0 },
  { code: "ミキサー", pos: [8, 2], direction: 0 },
  { code: "コンベア", pos: [7, 2], direction: 1 },
  { code: "コンバイナ", pos: [6, 2], direction: 0 },
  { code: "コンベア", pos: [5, 2], direction: 3 },
  { code: "コンベア", pos: [5, 1], direction: 0 },
  { code: "のり箱", pos: [4, -2], direction: 0 },
  { code: "コンベア", pos: [4, -1], direction: 0 },
  { code: "コンベア", pos: [6, -1], direction: 2 },
  { code: "売却機", pos: [6, -2], direction: 0 },
  { code: "コンベア", pos: [6, 3], direction: 0 },
  { code: "売却機", pos: [6, 4], direction: 0 },
  { code: "えび箱", pos: [2, 6], direction: 0 },
  { code: "コンベア", pos: [3, 6], direction: 3 },
  { code: "コンバイナ", pos: [4, 6], direction: 0 },
  { code: "コンベア", pos: [5, 6], direction: 1 },
  { code: "てんぷらこ箱", pos: [6, 6], direction: 0 },
  { code: "コンベア", pos: [4, 7], direction: 0 },
  { code: "コンベア", pos: [5, 7], direction: 3 },
  { code: "コンロ", pos: [6, 7], direction: 0 },
  { code: "コンベア", pos: [7, 7], direction: 3 },
  { code: "コンバイナ", pos: [8, 7], direction: 0 },
  { code: "コンベア", pos: [9, 7], direction: 1 },
  { code: "自動にぎるくん", pos: [10, 7], direction: 0 },
  { code: "コンベア", pos: [11, 7], direction: 1 },
  { code: "すめし箱", pos: [12, 7], direction: 0 },
  { code: "コンベア", pos: [8, 6], direction: 2 },
  { code: "売却機", pos: [8, 5], direction: 0 },
  { code: "カウンター", pos: [1, 7], direction: 0 },
  { code: "カウンター", pos: [2, 7], direction: 0 },
  { code: "ダイニングテーブル", pos: [2, 9], direction: 0 },
  { code: "ダイニングテーブル", pos: [3, 9], direction: 0 },
  { code: "ダイニングテーブル", pos: [4, 9], direction: 0 },
];

export class GameManager {
  fm: FactoryManager;
  customers: Customer[] = [];
  todayCoin: number = 0;
  t: number = 0;
  finishTime: number = 60;
  isFinished: boolean = false;
  gameData: GameData;

  constructor(gameData: GameData = defaultGame, mapData: MapData = defaultMap) {
    this.gameData = gameData;
    this.fm = new FactoryManager(mapData);
    this.t = 0;
  }

  update(deltaTime: number = 0) {
    this.fm.update(deltaTime);

    const emptyTables = this.fm.sUnitArray.filter((unit) =>
      unit.options.process?.some((process) => process.processCode === "taberu")
    );
    let waitingTableIndex = 0;
    this.customers.forEach((customer) => {
      customer.update(
        deltaTime,
        emptyTables.filter((table) =>
          this.customers.every((customer) => customer.table?.id !== table.id)
        ),
        customer.state === "WAITING_TABLE" ? waitingTableIndex++ : 0
      );
    });
    this.customers = this.customers.filter((customer) => !customer.isDeleted);

    if (
      this.gameData.dayTime > this.t &&
      Math.floor(this.t / this.gameData.customerSpawnInterval) !==
        Math.floor((this.t + deltaTime) / this.gameData.customerSpawnInterval)
    ) {
      if (
        this.customers.length < this.gameData.maxCustomerCount &&
        Math.random() < this.gameData.customerSpawnRatio
      ) {
        this.customers.push(
          new Customer(
            this.gameData.customerModel[0],
            this.gameData.menuCodes,
            this.customers.filter(
              (customer) => customer.state === "WAITING_TABLE"
            ).length
          )
        );
      }
    }

    if (this.gameData.dayTime < this.t && this.customers.length === 0) {
      this.isFinished = true;
    }

    this.t += deltaTime;
  }

  emitGameEvent(event: GameEvent) {
    switch (event.code) {
      case "grabObj":
        this.fm.grabObj(event.userId, event.objId);
        break;
      case "releaseObj":
        this.fm.releaseObj(event.userId, event.unitId);
        break;
      case "startInteractUnit":
        this.fm.startInteractUnit(event.userId, event.unitId);
        break;
      case "endInteractUnit":
        this.fm.endInteractUnit(event.userId, event.unitId);
        break;
    }
  }
}

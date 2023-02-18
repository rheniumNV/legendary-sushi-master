import { FactoryManager } from "./factory/FactoryManager";
import { Direction, SObjModel, SUnitOptions } from "./factory/type";

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

export type GameModel = {
  menu: string[];
  customerOption: {};
};

export type GameData = {
  coin: number;
  dayCount: number;
};

export class Customer {
  visualCode: string;
  constructor(visualCode: string) {
    this.visualCode = visualCode;
  }
}

const setting: { code: string; pos: [number, number]; direction: Direction }[] =
  [
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
  ];

export class GameManager {
  fm: FactoryManager;
  customers: Customer[] = [];
  coin: number = 0;
  dayCount: number = 0;

  constructor(
    map: {
      code: string;
      pos: [number, number];
      direction: Direction;
    }[] = setting
  ) {
    this.fm = new FactoryManager(map);
  }

  init(gameData: GameData) {
    this.coin = gameData.coin;
    this.dayCount = gameData.dayCount;
  }

  update(deltaTime: number = 0) {
    this.fm.update(deltaTime);
  }

  getNeosState() {}

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

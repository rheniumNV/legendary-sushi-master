import { SObj } from "./SObj";
import { SUnit } from "./SUnit";
import { SUnitModels } from "./models/SUnitModels";
import _ from "lodash";
import { Direction, Pos, SObjTask } from "./type";
import { SUser } from "./SUser";

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
    // { code: "マグロ箱", pos: [0, 0], direction: 0 },
    // { code: "コンベア", pos: [0, 1], direction: 0 },
    // { code: "カウンター", pos: [0, 2], direction: 0 },
    // { code: "コンベア", pos: [1, 2], direction: 3 },
    // { code: "カウンター", pos: [2, 0], direction: 0 },
    // { code: "カウンター", pos: [2, 2], direction: 0 },
    // { code: "コンベア", pos: [2, 1], direction: 2 },
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

function pos2key(pos: [number, number]) {
  return `${pos[0]},${pos[1]}`;
}

function processPos(
  pos1: Pos,
  pos2: Pos,
  process: (a: number, b: number) => number
): Pos {
  return [process(pos1[0], pos2[0]), process(pos1[1], pos2[1])];
}

export class GameManager {
  sUnits: Map<string, SUnit> = new Map<string, SUnit>();
  sObjs: Map<string, SObj> = new Map<string, SObj>();
  sUsers: Map<string, SUser> = new Map<string, SUser>();
  tasks: SObjTask[] = [];
  coin: number = 0;

  public get sUnitArray() {
    let units: SUnit[] = [];
    this.sUnits.forEach((unit) => units.push(unit));
    return units;
  }

  public get sObjArray() {
    let objs: SObj[] = [];
    this.sObjs.forEach((obj) => objs.push(obj));
    return objs;
  }

  public get sUserArray() {
    let users: SUser[] = [];
    this.sUsers.forEach((user) => users.push(user));
    return users;
  }

  constructor(
    map: {
      code: string;
      pos: [number, number];
      direction: Direction;
    }[] = setting
  ) {
    map.forEach(({ code, pos, direction }) => {
      this.sUnits.set(
        pos2key(pos),
        new SUnit(SUnitModels[code], pos, direction)
      );
    });
  }

  update(deltaTime: number = 0.2) {
    this.tasks = [];
    this.sUnits.forEach((unit) => {
      const nearUnits = (
        [
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
        ] as [number, number][]
      ).map((diff) =>
        this.sUnits.get(pos2key([unit.pos[0] + diff[0], unit.pos[1] + diff[1]]))
      );
      SUnit.preUpdate(unit, nearUnits).forEach((task) => this.tasks.push(task));
    });

    this.tasks = _.sortBy(this.tasks, (task) => {
      const { code } = task;
      return [code];
    }).reverse();

    this.tasks.forEach((task) => {
      SUnit.update(task, deltaTime * 5, {
        addCoin: this.addCoin.bind(this),
        deleteObj: this.deleteObj.bind(this),
        generateObj: this.generateObj.bind(this),
      });
    });

    this.clean();
  }

  clean() {
    const objIds: { id: string; unit?: SUnit; user?: SUser }[] = [
      ...this.sUnitArray
        .map((unit) => {
          return [
            ...unit.stacks.map((sObj) => ({ id: sObj.id, unit })),
            ...unit.inputs.map(({ sObj }) => ({ id: sObj.id, unit })),
          ];
        })
        .flatMap((v) => v),
      ...this.sUserArray
        .map((user) => {
          return user.grabObjects.map((obj) => ({ id: obj.id, user: user }));
        })
        .flatMap((v) => v),
    ];

    this.sObjs.forEach((obj) => {
      const { id, unit, user } =
        objIds.find(({ id }: any) => id === obj.id) ?? {};
      if (!id) {
        this.sObjs.delete(obj.id);
      } else if (unit) {
        obj._parentUnit = unit;
        if (obj._parentUnit) {
          const input = obj._parentUnit.inputs.find(
            ({ sObj }) => sObj.id === obj.id
          );
          obj._pos = input
            ? processPos(
                obj._parentUnit.pos,
                input.from.pos,
                (a, b) => b + ((a - b) * (input.progress ?? 0)) / 100
              )
            : obj._parentUnit.pos;
          obj._speed = input
            ? processPos(
                obj._parentUnit.pos,
                input.from.pos,
                (a, b) => ((a - b) * (input.speed ?? 0)) / 50
              )
            : [0, 0];
          obj._maxMoveTime =
            input?.speed && (input?.speed ?? 0) > 0
              ? (100 - (input?.progress ?? 0)) / input.speed / 2
              : 0;
          obj._grabUser = undefined;
        }
      } else if (user) {
        obj._parentUnit = undefined;
        obj._pos = undefined;
        obj._speed = undefined;
        obj._maxMoveTime = 0;
        obj._grabUser = user;
      }
    });
  }

  grabObj(userId: string, targetObjId: string) {
    let user =
      this.sUsers.get(userId) ??
      this.sUsers.set(userId, new SUser(userId)).get(userId);
    const obj = this.sObjs.get(targetObjId);
    console.log(user, obj);
    if (user && obj) {
      user.grabObj(obj);
    }
  }

  releaseObj(userId: string, targetUnitId: string) {
    const user = this.sUsers.get(userId);
    const unit = this.sUnitArray.find(({ id }) => id === targetUnitId);
    if (user && unit) {
      user.releaseObj(unit);
    }
  }

  startInteractUnit(userId: string, targetUnitId: string) {
    let user =
      this.sUsers.get(userId) ??
      this.sUsers.set(userId, new SUser(userId)).get(userId);
    const unit = this.sUnitArray.find(({ id }) => id === targetUnitId);
    if (user && unit) {
      unit.startInteract(user);
    }
  }

  endInteractUnit(userId: string, targetUnitId: string) {
    const user = this.sUsers.get(userId);
    const unit = this.sUnitArray.find(({ id }) => id === targetUnitId);
    if (user && unit) {
      unit.endInteract(user);
    }
  }

  addCoin(coin: number) {
    this.coin += coin;
  }

  generateObj(code: string): SObj {
    const newObj = new SObj(code);
    this.sObjs.set(newObj.id, newObj);
    return newObj;
  }

  deleteObj(sObj: SObj) {
    this.sObjs.delete(sObj.id);
  }
}

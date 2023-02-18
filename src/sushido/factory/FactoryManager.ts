import { SObj } from "./SObj";
import { SUnit } from "./SUnit";
import { SushiUnitModels } from "../models/SUnitModels";
import _ from "lodash";
import { Direction, FactoryModel, Pos, SObjTask } from "./type";
import { SUser } from "./SUser";
import EventEmitter from "events";
import { SushiObjModels } from "../models/SObjModels";

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

export class FactoryManager {
  sUnits: Map<string, SUnit> = new Map<string, SUnit>();
  sObjs: Map<string, SObj> = new Map<string, SObj>();
  sUsers: Map<string, SUser> = new Map<string, SUser>();
  tasks: SObjTask[] = [];
  coin: number = 0;

  factoryModel: FactoryModel;

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
    }[],
    factoryModel: FactoryModel = {
      unitModel: SushiUnitModels,
      objModel: SushiObjModels,
    }
  ) {
    this.factoryModel = factoryModel;

    map.forEach(({ code, pos, direction }) => {
      this.sUnits.set(
        pos2key(pos),
        new SUnit(
          this.factoryModel.unitModel[code],
          pos,
          direction,
          factoryModel
        )
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
      this.sUsers.set(userId, new SUser(this, userId)).get(userId);
    const obj = this.sObjs.get(targetObjId);
    console.log(user, obj);
    if (user && obj) {
      user.grabObj(obj);
    }
    this.clean();
  }

  releaseObj(userId: string, targetUnitId: string) {
    const user = this.sUsers.get(userId);
    const unit = this.sUnitArray.find(({ id }) => id === targetUnitId);
    if (user && unit) {
      user.releaseObj(unit);
    }
    this.clean();
  }

  startInteractUnit(userId: string, targetUnitId: string) {
    let user =
      this.sUsers.get(userId) ??
      this.sUsers.set(userId, new SUser(this, userId)).get(userId);
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

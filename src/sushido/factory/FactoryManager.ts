import { SObj } from "./SObj";
import { SUnit } from "./SUnit";
import { SushiUnitModels } from "../models/SUnitModels";
import _ from "lodash";
import { Direction, FactoryModel, Pos, SObjTask } from "./type";
import { HandSide, SUser } from "./SUser";
import { SushiObjModels } from "../models/SObjModels";
import { EventEmitter } from "stream";

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

export type SoundCode =
  | "onAngered"
  | "onDayFinished"
  | "onLoad"
  | "onSave"
  | "onCleared"
  | "onBought"
  | "onAte"
  | "onAnnoyed"
  | "onStarted"
  | "onVisited"
  | "onTrashed"
  | "onServed"
  | "onPickedUp"
  | "onGrabbed"
  | "onPlaced"
  | "onCompleted"
  | "onCoinAdded"
  | "onOrdered";

type FactoryEventBase = { type: string; args: any[] };

type FactoryEventCoin = {
  type: "coin";
  args: [value: number, targetId: string, category: string];
};

type FactoryEventSound = {
  type: "sound";
  args: [targetId: string, code: SoundCode];
};

type FEC<T extends FactoryEventBase> = (...args: T["args"]) => void;

type FER<T extends FactoryEventBase> = {
  type: T["type"];
  callback: FEC<T>;
};

export type FactoryEvent = FER<FactoryEventCoin> | FER<FactoryEventSound>;

export type FactoryOperator = {
  coin: FEC<FactoryEventCoin>;
  sound: FEC<FactoryEventSound>;
  generateObj: (code: string) => SObj;
  deleteObj: (target: SObj) => void;
  getT: () => number;
};

export class FactoryManager {
  sUnits: Map<string, SUnit> = new Map<string, SUnit>();
  sObjs: Map<string, SObj> = new Map<string, SObj>();
  sUsers: Map<string, SUser> = new Map<string, SUser>();
  tasks: SObjTask[] = [];
  coin: number = 0;
  eventEmitter: EventEmitter = new EventEmitter();
  t: number = 0;

  factoryModel: FactoryModel;

  public onEvent(event: FactoryEvent) {
    this.eventEmitter.on(event.type, event.callback);
  }

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
          factoryModel,
          {
            coin: this.addCoin.bind(this),
            sound: this.emitSoundEvent.bind(this),
            generateObj: this.generateObj.bind(this),
            deleteObj: this.deleteObj.bind(this),
            getT: this.getT.bind(this),
          }
        )
      );
    });
  }

  update(t: number = performance.now(), deltaTime: number = 0.2) {
    this.t = t;
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

    this.tasks = _(this.tasks)
      .map((task) => {
        const { code } = task;
        // 分岐する際に交互に分かれるようにtaskを並べ替える。
        const inputCount =
          task.code === "moveStart"
            ? task.from.inputCounts.get(task.to.id) ?? 0
            : 0;
        // if (inputCount !== 0 && task.code === "moveStart") {
        //   console.log(task.code, task.to.id, inputCount);
        // }
        return { task, code, inputCount };
      })
      .orderBy(["code", "inputCount"], ["desc", "asc"])
      .map(({ task }) => task)
      .value();

    this.tasks.forEach((task) => {
      SUnit.update(task, deltaTime * 5);
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
          return [...user.rightGrabObjects, ...user.leftGrabObjects].map(
            (obj) => ({ id: obj.id, user: user })
          );
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
                (a, b) => ((a - b) * (input.speed ?? 0)) / 25
              )
            : [0, 0];
          obj._maxMoveTime =
            input?.speed && (input?.speed ?? 0) > 0
              ? (100 - (input?.progress ?? 0)) / input.speed
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

  grabUnit(side: HandSide, userId: string, targetUnitId: string) {
    let user =
      this.sUsers.get(userId) ??
      this.sUsers.set(userId, new SUser(this, userId)).get(userId);
    const unit = this.sUnitArray.find(({ id }) => id === targetUnitId);
    if (user && unit) {
      user.grabUnit(side, unit, (str) => this.generateObj(str));
    }
  }

  grabObj(side: HandSide, userId: string, targetObjId: string) {
    let user =
      this.sUsers.get(userId) ??
      this.sUsers.set(userId, new SUser(this, userId)).get(userId);
    const obj = this.sObjs.get(targetObjId);
    if (user && obj) {
      user.grabObj(side, obj);
    }
    this.clean();
  }

  releaseObj(side: HandSide, userId: string, targetUnitId: string) {
    const user = this.sUsers.get(userId);
    const unit = this.sUnitArray.find(({ id }) => id === targetUnitId);
    if (user && unit) {
      user.releaseObj(side, unit);
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

  addCoin(coin: number, targetId: string, category: string) {
    this.coin += coin;
    this.eventEmitter.emit("coin", coin, targetId, category);
  }

  emitSoundEvent(targetId: string, code: SoundCode) {
    this.eventEmitter.emit("sound", targetId, code);
  }

  generateObj(code: string): SObj {
    const newObj = new SObj(code);
    this.sObjs.set(newObj.id, newObj);
    return newObj;
  }

  deleteObj(sObj: SObj) {
    this.sObjs.delete(sObj.id);
  }

  getT() {
    return this.t;
  }
}

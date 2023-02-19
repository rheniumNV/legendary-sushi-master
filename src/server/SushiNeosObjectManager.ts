import { GameManager } from "../sushido";
import { SObj } from "../sushido/factory/SObj";
import { SUnit } from "../sushido/factory/SUnit";
import { NeosObj, NeosSyncManager } from "./NeosSyncManager";
import _ from "lodash";
import { Pos } from "../sushido/factory/type";
import { Customer } from "../sushido/Customer";

function formatPos(pos: Pos) {
  return `[${pos[0]}; ${pos[1]}]`;
}

function unit2NeosObj(unit: SUnit): NeosObj {
  return {
    id: unit.id,
    type: "Unit",
    options: {
      code: { type: "string", value: unit.options.code },
      pos: { type: "float2", value: formatPos(unit.pos) },
      direction: { type: "int", value: unit.direction.toString() },
      progress: {
        type: "float",
        value: unit.stackProgress.toString(),
      },
    },
  };
}

function obj2NeosObj(obj: SObj): NeosObj {
  return {
    id: obj.id,
    type: "Obj",
    options: {
      code: { type: "string", value: obj.code },
      pos: { type: "float2", value: obj._pos ? formatPos(obj._pos) : "-" },
      speed: {
        type: "float2",
        value: obj._speed ? formatPos(obj._speed) : "-",
      },
      maxMoveTime: {
        type: "float",
        value: obj._maxMoveTime.toString(),
      },
      grabUserId: {
        type: "string",
        value: obj._grabUser?.id ?? "",
      },
    },
  };
}

function customer2NeosObj(customer: Customer) {
  return {
    id: customer.id,
    type: "Customer",
    options: {
      code: { type: "string", value: customer.visualCode },
      pos: { type: "float2", value: formatPos(customer.pos) },
      patience: { type: "float", value: customer.patience.toString() },
      request: { type: "string", value: customer.table?.eatMenuCode ?? "" },
    },
  };
}

export class SushiNeosObjectManager {
  sm: NeosSyncManager = new NeosSyncManager();

  reset() {
    this.sm = new NeosSyncManager();
  }

  initialize() {
    this.sm.initialize();
  }

  getUpdate(gm: GameManager) {
    const unitObjs = _.reduce(
      gm.fm.sUnitArray,
      (prev, curr) => ({
        ...prev,
        [curr.id]: unit2NeosObj(curr),
      }),
      {}
    );

    const objObjs = _.reduce(
      gm.fm.sObjArray,
      (prev, curr) => ({
        ...prev,
        [curr.id]: obj2NeosObj(curr),
      }),
      {}
    );

    const customerObjs = _.reduce(
      gm.customers,
      (prev, curr) => ({
        ...prev,
        [curr.id]: customer2NeosObj(curr),
      }),
      {}
    );

    const tasks = this.sm.updateNeosState({
      ...unitObjs,
      ...objObjs,
      ...customerObjs,
    });

    const view = tasks.filter(
      (task) => task.type === "create" && task.targetType === "Customer"
    );

    const status = {
      create: tasks.filter((v) => v.type === "create").length,
      update: tasks.filter((v) => v.type === "update").length,
      delete: tasks.filter((v) => v.type === "delete").length,
    };
    console.log(status);
    return tasks;
  }
}

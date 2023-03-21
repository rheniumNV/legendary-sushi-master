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
  const debug = "";

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
      debug: {
        type: "string",
        value: debug,
      },
      isGenerator: {
        type: "bool",
        value: `${!!unit.options.generation}`,
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
      // moveStartTime: {
      //   type: "float",
      //   value: obj._moveStartTime.toString(),
      // },
      maxMoveTime: {
        type: "float",
        value: obj._maxMoveTime.toString(),
      },
      grabUserId: {
        type: "string",
        value: obj._grabUser?.id ?? "",
      },
      grabHandSide: {
        type: "string",
        value: obj._grabUser
          ? _.includes(
              obj._grabUser.leftGrabObjects.map((o) => o.id),
              obj.id
            )
            ? "LEFT"
            : "RIGHT"
          : "",
      },
    },
  };
}

function customer2NeosObj(customer: Customer) {
  return {
    id: customer.id,
    type: "Customer",
    options: {
      code: { type: "string", value: customer.customerModel.visualCode },
      pos: { type: "float2", value: formatPos(customer.pos) },
      patience: { type: "float", value: customer.patience.toString() },
      request: { type: "string", value: customer.table?.eatMenuCode ?? "" },
      speed: {
        type: "float2",
        value: customer._moveVec ? formatPos(customer._moveVec) : "-",
      },
      maxMoveTime: {
        type: "float",
        value: customer._maxMoveTime.toString(),
      },
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

    gm.factoryEventStack.forEach((event) => {
      tasks.push({ type: "event", eventType: event.type, option: event.data });
    });

    // const status = {
    //   create: tasks.filter((v) => v.type === "create").length,
    //   update: tasks.filter((v) => v.type === "update").length,
    //   delete: tasks.filter((v) => v.type === "delete").length,
    //   event: tasks.filter((v) => v.type === "event").length,
    // };
    // console.log(status);

    gm.clear();

    return tasks;
  }
}

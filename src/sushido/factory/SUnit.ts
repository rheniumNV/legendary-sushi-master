import { v4 as uuidv4 } from "uuid";
import {
  Direction,
  FactoryModel,
  Pos,
  SId,
  SObjCombineTask,
  SObjMoveStartTask,
  SObjMoveUpdateTask,
  SObjProcessTask,
  SObjTask,
  SUnitOptions,
} from "./type";
import _ from "lodash";
import { SObj } from "./SObj";
import { SObjProcessModel } from "../models/SObjModels";
import { SUser } from "./SUser";

function processPos(
  pos1: Pos,
  pos2: Pos,
  process: (a: number, b: number) => number
): Pos {
  return [process(pos1[0], pos2[0]), process(pos1[1], pos2[1])];
}

const posDirectionMap: { [key: string]: number } = {
  "0,-1": 0,
  "1,0": 1,
  "0,1": 2,
  "-1,0": 3,
};
function getDirection(to: Pos, from: Pos): number | undefined {
  const posDiff = processPos(to, from, (a, b) => a - b);
  return posDirectionMap[posDiff.toString()];
}

export class SUnit {
  id: SId;
  pos: Pos;
  direction: Direction;
  options: SUnitOptions;
  combineCount: number = 0;
  stacks: SObj[] = [];
  stackProgress: number = 0;
  interactedUsers: SUser[] = [];
  inputs: {
    sObj: SObj;
    from: SUnit;
    progress: number;
    speed: number;
  }[] = [];
  eatMenuCode: string | undefined;
  eatCallback: ((unit: SUnit) => void) | undefined;
  eatSpeed: number = 1;

  protected _factoryModel: FactoryModel;

  constructor(
    options: SUnitOptions,
    pos: Pos,
    direction: Direction,
    _factoryModel: FactoryModel
  ) {
    this.id = uuidv4();
    this.pos = pos;
    this.options = options;
    this.direction = direction;
    this._factoryModel = _factoryModel;
  }

  public getStackInputItemCount(): number {
    return this.stacks.length + this.inputs.length;
  }

  public isMoreStackable(targetCode: SObj["code"]) {
    const stackObj = this.stacks[0];
    if (
      this.options.combiner &&
      this.combineCount < this.options.combiner.count
    ) {
      const stackInputObj = stackObj ?? this.inputs[0]?.sObj;
      if (stackInputObj) {
        const recipe = _.get(
          this.getCombineRecipe(stackInputObj.code),
          targetCode
        );
        if (recipe) {
          return (
            this.getStackInputItemCount() < this.options.stack.maxCount + 1
          );
        }
      }
    }
    return (
      this.getStackInputItemCount() < this.options.stack.maxCount &&
      (!stackObj || stackObj.code === targetCode)
    );
  }

  public getProcess(objCode: string): {
    processCode: string;
    speed: number;
    output: SObjProcessModel["output"];
    requireInteract: boolean;
  }[] {
    return _.map(
      this.options.process,
      ({ processCode, value, requireInteract }) => {
        const p = _.get(this._factoryModel.objModel, [
          objCode,
          "process",
          processCode,
        ]);
        if (p) {
          return [
            {
              processCode,
              output: p.output,
              speed: value * p.scale,
              requireInteract,
            },
          ];
        } else {
          return [];
        }
      }
    ).flatMap((v) => v);
  }

  public getCombineRecipe(objCode: string) {
    return (this.options.combiner?.count ?? 0) > 0
      ? _.get(this._factoryModel.objModel, [objCode, "recipe"])
      : {};
  }

  public startInteract(sUser: SUser) {
    this.interactedUsers.push(sUser);
  }

  public endInteract(sUser: SUser) {
    this.interactedUsers = this.interactedUsers.filter(
      (user) => user !== sUser
    );
  }

  public static updateMoveStart(
    task: SObjMoveStartTask,
    generateObj: (code: string) => SObj
  ) {
    if (task.target) {
      if (
        task.to.isMoreStackable(task.target.code) &&
        task.from.stacks.length > 0 &&
        task.target.id === task.from.stacks[0].id
      ) {
        task.from.combineCount = 0;
        task.to.inputs.push({
          sObj: task.target,
          speed: task.speed,
          progress: 0,
          from: task.from,
        });
        task.from.stacks.pop();
      }
    } else if (
      task.from.options.generation &&
      task.to.isMoreStackable(task.from.options.generation.objCode)
    ) {
      const newObj = generateObj(task.from.options.generation.objCode);
      task.to.inputs.push({
        sObj: newObj,
        speed: task.speed,
        progress: 0,
        from: task.from,
      });
    }
  }

  public static preUpdateMoveStart(
    to: SUnit,
    from: SUnit
  ):
    | {
        code: "moveStart";
        target?: SObj;
        from: SUnit;
        to: SUnit;
        speed: number;
      }
    | undefined {
    const target = from.stacks.length > 0 ? from.stacks[0] : undefined;

    const fromProcess = target ? from.getProcess(target.code) : [];
    const fromCombine = target ? from.getCombineRecipe(target.code) : {};

    if (
      !fromProcess.some((v) => v) && //移動元で処理するものはない
      (Object.keys(fromCombine).length === 0 ||
        from.combineCount >= (from.options.combiner?.count ?? 0)) && //移動元でコンバインするものはない
      to.isMoreStackable(target?.code ?? from.options.generation?.objCode ?? "") //移動先のスタック数に余裕はある
    ) {
      const diffDirection = getDirection(to.pos, from.pos);
      if (diffDirection !== undefined) {
        const fromTransporter = _.get(
          from.options.transporter,
          (diffDirection + 4 - from.direction) % 4
        );
        const fromOutput =
          fromTransporter?.type === "output" ? fromTransporter : undefined;

        const toTransporter = _.get(
          to.options.transporter,
          (diffDirection + 6 - to.direction) % 4
        );
        const toInput =
          toTransporter?.type === "input" ? toTransporter : undefined;

        const transporter =
          (fromOutput?.speed ?? 0) > (toInput?.speed ?? 0)
            ? fromOutput
            : toInput;

        if (transporter) {
          return {
            code: "moveStart",
            target,
            from,
            to,
            speed: transporter.speed,
          };
        }
      }
    }
  }

  public static updateMoveUpdate(task: SObjMoveUpdateTask, deltaTime: number) {
    task.to.inputs.forEach((input) => {
      input.progress = Math.min(100, input.progress + input.speed * deltaTime);
    });

    if (task.to.options.combiner && task.to.stacks.length > 0) {
      return;
    }

    const moveFinishInput = task.to.inputs.filter(
      (input) => input.progress >= 100
    );

    moveFinishInput.forEach((input) => {
      task.to.stacks.push(input.sObj);
    });

    if (moveFinishInput.length > 0) {
      task.to.inputs = task.to.inputs.filter((input) => input.progress < 100);
    }
  }

  public static updateProcess(
    task: SObjProcessTask,
    deltaTime: number,
    deleteObj: (sObj: SObj) => void,
    addCoin: (coin: number) => void
  ) {
    if (task.target.stacks.length > 0) {
      const stackObjCode = task.target.stacks[0].code;
      const process = task.target.getProcess(stackObjCode);
      if (process.length > 0) {
        if (
          process[0].requireInteract &&
          task.target.interactedUsers.length === 0
        ) {
          task.target.stackProgress -=
            task.target.stackProgress * 0.2 * deltaTime;
        } else {
          task.target.stackProgress +=
            process[0].speed *
            deltaTime *
            (process[0].requireInteract
              ? task.target.interactedUsers.length
              : 1) *
            (process[0].processCode === "taberu"
              ? task.target.eatMenuCode === task.target.stacks[0].code
                ? task.target.eatSpeed
                : 0
              : 1);
        }

        if (task.target.stackProgress >= 100) {
          task.target.stackProgress = 0;
          if (process[0].processCode === "taberu") {
            task.target.eatMenuCode = undefined;
            if (task.target.eatCallback) {
              task.target.eatCallback(task.target);
            }
          }
          switch (process[0].output.type) {
            case "transform":
              task.target.stacks[0].code = process[0].output.code;
              break;
            case "coin":
              addCoin(process[0].output.value);
              deleteObj(task.target.stacks[0]);
              task.target.stacks.pop();
              break;
          }
        }
      }
    }
  }

  private static updateCombine(
    task: SObjCombineTask,
    deltaTime: number,
    deleteObj: (sObj: SObj) => void
  ) {
    const objs = [
      ...task.target.stacks,
      ...task.target.inputs.map((i) => i.sObj),
    ];

    if (objs.length >= 2 && task.target.options.combiner) {
      const recipe = _.get(task.target._factoryModel.objModel, [
        objs[0].code,
        "recipe",
        objs[1].code,
      ]);
      if (recipe) {
        task.target.stackProgress = Math.min(
          100,
          task.target.stackProgress +
            recipe.scale * task.target.options.combiner.speed * deltaTime
        );

        const moveFinished =
          task.target.stacks.length < 2
            ? task.target.inputs[0].progress >= 100
            : true;

        if (moveFinished && task.target.stackProgress >= 100) {
          task.target.combineCount += 1;
          task.target.stackProgress = 0;
          objs[0].code = recipe.code;
          task.target.stacks = task.target.stacks.filter(
            ({ id }) => id !== objs[1].id
          );
          task.target.inputs = task.target.inputs.filter(
            ({ sObj }) => sObj.id !== objs[1].id
          );
          deleteObj(objs[1]);
        }
      }
    }
  }

  public static preUpdateMoveUpdate(
    unit: SUnit
  ): SObjMoveUpdateTask | undefined {
    if (unit.inputs.length > 0) {
      return { code: "moveUpdate", to: unit };
    }
  }

  public static update(
    task: SObjTask,
    deltaTime: number,
    operator: {
      generateObj: (code: string) => SObj;
      deleteObj: (sObj: SObj) => void;
      addCoin: (coin: number) => void;
    }
  ) {
    switch (task.code) {
      case "moveStart":
        this.updateMoveStart(task, operator.generateObj);
        break;
      case "moveUpdate":
        this.updateMoveUpdate(task, deltaTime);
        break;
      case "process":
        this.updateProcess(
          task,
          deltaTime,
          operator.deleteObj,
          operator.addCoin
        );
        break;
      case "combine":
        this.updateCombine(task, deltaTime, operator.deleteObj);
        break;
    }
  }

  public static preUpdate(
    unit: SUnit,
    nearUnits: (SUnit | undefined)[]
  ): SObjTask[] {
    let tasks: SObjTask[] = [];
    const pushTask = (task: SObjTask) => {
      tasks.push(task);
    };

    const moveUpdateTask = this.preUpdateMoveUpdate(unit);
    if (moveUpdateTask) {
      pushTask(moveUpdateTask);
    }

    if (
      unit.getStackInputItemCount() < unit.options.stack.maxCount ||
      unit.options.combiner
    ) {
      _.forEach(nearUnits, (nearUnit) => {
        if (nearUnit) {
          const task = SUnit.preUpdateMoveStart(unit, nearUnit);
          if (task) {
            pushTask(task);
          }
        }
      });
    }

    if (unit.stacks.length > 0 && (unit.options.process?.length ?? 0) > 0) {
      pushTask({
        code: "process",
        target: unit,
      });
    }

    if (unit.stacks.length + unit.inputs.length >= 2 && unit.options.combiner) {
      pushTask({ code: "combine", target: unit });
    }

    return tasks;
  }
}

import { SObj } from "./SObj";
import { SUnit } from "./SUnit";
import _ from "lodash";
import { FactoryManager } from "./FactoryManager";

export type HandSide = "RIGHT" | "LEFT";
export class SUser {
  id: string;
  rightGrabObjects: SObj[] = [];
  leftGrabObjects: SObj[] = [];
  fm: FactoryManager;

  constructor(fm: FactoryManager, id: string) {
    this.id = id;
    this.fm = fm;
  }

  grabUnit(
    side: HandSide,
    unit: SUnit,
    generateObj: (objCode: string) => SObj
  ) {
    const grabObjects =
      side === "RIGHT" ? this.rightGrabObjects : this.leftGrabObjects;
    if (unit.options.generation) {
      if (grabObjects.length === 0) {
        grabObjects.push(generateObj(unit.options.generation.objCode));
        this.fm.emitSoundEvent(unit.id, "onPickedUp");
      } else if (grabObjects.length === 1) {
        const combinedObjCode = _.get(this.fm.factoryModel.objModel, [
          unit.options.generation.objCode,
          "recipe",
          grabObjects[0]?.code ?? "",
          "code",
        ]);
        if (combinedObjCode) {
          grabObjects[0].code = combinedObjCode;
        }
        this.fm.emitSoundEvent(unit.id, "onPickedUp");
      }
    }
  }

  //握るときになにかリセットしてない。
  //食べ物を取り上げたときに忍耐をリセットしないようにする。

  grabObj(side: HandSide, obj: SObj) {
    const grabObjects =
      side === "RIGHT" ? this.rightGrabObjects : this.leftGrabObjects;
    const combinedObjCode = _.get(this.fm.factoryModel.objModel, [
      obj.code,
      "recipe",
      grabObjects[0]?.code ?? "",
      "code",
    ]);
    if (obj._grabUser) {
      return;
    }

    if (grabObjects.length === 0 || combinedObjCode) {
      if (obj._parentUnit?.stacks.includes(obj)) {
        obj._parentUnit.stacks = obj._parentUnit.stacks.filter(
          (o) => o !== obj
        );
        obj._parentUnit.stackProgress = 0;
      }
      if (obj._parentUnit?.inputs.map(({ sObj }: any) => sObj).includes(obj)) {
        obj._parentUnit.inputs = obj._parentUnit.inputs.filter(
          ({ sObj }: any) => sObj !== obj
        );
      }
      if (obj._parentUnit) {
        obj._parentUnit.combineCount = 0;
      }
      if (grabObjects[0] && combinedObjCode) {
        grabObjects[0].code = combinedObjCode;
      } else {
        grabObjects.push(obj);
      }
      this.fm.emitSoundEvent(obj._parentUnit?.id ?? obj.id, "onGrabbed");
    }
  }

  releaseObj(side: HandSide, to: SUnit) {
    const grabObjects =
      side === "RIGHT" ? this.rightGrabObjects : this.leftGrabObjects;
    const obj = grabObjects[0];
    const combinedObjCode = _.get(this.fm.factoryModel.objModel, [
      obj?.code ?? "",
      "recipe",
      to.stacks[0]?.code ?? "",
      "code",
    ]);
    if (to.stacks.length === 0 && obj && to.isMoreStackable(obj.code)) {
      grabObjects.pop();
      to.stacks.push(obj);
      this.fm.emitSoundEvent(to.id, "onPlaced");
    } else if (to.stacks.length === 1 && combinedObjCode) {
      grabObjects.pop();
      to.stacks[0].code = combinedObjCode;
      this.fm.emitSoundEvent(to.id, "onPlaced");
    } else if (obj && to.options.generation?.objCode === obj.code) {
      grabObjects.pop();
      this.fm.emitSoundEvent(to.id, "onPlaced");
    } else if (obj && to.options.delete) {
      grabObjects.pop();
      this.fm.emitSoundEvent(to.id, "onPlaced");
    }
  }
}

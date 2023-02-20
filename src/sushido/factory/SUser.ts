import { SObj } from "./SObj";
import { SUnit } from "./SUnit";
import _ from "lodash";
import { FactoryManager } from "./FactoryManager";

export class SUser {
  id: string;
  grabObjects: SObj[] = [];
  fm: FactoryManager;

  constructor(fm: FactoryManager, id: string) {
    this.id = id;
    this.fm = fm;
  }

  grabUnit(unit: SUnit, generateObj: (objCode: string) => SObj) {
    if (unit.options.generation) {
      if (this.grabObjects.length === 0) {
        this.grabObjects.push(generateObj(unit.options.generation.objCode));
      } else if (this.grabObjects.length === 1) {
        const combinedObjCode = _.get(this.fm.factoryModel.objModel, [
          unit.options.generation.objCode,
          "recipe",
          this.grabObjects[0]?.code ?? "",
          "code",
        ]);
        if (combinedObjCode) {
          this.grabObjects[0].code = combinedObjCode;
        }
      }
    }
  }

  //握るときになにかリセットしてない。
  //食べ物を取り上げたときに忍耐をリセットしないようにする。

  grabObj(obj: SObj) {
    const combinedObjCode = _.get(this.fm.factoryModel.objModel, [
      obj.code,
      "recipe",
      this.grabObjects[0]?.code ?? "",
      "code",
    ]);
    if (this.grabObjects.length === 0 || combinedObjCode) {
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
      if (this.grabObjects[0] && combinedObjCode) {
        this.grabObjects[0].code = combinedObjCode;
      } else {
        this.grabObjects.push(obj);
      }
    }
  }

  releaseObj(to: SUnit) {
    const obj = this.grabObjects[0];
    const combinedObjCode = _.get(this.fm.factoryModel.objModel, [
      obj?.code ?? "",
      "recipe",
      to.stacks[0]?.code ?? "",
      "code",
    ]);
    if (to.stacks.length === 0 && obj && to.isMoreStackable(obj.code)) {
      this.grabObjects.pop();
      to.stacks.push(obj);
    } else if (to.stacks.length === 1 && combinedObjCode) {
      this.grabObjects.pop();
      to.stacks[0].code = combinedObjCode;
    } else if (obj && to.options.generation?.objCode === obj.code) {
      this.grabObjects.pop();
    }
  }
}

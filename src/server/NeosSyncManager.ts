import _ from "lodash";

type OptionsMap = { [key: string]: { type: string; value: string } };
type OptionsArray = { type: string; value: string; key: string }[];

export type NeosObj = {
  id: string;
  type: string;
  options: OptionsMap;
};

export type Task =
  | {
      type: "create";
      targetId: string;
      targetType: string;
      options: OptionsArray;
    }
  | {
      type: "update";
      targetId: string;
      options: OptionsArray;
    }
  | { type: "delete"; targetId: string }
  | { type: "event"; pulseName: string; option: string };

export type NeosState = { [key: string]: NeosObj };

export class NeosSyncManager {
  protected prevState: NeosState = {};
  protected state: NeosState = {};
  protected tasks: Task[] = [];

  initialize() {
    this.prevState = {};
    this.state = {};
    this.tasks = [];
  }

  updateNeosState(newNeosState: NeosState) {
    this.prevState = { ...this.state };
    this.state = { ...newNeosState };
    this.tasks = [];

    _.forEach(this.state, (neosObj) => {
      const prev = _.get(this.prevState, neosObj.id);
      if (prev) {
        let options: OptionsArray = [];
        _.forEach(neosObj.options, ({ type, value }, key) => {
          const prevOption = _.get(prev.options, key);
          if (prevOption && prevOption.value !== value) {
            options.push({ key, value, type });
          }
        });
        if (options.length > 0) {
          this.tasks.push({ type: "update", targetId: neosObj.id, options });
        }
      } else {
        this.tasks.push({
          type: "create",
          targetId: neosObj.id,
          targetType: neosObj.type,
          options: _.map(neosObj.options, ({ type, value }, key) => ({
            key,
            value,
            type,
          })),
        });
      }
    });

    _.forEach(this.prevState, (neosObj) => {
      const newObj = _.get(this.state, neosObj.id);
      if (!newObj) {
        this.tasks.push({ type: "delete", targetId: neosObj.id });
      }
    });

    return this.tasks;
  }
}

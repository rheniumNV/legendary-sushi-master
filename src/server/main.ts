import { NeosObj, NeosSyncManager, Task } from "./NeosSyncManager";
import { GameManager } from "../sushido/GameManager";
import { WebSocketServer } from "ws";
import http from "http";
import express from "express";
import json2emap from "json2emap";
import _, { identity } from "lodash";
import { SUnit } from "../sushido/SUnit";
import { SObj } from "../sushido/SObj";
import { Pos } from "../sushido/type";
import EventEmitter from "events";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const events = new EventEmitter();

app.get("/", (req, res) => {
  res.send("Hello");
});

let gm = new GameManager();
setInterval(() => {
  gm.update(0.1);
  events.emit("updated");
}, 250);

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

function getUpdate(sm: NeosSyncManager, gm: GameManager) {
  const unitObjs = _.reduce(
    gm.sUnitArray,
    (prev, curr) => ({
      ...prev,
      [curr.id]: unit2NeosObj(curr),
    }),
    {}
  );

  const objObjs = _.reduce(
    gm.sObjArray,
    (prev, curr) => ({
      ...prev,
      [curr.id]: obj2NeosObj(curr),
    }),
    {}
  );

  const tasks = sm.updateNeosState({ ...unitObjs, ...objObjs });

  const status = {
    create: tasks.filter((v) => v.type === "create").length,
    update: tasks.filter((v) => v.type === "update").length,
    delete: tasks.filter((v) => v.type === "delete").length,
  };
  console.log(status);
  return tasks;
}

wss.on("connection", (ws, request) => {
  console.log("on Websocket Connection");
  const sm = new NeosSyncManager();
  ws.send(json2emap({ type: "clean" }));
  let updateDone = true;

  events.on("updated", () => {
    if (updateDone) {
      const tasks = getUpdate(sm, gm);
      ws.send(json2emap({ type: "update", tasks }));
      updateDone = false;
    }
  });

  ws.on("message", (rawData) => {
    let data:
      | undefined
      | {
          type: "reset" | "resync" | "updateRequest" | "updateFinish";
          option: any;
        }
      | {
          type: "gameEvent";
          option:
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
        };
    try {
      data = JSON.parse(rawData.toString());
    } catch (e) {
      console.error(e);
    }
    if (data) {
      switch (data.type) {
        case "reset":
          gm = new GameManager(data.option);
        case "resync":
          sm.initialize();
          ws.send(json2emap({ type: "clean" }));
          break;
        case "updateFinish":
          updateDone = true;
          break;
        case "gameEvent":
          try {
            const { code } = data.option;
            console.log(data.option);
            switch (code) {
              case "grabObj":
                gm.grabObj(data.option.userId, data.option.objId);
                break;
              case "releaseObj":
                gm.releaseObj(data.option.userId, data.option.unitId);
                break;
              case "startInteractUnit":
                gm.startInteractUnit(data.option.userId, data.option.unitId);
                break;
              case "endInteractUnit":
                gm.endInteractUnit(data.option.userId, data.option.unitId);
                break;
            }
            gm.clean();
            const tasks = getUpdate(sm, gm);
            ws.send(json2emap({ type: "update", tasks }));
            console.log("sended");
            updateDone = false;
          } catch (e) {
            console.error(e);
          }
          break;
      }
    }
  });
});
// @ts-ignore
app.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(3000);

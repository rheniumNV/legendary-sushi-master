import { GameManager } from "../sushido";
import { WebSocketServer } from "ws";
import http from "http";
import express from "express";
import j2e from "json2emap";
import _ from "lodash";

function json2emap(data: any) {
  return j2e(data);
}

import EventEmitter from "events";
import { SushiNeosObjectManager } from "./SushiNeosObjectManager";

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

wss.on("connection", (ws, request) => {
  console.log("on Websocket Connection");
  const som = new SushiNeosObjectManager();
  ws.send(json2emap({ type: "clean" }));
  let updateDone = true;

  events.on("updated", () => {
    if (updateDone) {
      const tasks = som.getUpdate(gm);
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
          som.initialize();
          ws.send(json2emap({ type: "clean" }));
          break;
        case "updateFinish":
          updateDone = true;
          break;
        case "gameEvent":
          try {
            const { code } = data.option;
            console.log(data.option);
            gm.emitGameEvent(data.option);
            gm.fm.clean();
            const tasks = som.getUpdate(gm);
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

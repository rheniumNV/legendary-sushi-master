import { GameManager, MapData } from "../sushido";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import express from "express";
import j2e from "json2emap";
import _ from "lodash";

type NeosGameData = {
  coin: number;
  menuCodes: string[];
  map: MapData;
  playerCount: number;
};

type EventMessage4Neos =
  | { type: "update"; tasks: Task[] }
  | { type: "clean" }
  | { type: "report"; data: { todayCoin: number; totalCustomerCount: number } };

type EventMessage4Manager =
  | {
      type: "resync" | "updateFinish" | "close";
    }
  | { type: "init"; option: any }
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

function json2emap(data: any) {
  return j2e(data);
}

function generateEventSender(ws: WebSocket) {
  return (data: EventMessage4Neos) => {
    ws.send(json2emap(data));
  };
}

import EventEmitter from "events";
import { SushiNeosObjectManager } from "./SushiNeosObjectManager";
import { Task } from "./NeosSyncManager";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.get("/", (req, res) => {
  res.send("Hello");
});

wss.on("connection", (ws, request) => {
  console.log("on Websocket Connection");

  const sendEvent = generateEventSender(ws);
  const events = new EventEmitter();
  let gm: undefined | GameManager;
  const som = new SushiNeosObjectManager();

  const intervalId = setInterval(() => {
    if (gm) {
      gm.update(0.1);
      events.emit("updated");
    }
  }, 250);

  let updateDone = true;

  sendEvent({ type: "clean" });

  events.on("updated", () => {
    if (updateDone && gm) {
      if (gm.isFinished) {
        sendEvent({
          type: "report",
          data: {
            todayCoin: gm.todayCoin + gm.gameData.coin,
            totalCustomerCount: gm.totalCustomerCount,
          },
        });
        clearInterval(intervalId);
        ws.close();
      } else {
        const tasks = som.getUpdate(gm);
        sendEvent({ type: "update", tasks });
        updateDone = false;
      }
    }
  });

  ws.on("message", (rawData) => {
    let data: undefined | EventMessage4Manager;
    try {
      data = JSON.parse(rawData.toString());
    } catch (e) {
      console.error(e);
    }
    if (data) {
      console.log("received", data.type);
      switch (data.type) {
        case "init":
          gm = new GameManager(
            {
              coin: 0,
              dayCount: 0,
              menuCodes: [
                "マグロにぎり",
                "鉄火巻",
                "ねぎとろ巻き",
                "ねぎとろ軍艦",
                "えびてんにぎり",
              ],
              dayTime: 60,
              customerSpawnRatio: 0.7,
              customerSpawnInterval: 1,
              maxCustomerCount: 10,
              customerModel: [
                {
                  visualCode: "normal",
                  maxOrderCount: 3,
                  nextOrderRatio: 0.8,
                  paymentScale: 1,
                  patienceScale: 1,
                  eatScale: 1,
                  thinkingOrderScale: 1,
                  pickWeight: 1,
                  moveSpeed: 1,
                },
                {
                  visualCode: "dart",
                  maxOrderCount: 2,
                  nextOrderRatio: 0.75,
                  paymentScale: 0.5,
                  patienceScale: 1,
                  eatScale: 2,
                  thinkingOrderScale: 1.5,
                  pickWeight: 0.5,
                  moveSpeed: 1.5,
                },
                {
                  visualCode: "relax",
                  maxOrderCount: 5,
                  nextOrderRatio: 0.9,
                  paymentScale: 1.5,
                  patienceScale: 2,
                  eatScale: 0.5,
                  thinkingOrderScale: 0.5,
                  pickWeight: 0.2,
                  moveSpeed: 0.75,
                },
              ],
            },
            [
              ...data.option,
              { code: "ダイニングテーブル", pos: [0, -1], direction: 2 },
              { code: "ダイニングテーブル", pos: [1, -1], direction: 2 },
              { code: "ダイニングテーブル", pos: [2, -1], direction: 2 },
              { code: "ダイニングテーブル", pos: [3, -1], direction: 2 },
              { code: "ダイニングテーブル", pos: [4, -1], direction: 2 },
              { code: "ダイニングテーブル", pos: [5, -1], direction: 2 },
              { code: "ダイニングテーブル", pos: [6, -1], direction: 2 },
            ]
          );
        case "resync":
          som.initialize();
          sendEvent({ type: "clean" });
          if (gm) {
            const tasks = som.getUpdate(gm);
            sendEvent({ type: "update", tasks });
            updateDone = false;
          }
          break;
        case "updateFinish":
          updateDone = true;
          break;
        case "gameEvent":
          if (gm) {
            try {
              console.log(data.option);
              gm.emitGameEvent(data.option);
              const tasks = som.getUpdate(gm);
              sendEvent({ type: "update", tasks });
              updateDone = false;
            } catch (e) {
              console.error(e);
            }
          }
          break;
        case "close":
          ws.close();
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

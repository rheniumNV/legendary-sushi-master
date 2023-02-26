import { GameData, GameManager, MapData } from "../sushido";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import express from "express";
import j2e from "json2emap";
import _ from "lodash";
import EventEmitter from "events";
import { SushiNeosObjectManager } from "./SushiNeosObjectManager";
import { Task } from "./NeosSyncManager";
import {
  NeosGameData,
  newGame,
  newNeosGameData,
  nextGameData,
  reportGame,
  ReportGameData,
} from "./GameController";

type EventMessage4Neos =
  | { type: "update"; tasks: Task[] }
  | { type: "clean" }
  | { type: "report"; data: ReportGameData }
  | { type: "updateGameData"; data: string };

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

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.get("/initNeosData", (req, res) => {
  const { useEmap = false } = req.query;
  res.send(
    useEmap === "true" ? json2emap(newNeosGameData()) : newNeosGameData()
  );
});

wss.on("connection", (ws, request) => {
  console.log("on Websocket Connection");

  const sendEvent = generateEventSender(ws);
  const events = new EventEmitter();
  let gm: undefined | GameManager;
  let gameData: undefined | NeosGameData;
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
        if (gameData) {
          const next = nextGameData(gm, gameData);
          sendEvent({
            type: "updateGameData",
            data: json2emap(next),
          });
        }
        sendEvent({
          type: "report",
          data: reportGame(gm),
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
      const str = rawData.toString();
      data = JSON.parse(str);
    } catch (e) {
      console.error(e);
    }
    if (data) {
      console.log("received", data.type);
      switch (data.type) {
        case "init":
          gm = newGame(data.option);
          gameData = data.option;
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
  ws.on("close", () => {
    clearInterval(intervalId);
  });
});
// @ts-ignore
app.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(process.env.PORT || 3000);

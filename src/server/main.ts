import { GameEvent, GameManager } from "../sushido";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import express from "express";
import j2e from "json2emap";
import _ from "lodash";
import EventEmitter from "events";
import { SushiNeosObjectManager } from "./SushiNeosObjectManager";
import { Task } from "./NeosSyncManager";
import {
  getErrors,
  NeosDataError,
  NeosGameData,
  newGame,
  newNeosGameData,
  nextGameData,
  reportGame,
  ReportGameData,
  reroll,
} from "./GameController";
import { Pos } from "../sushido/factory/type";
import { v4 as uuidv4 } from "uuid";

type SError =
  | ({
      code: "DataError";
    } & NeosDataError)
  | {
      code: "GameEvent" | "Update" | "Parse" | "Unknown";
      tag: string;
    };

type EventMessage4Neos =
  | { type: "update"; tasks: Task[] }
  | { type: "clean" }
  | { type: "report"; data: ReportGameData }
  | { type: "error"; data: SError }
  | { type: "updateGameData"; data: string };

type EventMessage4Manager =
  | {
      type: "resync" | "updateFinish" | "close";
    }
  | { type: "init"; option: any }
  | {
      type: "gameEvent";
      option: GameEvent;
    };

function json2emap(data: any) {
  return j2e(data);
}

function generateEventSender(ws: WebSocket) {
  return (data: EventMessage4Neos) => {
    console.info(`send:`, data.type);
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

app.post("/reroll", (req, res) => {
  const { useEmap = "false" } = req.query;
  const data = req.body;
  const rerolledData = reroll(data);
  res.send(useEmap === "true" ? json2emap(rerolledData) : rerolledData);
});

wss.on("connection", (ws, request) => {
  const sendEvent = generateEventSender(ws);
  const events = new EventEmitter();
  let gm: undefined | GameManager;
  let gameData: undefined | NeosGameData;
  let som: SushiNeosObjectManager | undefined = new SushiNeosObjectManager();
  let tag: string = uuidv4();
  let t = performance.now();

  console.info(`connected:${tag}`);

  const intervalId = setInterval(() => {
    if (gm) {
      try {
        const now = performance.now();
        gm.update((now - t) / 1000);
        t = now;
        events.emit("updated");
      } catch (e) {
        const id = uuidv4();
        console.error(`error:update:${tag}+${id}:`, e);
        sendEvent({
          type: "error",
          data: { code: "Update", tag: `${tag}+${id}` },
        });
      }
    }
  }, 200);

  let updateDone = true;

  sendEvent({ type: "clean" });

  events.on("updated", () => {
    if (updateDone && gm && som && gameData) {
      if (gm.isFinished) {
        const next = nextGameData(gm, gameData);
        sendEvent({
          type: "report",
          data: reportGame(gm, next),
        });
        sendEvent({
          type: "updateGameData",
          data: json2emap(next),
        });
        clearInterval(intervalId);
        setTimeout(() => {
          ws.close();
        }, 10000);
      } else {
        const tasks = som.getUpdate(gm);
        sendEvent({ type: "update", tasks });
        updateDone = false;
      }
    }
  });

  ws.on("message", (rawData) => {
    let data: undefined | EventMessage4Manager;
    let str = "";
    try {
      str = rawData.toString();
      data = JSON.parse(str);
    } catch (e) {
      const id = uuidv4();
      console.error(`error:parse:${tag}+${id}:`, e);
      sendEvent({
        type: "error",
        data: { code: "Parse", tag: `${tag}+${id}` },
      });
    }
    try {
      if (data && som) {
        // console.info(`received:${tag}:`, data.type);
        switch (data.type) {
          case "init":
            const errors = getErrors(data.option);
            console.warn(`warn:parse:${tag}:`, errors);
            if (errors.messages.length > 0) {
              sendEvent({
                type: "error",
                data: { code: "DataError", ...errors },
              });
              break;
            }
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
                gm.emitGameEvent(data.option);
                const tasks = som.getUpdate(gm);
                sendEvent({ type: "update", tasks });
                updateDone = false;
              } catch (e) {
                const id = uuidv4();
                console.error(`error:gameEvent:${tag}+${id}:`, e);
                sendEvent({
                  type: "error",
                  data: { code: "GameEvent", tag: `${tag}+${id}` },
                });
              }
            }
            break;
          case "close":
            ws.close();
            break;
        }
      }
    } catch (e) {
      const id = uuidv4();
      console.error(`error:unknown:${tag}+${id}:`, e);
      sendEvent({
        type: "error",
        data: { code: "Unknown", tag: `${tag}+${id}` },
      });
    }
  });
  ws.on("close", (code, reason) => {
    clearInterval(intervalId);
    console.info(`close:${tag}:`, code, reason.toString());
    gm = undefined;
    gameData = undefined;
    som = undefined;
  });
});

// @ts-ignore
app.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(process.env.PORT || 3000);

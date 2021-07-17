"use strict";
import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { stdout } from "process";
const fs = require("fs");
const request = require("request-promise");
const path = require("path");
const { exec, spawn } = require("child_process");
const iconv = require("iconv-lite");
const processWindows = require("node-process-windows");
const lineReader = require("line-reader");
const Promise = require("bluebird");
const eachLine = Promise.promisify(lineReader.eachLine);

const isDevelopment = process.env.NODE_ENV !== "production";
// var reqPath = "C:/Users/ya213/Desktop/AutoTradingData_2021/vue-electron";
var reqPath = path.join(__dirname, "../");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

// 註冊事件
ipcMain.handle("updateTokenFile", async (event, arg) => {
    const newPath = path.resolve(reqPath, "config.json");
    let rawdata = fs.readFileSync(newPath);
    let tokenObj = JSON.parse(rawdata);
    tokenObj.tokens = arg;

    fs.writeFileSync(newPath, JSON.stringify(tokenObj));
    return __dirname;
});
ipcMain.handle("readToken", async (event, arg) => {
    // let reqPath = path.join(__dirname, "../");
    const newPath = path.resolve(reqPath, "config.json");
    let rawdata = fs.readFileSync(newPath);
    let tokenObj = JSON.parse(rawdata);
    // console.log(tokenObj);
    return tokenObj;
});
ipcMain.handle("readData2", async (event, arg) => {
    // let reqPath = path.join(__dirname, "../");
    const newPath = path.resolve(path.join(__dirname, "../../"), "data2.csv");
    let result = [];
    let headers = [];
    let counter = 0;
    await eachLine(newPath, (line, last) => {
        let lineArray = line.split(",");
        if (counter == 0) {
            headers = lineArray;
            counter++;
        } else if (last) {
            let obj = {};
            let lastLine = line.split(",");
            lastLine.forEach((el, index) => {
                if (
                    headers[index] != undefined &&
                    headers[index].includes("散戶多空比")
                ) {
                    obj["index" + index] = el;
                } else {
                    obj[headers[index]] = el;
                }
            });
            result.push(obj);
            return false; // stop reading
        } else {
            let obj = {};
            lineArray.forEach((el, index) => {
                if (
                    headers[index] != undefined &&
                    headers[index].includes("散戶多空比")
                ) {
                    obj["index" + index] = el;
                } else {
                    obj[headers[index]] = el;
                }
            });
            result.push(obj);
            counter++;
        }
    });
    // console.log(result);

    const configPath = path.resolve(reqPath, "config.json");
    let rawdata = fs.readFileSync(configPath);
    let tokenObj = JSON.parse(rawdata);
    // console.log(tokenObj);
    return {
        timeObj: {
            time: tokenObj.time,
            frequency: tokenObj.frequency,
            directory: tokenObj.directory,
        },
        threeDatas: [
            result[result.length - 3],
            result[result.length - 2],
            result[result.length - 1],
        ],
    };
});
ipcMain.handle("updateBatFile", async (event, arg) => {
    // let reqPath = path.join(__dirname, "../");
    const newPath = path.resolve(reqPath, "runAppList.bat");

    let resultString = "@echo off\n";
    // console.log(arg);
    arg.forEach((element) => {
        if (
            element.path !== "\n" ||
            element.path !== "\r" ||
            element.path !== ""
        ) {
            let tempA = "start " + element.path + "\n";
            let tempB = "timeout" + " /t " + element.delay + "\n";
            resultString += tempA + tempB;
        }
    });

    fs.writeFileSync(newPath, resultString);
});
ipcMain.handle("readBatFile", async (event, arg) => {
    // let reqPath = path.join(__dirname, "../");
    const newPath = path.resolve(reqPath, "runAppList.bat");
    let rawdata = fs.readFileSync(newPath, "utf8");
    // let tokenObj = JSON.parse(rawdata);
    console.log(rawdata);
    return rawdata;
});
ipcMain.handle("runBatFile", async (event, arg) => {
    // let reqPath = path.join(__dirname, "../");
    const newPath = path.resolve(reqPath, "runAppList.bat");
    console.log(newPath);

    exec("start " + newPath, (error, stdout, stderr) => {
        if (error) {
            // console.error(`error: ${error}`);
            return;
        }
        // console.log(`stdout: ${stdout}`);
        // console.error(`stderr: ${stderr}`);
    });
});
ipcMain.handle("getWindows", async (event, arg) => {
    var promise = new Promise(function(resolve, reject) {
        console.log(app.getPath("userData"));
        // let reqPath = path.join(__dirname, "../");
        const newPath = path.resolve(reqPath, "test-get-windows.js");
        console.log(newPath);

        exec(
            "node " + newPath,
            // { encoding: "buffer" },
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`error: ${error}`);
                    return;
                }
                // console.log(`stdout: ${stdout}`);
                console.log(stdout);
                // console.log(iconv.decode(stdout, "Big5"));
                // console.error(`stderr: ${stderr}`);
                resolve(stdout);
            }
        );
    });
    let result = await promise.then((data) => {
        // console.log("$$$ resolved! ", data);
        return data;
    });
    return result;
});
ipcMain.handle("saveCurrentWindows", async (event, arg) => {
    // let reqPath = path.join(__dirname, "../");
    const newPath = path.resolve(reqPath, "monitoringList.json");
    // console.log(newPath);

    let newArray = [];
    // console.log(arg);
    arg.forEach((element) => {
        newArray.push({
            mainWindowTitle: element.mainWindowTitle,
            processName: element.processName,
        });
    });

    fs.writeFileSync(newPath, JSON.stringify(newArray));
});
ipcMain.handle("getMonitoringList", async (event, arg) => {
    // let reqPath = path.join(__dirname, "../");
    const newPath = path.resolve(reqPath, "monitoringList.json");
    let rawdata = fs.readFileSync(newPath);
    let monitoringObj = JSON.parse(rawdata);
    // console.log(tokenObj);
    return monitoringObj;
});
ipcMain.handle("notifyLine", async (event, arg) => {
    // let reqPath = path.join(__dirname, "../");
    const newPath = path.resolve(reqPath, "config.json");
    let rawdata = fs.readFileSync(newPath);
    let tokenObj = JSON.parse(rawdata);

    tokenObj.tokens.forEach((el) => {
        request(
            {
                method: "POST",
                url: "https://notify-api.line.me/api/notify",
                headers: {
                    "User-Agent": "my request",
                    Authorization: "Bearer " + el.token,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                form: {
                    message: arg,
                },
            },
            (error, response, body) => {
                if (!error) {
                } else {
                    console.log(error);
                }
            }
        );
    });
});
ipcMain.handle("onFileChanged", async (event, arg) => {
    if (arg == "file") {
        return await dialog
            .showOpenDialog({
                properties: ["openFile"],
            })
            .then((result) => {
                // console.log(result.canceled);
                // console.log(result.filePaths);
                return result.filePaths[0];
            })
            .catch((err) => {
                console.log(err);
            });
    } else if (arg == "directory") {
        return await dialog
            .showOpenDialog({
                properties: ["openDirectory"],
            })
            .then((result) => {
                // let reqPath = path.join(__dirname, "../");
                const newPath = path.resolve(reqPath, "config.json");
                let rawdata = fs.readFileSync(newPath);
                let tokenObj = JSON.parse(rawdata);
                tokenObj.directory = result.filePaths[0];
                fs.writeFileSync(newPath, JSON.stringify(tokenObj));
                return result.filePaths[0];
            })
            .catch((err) => {
                console.log(err);
            });
    }
});
ipcMain.handle("commandAutoTrading", async (event, arg) => {
    let tempPath = path.join(reqPath, "../");

    console.log(arg);
    let newPath = "";
    if (arg == "start") {
        newPath = path.resolve(tempPath, "start_backgroundTaifex.bat");
    } else if (arg == "stop") {
        newPath = path.resolve(tempPath, "stop_backgroundTaifex.bat");
    } else if (arg == "delete") {
        newPath = path.resolve(tempPath, "delete_backgroundTaifex.bat");
    } else if (arg == "refresh") {
        newPath = path.resolve(tempPath, "refresh_updateNow.bat");
    }
    console.log(newPath);

    var promise = new Promise(function(resolve, reject) {
        exec("start " + newPath, (error, stdout, stderr) => {
            if (error) {
                // console.error(`error: ${error}`);
                return;
            }
            console.log(stdout);
            resolve(stdout);
        });
    });
    let result = await promise.then((data) => {
        // console.log("$$$ resolved! ", data);
        return data;
    });
    return result;
});
ipcMain.handle("updateTime", async (event, arg) => {
    const newPath = path.resolve(reqPath, "config.json");
    let rawdata = fs.readFileSync(newPath);
    let tokenObj = JSON.parse(rawdata);
    // console.log(arg);
    tokenObj.time = arg.time;
    tokenObj.frequency = arg.frequency;

    fs.writeFileSync(newPath, JSON.stringify(tokenObj));
});

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1500,
        height: 800,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL("app://./index.html");
    }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString());
        }
    }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}

const fs = require("fs");
const path = require("path");
const { ipcRenderer, contextBridge } = require("electron");
const { spawn } = require("child_process");
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.ipcRenderer = ipcRenderer;
window.addEventListener("DOMContentLoaded", () => {
    // setting many function on windows

    const registerFuncs = {};

    registerFuncs.appendText = (text) => {
        // const newPath = path.resolve(__dirname, "the-text.txt");
        const newPath = path.resolve(
            "C:Usersweicheng2138Desktop",
            "the-text.txt"
        );

        console.log("saving start at path=", newPath, ";text=", text);

        let config = JSON.stringify({ token: text });
        fs.writeFileSync("C:/Users/weicheng2138/Desktop/the-text.txt", config);
    };

    registerFuncs.testCMD = (text) => {
        const newPath = path.resolve(__dirname, "the-text.txt");

        console.log(newPath);

        fs.writeFileSync(newPath, text + "\n", {
            encoding: "utf8",
            flag: "a", // append text to the end of text file
        });
    };

    // 將設定的 function 掛載到 window 上
    window.registerFuncs = registerFuncs;
});

// window.ipcRenderer.on("asynchronous-reply", (event, arg) => {
//     console.log(arg); // prints "pong"
// });

// Adds an object 'api' to the global window object:
contextBridge.exposeInMainWorld("api", {
    updateTokenFile: async (arg) => {
        return await ipcRenderer.invoke("updateTokenFile", arg);
    },
    readToken: async () => {
        return await ipcRenderer.invoke("readToken");
    },
    updateBatFile: async (arg) => {
        return await ipcRenderer.invoke("updateBatFile", arg);
    },
    readBatFile: async () => {
        return await ipcRenderer.invoke("readBatFile");
    },
    runBatFile: async () => {
        return await ipcRenderer.invoke("runBatFile");
    },
    getWindows: async () => {
        return await ipcRenderer.invoke("getWindows");
    },
    saveCurrentWindows: async (arg) => {
        return await ipcRenderer.invoke("saveCurrentWindows", arg);
    },
    getMonitoringList: async () => {
        return await ipcRenderer.invoke("getMonitoringList");
    },
    notifyLine: async (arg) => {
        return await ipcRenderer.invoke("notifyLine", arg);
    },
    onFileChanged: async (arg) => {
        return await ipcRenderer.invoke("onFileChanged", arg);
    },
    commandAutoTrading: async (arg) => {
        return await ipcRenderer.invoke("commandAutoTrading", arg);
    },
    readData2: async () => {
        return await ipcRenderer.invoke("readData2");
    },
    updateTime: async (arg) => {
        return await ipcRenderer.invoke("updateTime", arg);
    },
});

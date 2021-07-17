import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        tokens: [],
        data2: [],
        timeObj: {
            time: [
                { min: "30", hour: "14" },
                { min: "30", hour: "16" },
            ],

            frequency: 0,
            directory: "",
        },
        currentWindows: [],
        batPaths: [],
        monitoringList: [],
        alertStatus: false,
        errorMessage: "",
        switchOnOff: false,
    },
    mutations: {
        updateToken(state, payload) {
            state.tokens = payload;
        },
        updateData2(state, payload) {
            state.data2 = payload;
        },
        updateTimeObj(state, payload) {
            state.timeObj = payload;
        },
        updatePaths(state, payload) {
            state.batPaths = payload;
        },
        updateCurrentWindows(state, payload) {
            state.currentWindows = payload;
        },
        updateMonitoringList(state, payload) {
            state.monitoringList = payload;
        },
        updateAlertStatus(state, payload) {
            state.alertStatus = payload;
        },
        updateSwitchOnOff(state, payload) {
            state.switchOnOff = !state.switchOnOff;
        },
        updateErrorMessage(state, payload) {
            state.errorMessage = payload;
        },
        removeOneToken(state, payload) {
            state.tokens.splice(payload, 1);
        },
        removeOnePath(state, payload) {
            state.batPaths.splice(payload, 1);
        },
        addToken(state, payload) {
            state.tokens.push(payload);
        },
        addPath(state, payload) {
            state.batPaths.push(payload);
        },
        addGroupPath(state, payload) {
            state.batPaths.push(...payload);
        },
    },
    actions: {
        addNewToken({ commit }, payload) {
            commit("addToken", payload);
        },
        addNewPath({ commit }, payload) {
            commit("addPath", payload);
        },
        addNewGroupPath({ commit }, payload) {
            commit("addGroupPath", payload);
        },
        async update({ commit }) {
            const response = await window.api.updateTokenFile(
                this.state.tokens
            );
            console.log(response);

            // window.registerFuncs.appendText(payload);
        },
        async readTokenFile({ commit }) {
            const response = await window.api.readToken();
            console.log("readTokenFile");
            commit("updateToken", response.tokens);
        },
        async readData2({ commit }) {
            const response = await window.api.readData2();
            console.log("readData2");
            // console.log(response.timeObj);
            commit("updateData2", response.threeDatas);
            commit("updateTimeObj", response.timeObj);
        },
        async updateBatFile({ commit }) {
            await window.api.updateBatFile(this.state.batPaths);
        },
        async readBatFile({ commit }) {
            const response = await window.api.readBatFile();
            let splitArray = response.split("\n");
            let resultArray = [];
            let pathArray = [];
            let delayArray = [];
            splitArray.forEach((el, index) => {
                if (index % 2 === 1 && index !== 0) {
                    pathArray.push(el.split(" ")[1]);
                } else if (index % 2 === 0 && index !== 0) {
                    delayArray.push(el.split(" ")[2]);
                }
            });
            pathArray.forEach((el, index) => {
                if (el !== undefined) {
                    resultArray.push({
                        path: el,
                        delay: delayArray[index],
                    });
                }
            });
            // console.log(resultArray);
            commit("updatePaths", resultArray);
        },
        async runBatFile({ commit }) {
            const response = await window.api.runBatFile();
        },
        async getWindows({ commit }) {
            let response = await window.api.getWindows();
            let splitArray = response.split("\n");
            splitArray.pop();
            let newArray = [];
            splitArray.forEach((el) => {
                // console.log(el);
                let tempArray = el.split(",,");
                // console.log(tempArray);
                newArray.push({
                    pid: tempArray[0],
                    mainWindowTitle: tempArray[1],
                    processName: tempArray[2],
                });
            });
            commit("updateCurrentWindows", newArray);

            let monitoringObj = await window.api.getMonitoringList();
            commit("updateMonitoringList", monitoringObj);

            console.log(newArray);
            // console.log(monitoringObj);

            //Sort array by mainWindowTitle
            monitoringObj.sort((a, b) => {
                var nameA = a.mainWindowTitle.toUpperCase(); // ignore upper and lowercase
                var nameB = b.mainWindowTitle.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });
            newArray.sort((a, b) => {
                var nameA = a.mainWindowTitle.toUpperCase(); // ignore upper and lowercase
                var nameB = b.mainWindowTitle.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });

            let tempMonitoringObj = [];
            let counter = 0;
            monitoringObj.forEach((element, index, array) => {
                if (index === array.length - 1) {
                    counter++;
                    tempMonitoringObj.push({
                        number: counter,
                        obj: element,
                    });
                } else if (
                    element.mainWindowTitle === array[index + 1].mainWindowTitle
                ) {
                    counter++;
                } else {
                    counter++;
                    tempMonitoringObj.push({
                        number: counter,
                        obj: element,
                    });
                    counter = 0;
                }
            });
            console.log(tempMonitoringObj);

            let errorArray = [];
            tempMonitoringObj.forEach((element) => {
                let counter = 0;
                let counterCheck = 0;
                newArray.forEach((el, index, array) => {
                    if (
                        index === array.length - 1 &&
                        el.mainWindowTitle === element.obj.mainWindowTitle
                    ) {
                        counter++;
                        if (counter === element.number) {
                            errorArray.push(0);
                            counter = 0;
                        } else {
                            errorArray.push(counter - element.number);
                            counter = 0;
                        }
                    } else if (
                        el.mainWindowTitle === element.obj.mainWindowTitle &&
                        el.mainWindowTitle === array[index + 1].mainWindowTitle
                    ) {
                        counter++;
                    } else if (
                        el.mainWindowTitle === element.obj.mainWindowTitle &&
                        el.mainWindowTitle !== array[index + 1].mainWindowTitle
                    ) {
                        counter++;
                        if (counter === element.number) {
                            errorArray.push(0);
                            counter = 0;
                        } else {
                            errorArray.push(counter - element.number);
                            counter = 0;
                        }
                    } else {
                        counterCheck++;
                        if (counterCheck === array.length) {
                            errorArray.push(NaN);
                        }
                    }
                });
            });
            console.log(errorArray);

            if (
                !errorArray.every((el) => {
                    return el === 0;
                })
            ) {
                let errorMessage = "";
                errorArray.forEach((el, index) => {
                    if (el < 0) {
                        errorMessage +=
                            tempMonitoringObj[index].obj.processName +
                            ": " +
                            "少開數量 " +
                            el +
                            " 視窗名稱: " +
                            tempMonitoringObj[index].obj.mainWindowTitle +
                            "<br>";
                    } else if (el > 0) {
                        errorMessage +=
                            tempMonitoringObj[index].obj.processName +
                            ": " +
                            "多開數量 " +
                            el +
                            " 視窗名稱: " +
                            tempMonitoringObj[index].obj.mainWindowTitle +
                            "<br>";
                    } else if (isNaN(el)) {
                        errorMessage +=
                            tempMonitoringObj[index].obj.processName +
                            ": " +
                            "程式或視窗根本沒開 " +
                            " 視窗名稱: " +
                            tempMonitoringObj[index].obj.mainWindowTitle +
                            "<br>";
                    }
                });

                if (!this.state.alertStatus) {
                    await window.api.notifyLine(errorMessage);
                }
                commit("updateErrorMessage", errorMessage);
                commit("updateAlertStatus", true);
            }
        },
        async saveCurrentWindows({ commit }, payload) {
            const response = await window.api.saveCurrentWindows(payload);
        },
        removeSelectTokens({ commit }, payload) {
            payload.forEach((element) => {
                let removeIndex = this.state.tokens
                    .map((item) => {
                        return item.token;
                    })
                    .indexOf(element.token);
                commit("removeOneToken", removeIndex);
            });
        },
        removeSelectPath({ commit }, payload) {
            payload.forEach((element) => {
                let removeIndex = this.state.batPaths
                    .map((item) => {
                        return item.path;
                    })
                    .indexOf(element.path);
                commit("removeOnePath", removeIndex);
                window.api.updateBatFile(this.state.batPaths);
            });
        },
        cancelAlert({ commit }) {
            commit("updateAlertStatus", false);
        },
        onSwitchOnOff({ commit }) {
            commit("updateSwitchOnOff");
        },
        async onFileChanged({ commit }, payload) {
            const response = await window.api.onFileChanged(payload);
            // console.log(response);
            return response;
        },
        async commandAutoTrading({ commit }, payload) {
            const response = await window.api.commandAutoTrading(payload);
        },
        updateTime({ commit }, payload) {
            const response = window.api.updateTime(payload);
        },
    },
    modules: {},
});

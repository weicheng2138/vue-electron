<template>
    <div class="page-container md-alignment-top-center">
        <div class="md-layout md-gutter">
            <div class="md-layout-item">
                <md-card class="md-layout-item">
                    <md-card-header>
                        <div class="md-title">編輯開啟程式bat</div>
                    </md-card-header>
                    <md-card-content>
                        <md-table
                            v-model="batPaths"
                            md-card
                            @md-selected="onSelect"
                        >
                            <md-table-toolbar
                                ><h3>主要流程編輯</h3></md-table-toolbar
                            >
                            <md-table-toolbar
                                slot="md-table-alternate-header"
                                slot-scope="{ count }"
                            >
                                <div class="md-toolbar-section-start">
                                    {{ getAlternateLabel(count) }}
                                </div>

                                <div class="md-toolbar-section-end">
                                    <md-button
                                        class="md-icon-button"
                                        v-on:click="onDelete"
                                    >
                                        <md-icon>delete</md-icon>
                                    </md-button>
                                </div>
                            </md-table-toolbar>

                            <md-table-row
                                slot="md-table-row"
                                slot-scope="{ item }"
                                md-selectable="multiple"
                                md-auto-select
                            >
                                <md-table-cell
                                    md-label="路徑"
                                    md-sort-by="name"
                                    >{{ item.path }}</md-table-cell
                                >
                                <md-table-cell
                                    md-label="延遲時間 (s)"
                                    md-sort-by="token"
                                    >{{ item.delay }}</md-table-cell
                                >
                            </md-table-row>
                        </md-table>
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <div class="md-layout md-gutter">
                            <div class="md-layout-item">
                                <md-button
                                    class="md-primary"
                                    v-on:click="onFileChange"
                                >
                                    <md-icon>folder</md-icon>
                                </md-button>
                            </div>
                            <div class="md-layout-item">
                                <md-field>
                                    <label>填入執行延遲</label>
                                    <md-input v-model="inputDelay"></md-input>
                                </md-field>
                            </div>
                        </div>
                        <div class="md-layout md-gutter">
                            <div class="md-layout-item">
                                <md-field>
                                    <label>填入執行路徑</label>
                                    <md-input v-model="inputPath"></md-input>
                                </md-field>
                            </div>
                            <div class="md-layout-item">
                                <md-button
                                    class="md-fab md-primary"
                                    v-on:click="addNewPath"
                                >
                                    <md-icon>add</md-icon>
                                </md-button>
                            </div>
                        </div>
                    </md-card-actions>
                    <md-card-actions md-alignment="right">
                        <md-button
                            type="submit"
                            class="md-primary"
                            :disabled="sending"
                            v-on:click="updateBatFile"
                            >寫入bat執行檔</md-button
                        >
                        <md-button
                            type="submit"
                            class="md-primary"
                            :disabled="sending"
                            v-on:click="runBatFile"
                            >執行</md-button
                        >
                    </md-card-actions>
                    <!-- <md-card-content>
                        <md-table
                            v-model="arrayPathSecond"
                            md-card
                            @md-selected="onSelectSecond"
                        >
                            <md-table-toolbar
                                ><h3>群組流程編輯</h3></md-table-toolbar
                            >
                            <md-table-toolbar
                                slot="md-table-alternate-header"
                                slot-scope="{ count }"
                            >
                                <div class="md-toolbar-section-start">
                                    {{ getAlternateLabel(count) }}
                                </div>

                                <div class="md-toolbar-section-end">
                                    <md-button
                                        class="md-icon-button"
                                        v-on:click="onDeleteSecond"
                                    >
                                        <md-icon>delete</md-icon>
                                    </md-button>
                                </div>
                            </md-table-toolbar>

                            <md-table-row
                                slot="md-table-row"
                                slot-scope="{ item }"
                                md-selectable="multiple"
                                md-auto-select
                            >
                                <md-table-cell
                                    md-label="路徑"
                                    md-sort-by="name"
                                    >{{ item.path }}</md-table-cell
                                >
                                <md-table-cell
                                    md-label="延遲時間 (s)"
                                    md-sort-by="token"
                                    >{{ item.delay }}</md-table-cell
                                >
                            </md-table-row>
                        </md-table>
                    </md-card-content>
                    <md-card-actions md-alignment="right">
                        <div class="md-layout md-gutter">
                            <div class="md-layout-item">
                                <md-field>
                                    <label>填入執行路徑</label>
                                    <md-input
                                        v-model="inputPathSecond"
                                    ></md-input>
                                </md-field>
                            </div>
                            <div class="md-layout-item">
                                <md-field>
                                    <label>填入執行延遲</label>
                                    <md-input
                                        v-model="inputDelaySecond"
                                    ></md-input>
                                </md-field>
                            </div>
                            <div class="md-layout-item">
                                <md-button
                                    class="md-fab md-primary"
                                    v-on:click="addNewGroupPath"
                                >
                                    <md-icon>add</md-icon>
                                </md-button>
                            </div>
                        </div>
                    </md-card-actions>
                    <md-card-actions md-alignment="right">
                        <md-button
                            type="submit"
                            class="md-primary"
                            :disabled="sending"
                            v-on:click="addGroup"
                            >群組加入上方</md-button
                        >
                    </md-card-actions> -->
                </md-card>
            </div>
            <div class="md-layout-item">
                <md-card class="md-layout-item"
                    ><md-table
                        v-model="currentWindows"
                        md-card
                        @md-selected="onSelectCurrentWindows"
                    >
                        <md-table-toolbar
                            ><h1 class="md-title">
                                目前可以找到的視窗列表
                            </h1></md-table-toolbar
                        >

                        <md-table-row
                            slot="md-table-row"
                            slot-scope="{ item }"
                            md-selectable="multiple"
                            md-auto-select
                            :md-disabled="switchOnOff"
                        >
                            <md-table-cell
                                md-label="視窗標題"
                                md-sort-by="mainWindowTitle"
                                >{{ item.mainWindowTitle }}</md-table-cell
                            >
                            <md-table-cell
                                md-label="程式名稱"
                                md-sort-by="processName"
                                >{{ item.processName }}</md-table-cell
                            >
                        </md-table-row>
                    </md-table>
                    <md-card-actions md-alignment="right">
                        <md-button
                            type="submit"
                            class="md-primary"
                            :disabled="switchOnOff"
                            v-on:click="onSaveCurrentWindows"
                            >儲存當前之選擇</md-button
                        >
                        <md-switch
                            v-model="switchOnOff"
                            class="md-primary"
                            v-on:change="onTimer"
                            >監控啟動</md-switch
                        >
                    </md-card-actions>
                </md-card>
            </div>

            <!-- <md-dialog :md-active.sync="alert">
                <md-dialog-title>警告!!!有視窗少開或多開</md-dialog-title>
                <md-card>
                    <md-card-content>
                        {{ errorMessage }}
                    </md-card-content>
                </md-card>
                <md-dialog-actions>
                    <md-button class="md-primary" @click="onConfirmDialog"
                        >Save</md-button
                    >
                </md-dialog-actions>
            </md-dialog> -->

            <md-dialog-confirm
                :md-active.sync="alert"
                md-title="警告!!! 有程式開啟未照清單"
                :md-content="errorMessage"
                md-confirm-text="確認"
                md-cancel-text="取消"
                @md-cancel="onCancelDialog"
                @md-confirm="onConfirmDialog"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "MonitorWindows",
    data: () => ({
        selectedMain: [],
        selectedSecond: [],
        selectedCurrentWindows: [],
        arrayPathSecond: [],
        sending: false,
        inputPath: "",
        inputDelay: "",
        inputPathSecond: "",
        inputDelaySecond: "",
        timer: null,
        switchOnOff: false,
        alert: false,
        file: null,
    }),
    // created: () => {
    //     this.$store.dispatch("readTokenFile");
    // },
    mounted() {
        // this.$store.dispatch("getWindows");
        this.$store.dispatch("readBatFile");
    },
    computed: {
        tokens() {
            return this.$store.state.tokens;
        },
        currentWindows() {
            return this.$store.state.currentWindows;
        },
        batPaths() {
            return this.$store.state.batPaths;
        },
        alertStatus() {
            return this.$store.state.alertStatus;
        },
        errorMessage() {
            return this.$store.state.errorMessage;
        },
    },
    methods: {
        readBatFile() {
            this.$store.dispatch("readBatFile");
        },
        updateBatFile() {
            this.$store.dispatch("updateBatFile");
        },
        addGroup() {
            this.$store.dispatch("addNewGroupPath", this.arrayPathSecond);
            this.arrayPathSecond = [];
        },
        runBatFile() {
            this.$store.dispatch("runBatFile");
        },
        addNewPath() {
            this.$store.dispatch("addNewPath", {
                path: this.inputPath,
                delay: this.inputDelay,
            });
        },
        addNewGroupPath() {
            this.arrayPathSecond.push({
                path: this.inputPathSecond,
                delay: this.inputDelaySecond,
            });
        },
        onSelect(items) {
            this.selectedMain = items;
        },
        onSelectSecond(items) {
            this.selectedSecond = items;
        },
        onSelectCurrentWindows(items) {
            this.selectedCurrentWindows = items;
        },
        getAlternateLabel(count) {
            let plural = "";

            if (count > 1) {
                plural = "s";
            }

            return `${count} command ${plural} selected`;
        },
        onDeleteSecond() {
            this.selectedSecond.forEach((element) => {
                let removeIndex = this.arrayPathSecond
                    .map((item) => {
                        return item.path;
                    })
                    .indexOf(element.path);
                this.arrayPathSecond.splice(removeIndex, 1);
            });
        },
        onDelete() {
            this.$store.dispatch("removeSelectPath", this.selectedMain);
        },
        onTimer() {
            if (this.switchOnOff) {
                this.timer = setInterval(() => {
                    this.$store.dispatch("getWindows");
                    this.alert = this.alertStatus;
                    if (this.alert === true) {
                        clearInterval(this.timer);
                    }
                }, 3000);
            } else {
                clearInterval(this.timer);
            }
        },
        onSaveCurrentWindows() {
            this.$store.dispatch(
                "saveCurrentWindows",
                this.selectedCurrentWindows
            );
        },
        onCancelDialog() {
            this.$store.dispatch("cancelAlert");
            this.switchOnOff = false;
        },
        onConfirmDialog() {
            this.$store.dispatch("cancelAlert");
            this.switchOnOff = false;
        },
        async onFileChange() {
            this.inputPath = await this.$store.dispatch(
                "onFileChanged",
                "file"
            );
        },
    },
};
</script>

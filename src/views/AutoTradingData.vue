<template>
    <div class="page-container md-alignment-top-center">
        <md-card class="md-layout-item">
            <md-card-header>
                <div class="md-title">籌碼爬蟲</div>
            </md-card-header>
            <md-card-content>
                <ve-table :columns="columns" :table-data="data2"></ve-table>
            </md-card-content>
            <md-card-actions md-alignment="right">
                <div class="md-layout md-gutter">
                    <div class="md-layout-item">
                        <!-- <md-field>
                            <label>CSV資料夾所在</label>
                            <md-input v-model="inputPath"></md-input>
                        </md-field> -->
                        <p>{{ timeObj.directory }}</p>
                    </div>
                    <div class="md-layout-item">
                        <md-button
                            class="md-fab md-primary"
                            v-on:click="onFileChange"
                        >
                            <md-icon>folder</md-icon>
                            <md-tooltip md-direction="bottom"
                                >設定儲存的CSV資料夾位置</md-tooltip
                            >
                        </md-button>
                    </div>
                    <div class="md-layout-item">
                        <md-button
                            class="md-fab md-primary"
                            v-on:click="onCommandRefresh"
                        >
                            <md-icon>refresh</md-icon>
                            <md-tooltip md-direction="bottom"
                                >手動更新歷史資料到今日，程式開啟並不會自動執行</md-tooltip
                            >
                        </md-button>
                    </div>
                </div>
            </md-card-actions>
            <md-card-actions md-alignment="right">
                <div class="md-layout md-gutter">
                    <div class="md-layout-item">
                        <label
                            >開始時間 {{ timeObj.time[0].HH }}:{{
                                timeObj.time[0].mm
                            }}
                            <md-tooltip md-direction="bottom"
                                >預先跑歷史資料開始執行的時間點，跟14:55無關，14:55會自動跑當日</md-tooltip
                            ></label
                        >
                        <vue-timepicker
                            drop-direction="up"
                            format="HH:mm"
                            v-model="inputTime[0]"
                        ></vue-timepicker>
                    </div>
                    <div class="md-layout-item">
                        <label
                            >結束時間 {{ timeObj.time[1].HH }}:{{
                                timeObj.time[1].mm
                            }}
                            <md-tooltip md-direction="bottom"
                                >當日資料爬蟲的最後時刻，如果時間到沒有爬到當日資料，會警告</md-tooltip
                            ></label
                        >
                        <vue-timepicker
                            drop-direction="up"
                            format="HH:mm"
                            v-model="inputTime[1]"
                        ></vue-timepicker>
                    </div>

                    <div class="md-layout-item">
                        <md-field>
                            <md-tooltip md-direction="bottom"
                                >執行區間為14:55到結束時間，輸入執行頻率</md-tooltip
                            >
                            <label
                                >執行頻率 {{ timeObj.frequency }} 秒一次</label
                            >
                            <md-input v-model="frequency"></md-input>
                        </md-field>
                    </div>
                </div>
            </md-card-actions>
            <md-card-actions md-alignment="right">
                <md-button
                    type="submit"
                    class="md-primary"
                    :disabled="sending"
                    v-on:click="updateTime"
                    >更新時間與頻率</md-button
                >
                <md-button
                    type="submit"
                    class="md-primary"
                    :disabled="sending"
                    v-on:click="onCommandStart"
                    >啟動並於背景執行</md-button
                >
                <md-button
                    type="submit"
                    class="md-primary"
                    :disabled="sending"
                    v-on:click="onCommandStop"
                    >關閉</md-button
                >
                <md-button
                    type="submit"
                    class="md-primary"
                    :disabled="sending"
                    v-on:click="onCommandDelete"
                    >關閉並刪除背景</md-button
                >
            </md-card-actions>
        </md-card>
    </div>
</template>

<script>
import VueTimepicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";

export default {
    name: "AutoTradingData",
    components: { VueTimepicker },
    data: () => ({
        columns: [
            { field: "日期", key: "0", title: "日期", align: "left" },
            {
                field: "自營商淨額",
                key: "1",
                title: "自營商淨額",
                align: "left",
            },
            {
                field: "自營商未平倉",
                key: "2",
                title: "自營商未平倉",
                align: "left",
            },
            {
                field: "外資未平倉",
                key: "3",
                title: "外資未平倉",
                align: "left",
            },
            {
                field: "五大所有月未平倉",
                key: "4",
                title: "五大所有月未平倉",
                align: "left",
            },
            {
                field: "十大所有月未平倉",
                key: "5",
                title: "十大所有月未平倉",
                align: "left",
            },
            {
                field: "五大特定人所有月未平倉",
                key: "6",
                title: "五大特定人所有月未平倉",
                align: "left",
            },
            {
                field: "十大特定人所有月未平倉",
                key: "7",
                title: "十大特定人所有月未平倉",
                align: "left",
            },
            {
                field: "五大十大全市場未沖銷部位數所有契約",
                key: "8",
                title: "五大十大全市場未沖銷部位數所有契約",
                align: "left",
            },
            {
                field: "自營商選擇權淨額",
                key: "9",
                title: "自營商選擇權淨額",
                align: "left",
            },
            {
                field: "自營商選擇權未平倉",
                key: "10",
                title: "自營商選擇權未平倉",
                align: "left",
            },
            {
                field: "外資選擇權淨額",
                key: "11",
                title: "外資選擇權淨額",
                align: "left",
            },
            {
                field: "外資選擇權未平倉",
                key: "12",
                title: "外資選擇權未平倉",
                align: "left",
            },
            {
                field: "五大近月未平倉",
                key: "13",
                title: "五大近月未平倉",
                align: "left",
            },
            {
                field: "十大近月未平倉",
                key: "14",
                title: "十大近月未平倉",
                align: "left",
            },
            {
                field: "五大特定人近月未平倉",
                key: "15",
                title: "五大特定人近月未平倉",
                align: "left",
            },
            {
                field: "十大特定人近月未平倉",
                key: "16",
                title: "十大特定人近月未平倉",
                align: "left",
            },
            {
                field: "五大十大全市場未沖銷近月契約",
                key: "17",
                title: "五大十大全市場未沖銷近月契約",
                align: "left",
            },
            {
                field: "自營商選擇權買入買權未平倉",
                key: "18",
                title: "自營商選擇權買入買權未平倉",
                align: "left",
            },
            {
                field: "自營商選擇權買入賣權未平倉",
                key: "19",
                title: "自營商選擇權買入賣權未平倉",
                align: "left",
            },
            {
                field: "自營商選擇權賣出買權未平倉",
                key: "20",
                title: "自營商選擇權賣出買權未平倉",
                align: "left",
            },
            {
                field: "自營商選擇權賣出賣權未平倉",
                key: "21",
                title: "自營商選擇權賣出賣權未平倉",
                align: "left",
            },
            {
                field: "外資選擇權買入買權未平倉",
                key: "22",
                title: "外資選擇權買入買權未平倉",
                align: "left",
            },
            {
                field: "外資選擇權買入賣權未平倉",
                key: "23",
                title: "外資選擇權買入賣權未平倉",
                align: "left",
            },
            {
                field: "外資選擇權賣出買權未平倉",
                key: "24",
                title: "外資選擇權賣出買權未平倉",
                align: "left",
            },
            {
                field: "外資選擇權賣出賣權未平倉",
                key: "25",
                title: "外資選擇權賣出賣權未平倉",
                align: "left",
            },
            {
                field: "自營小台未平倉",
                key: "26",
                title: "自營小台未平倉",
                align: "left",
            },
            {
                field: "外資小台未平倉",
                key: "27",
                title: "外資小台未平倉",
                align: "left",
            },
            {
                field: "自營小台多方未平倉",
                key: "28",
                title: "自營小台多方未平倉",
                align: "left",
            },
            {
                field: "外資小台多方未平倉",
                key: "29",
                title: "外資小台多方未平倉",
                align: "left",
            },
            {
                field: "自營小台空方未平倉",
                key: "30",
                title: "自營小台空方未平倉",
                align: "left",
            },
            {
                field: "外資小台空方未平倉",
                key: "31",
                title: "外資小台空方未平倉",
                align: "left",
            },
            {
                field: "自營小台交易口數淨額",
                key: "32",
                title: "自營小台交易口數淨額",
                align: "left",
            },
            {
                field: "外資小台交易口數淨額",
                key: "33",
                title: "外資小台交易口數淨額",
                align: "left",
            },
            {
                field: "自營加外資小台未平倉",
                key: "34",
                title: "自營加外資小台未平倉",
                align: "left",
            },
            {
                field: "外資大台加小台除4未平倉",
                key: "35",
                title: "外資大台加小台除4未平倉",
                align: "left",
            },
            {
                field: "台指開",
                key: "36",
                title: "台指開",
                align: "left",
            },
            {
                field: "台指高",
                key: "37",
                title: "台指高",
                align: "left",
            },
            {
                field: "台指低",
                key: "38",
                title: "台指低",
                align: "left",
            },
            {
                field: "台指收",
                key: "39",
                title: "台指收",
                align: "left",
            },
            {
                field: "台指量",
                key: "40",
                title: "台指量",
                align: "left",
            },
            {
                field: "全市場小台未平倉",
                key: "41",
                title: "全市場小台未平倉",
                align: "left",
            },
            {
                field: "三大法人小台未平倉",
                key: "42",
                title: "三大法人小台未平倉",
                align: "left",
            },
            {
                field: "index61",
                key: "43",
                title: "散戶多空比(三大法人)",
                align: "left",
            },
            {
                field: "index62",
                key: "44",
                title: "散戶多空比(外資)",
                align: "left",
            },
            {
                field: "index63",
                key: "45",
                title: "散戶多空比(自營商)",
                align: "left",
            },
            {
                field: "大外資",
                key: "46",
                title: "大外資",
                align: "left",
            },
            {
                field: "小外資",
                key: "47",
                title: "小外資",
                align: "left",
            },
            {
                field: "投信台指未平倉",
                key: "48",
                title: "投信台指未平倉",
                align: "left",
            },
            {
                field: "台指選擇權波動率",
                key: "49",
                title: "台指選擇權波動率",
                align: "left",
            },
        ],
        selected: [],
        sending: false,
        inputPath: "",
        inputName: "",
        inputTime: [
            {
                HH: null,
                mm: null,
            },
            {
                HH: null,
                mm: null,
            },
        ],
        frequency: null,
    }),
    // created: () => {
    //     this.$store.dispatch("readTokenFile");
    // },
    mounted() {
        this.$store.dispatch("readData2");
    },
    computed: {
        data2() {
            return this.$store.state.data2;
        },
        timeObj() {
            return this.$store.state.timeObj;
        },
    },
    methods: {
        readData2() {
            this.$store.dispatch("readData2");
        },
        async onFileChange() {
            await this.$store.dispatch("onFileChanged", "directory");
            await this.$store.dispatch("readData2");
        },
        onCommandStart() {
            this.$store.dispatch("commandAutoTrading", "start");
        },
        onCommandStop() {
            this.$store.dispatch("commandAutoTrading", "stop");
        },
        onCommandDelete() {
            this.$store.dispatch("commandAutoTrading", "delete");
        },
        async updateTime() {
            await this.$store.dispatch("updateTime", {
                time: this.inputTime,
                frequency: this.frequency,
            });
            await this.$store.dispatch("readData2");
        },
        async onCommandRefresh() {
            this.$store.dispatch("readData2");
            let msg = await this.$store.dispatch(
                "commandAutoTrading",
                "refresh"
            );
            this.$store.dispatch("readData2");
        },
    },
};
</script>

<template>
    <div class="page-container">
        <md-app md-waterfall md-mode="fixed-last">
            <md-app-toolbar class="md-large md-dense md-primary">
                <div class="md-toolbar-row">
                    <div class="md-toolbar-section-start">
                        <md-button
                            class="md-icon-button"
                            @click="menuVisible = !menuVisible"
                        >
                            <md-icon>menu</md-icon>
                        </md-button>

                        <span class="md-title">視窗監控與籌碼爬蟲狀態監控</span>
                    </div>

                    <div class="md-toolbar-section-end">
                        <md-button class="md-icon-button">
                            <md-icon>more_vert</md-icon>
                        </md-button>
                        <md-badge md-content="1">
                            <md-button class="md-icon-button">
                                <md-icon>notifications</md-icon>
                            </md-button>
                        </md-badge>
                    </div>
                </div>

                <div class="md-toolbar-row">
                    <md-tabs class="md-primary">
                        <md-tab
                            id="tab-window-monitor"
                            md-label="視窗監控"
                            to="/monitorWindows"
                        ></md-tab>
                        <md-tab
                            id="tab-line-config"
                            md-label="Line 金鑰設定"
                            to="/linetoken"
                        ></md-tab>
                        <md-tab
                            id="tab-trading-config"
                            md-label="籌碼爬蟲"
                            to="/autoTradingData"
                        ></md-tab>
                    </md-tabs>
                </div>
            </md-app-toolbar>

            <md-app-drawer :md-active.sync="menuVisible">
                <md-toolbar class="md-transparent" md-elevation="0"
                    >Navigation</md-toolbar
                >

                <md-list>
                    <md-list-item>
                        <md-icon>move_to_inbox</md-icon>
                        <span class="md-list-item-text">保留</span>
                    </md-list-item>

                    <!-- <md-list-item>
                        <md-icon>send</md-icon>
                        <span class="md-list-item-text">Sent Mail</span>
                    </md-list-item>

                    <md-list-item>
                        <md-icon>delete</md-icon>
                        <span class="md-list-item-text">Trash</span>
                    </md-list-item>

                    <md-list-item>
                        <md-icon>error</md-icon>
                        <span class="md-list-item-text">Spam</span>
                    </md-list-item> -->
                </md-list>
            </md-app-drawer>

            <md-app-content>
                <router-view />
            </md-app-content>
        </md-app>
    </div>
</template>

<style lang="scss" scoped>
.md-app {
    max-height: 800px;
    height: 800px;
    border: 1px solid rgba(#000, 0.12);
}

// Demo purposes only
.md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
}
</style>

<script>
export default {
    name: "Navigation",
    data: () => ({
        menuVisible: false,
    }),
};
</script>

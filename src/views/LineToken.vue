<template>
    <div class="page-container md-alignment-top-center">
        <md-card class="md-layout-item">
            <md-card-header>
                <div class="md-title">目前所有LINE NOTIFY金鑰</div>
            </md-card-header>
            <md-card-content>
                <md-table v-model="tokens" md-card @md-selected="onSelect">
                    <md-table-toolbar> </md-table-toolbar>
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
                        <md-table-cell md-label="Name" md-sort-by="name">{{
                            item.name
                        }}</md-table-cell>
                        <md-table-cell md-label="Token" md-sort-by="token">{{
                            item.token
                        }}</md-table-cell>
                    </md-table-row>
                </md-table>
            </md-card-content>
            <md-card-actions md-alignment="right">
                <div class="md-layout md-gutter">
                    <div class="md-layout-item">
                        <md-field>
                            <label>填入名稱</label>
                            <md-input v-model="inputName"></md-input>
                        </md-field>
                    </div>
                    <div class="md-layout-item">
                        <md-field>
                            <label>填入token</label>
                            <md-input v-model="inputToken"></md-input>
                        </md-field>
                    </div>
                    <div class="md-layout-item">
                        <md-button
                            class="md-fab md-primary"
                            v-on:click="addNewToken"
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
                    v-on:click="updateTokenFile"
                    >更新金鑰</md-button
                >
                <md-button
                    type="submit"
                    class="md-primary"
                    :disabled="sending"
                    v-on:click="readToken"
                    >讀取金鑰</md-button
                >
            </md-card-actions>
        </md-card>
    </div>
</template>

<script>
export default {
    name: "LineToken",
    data: () => ({
        selected: [],
        sending: false,
        inputToken: "",
        inputName: "",
    }),
    // created: () => {
    //     this.$store.dispatch("readTokenFile");
    // },
    mounted() {
        this.$store.dispatch("readTokenFile");
    },
    computed: {
        tokens() {
            return this.$store.state.tokens;
        },
    },
    methods: {
        readToken() {
            this.$store.dispatch("readTokenFile");
        },
        updateTokenFile() {
            this.$store.dispatch("update");
        },
        addNewToken() {
            this.$store.dispatch("addNewToken", {
                name: this.inputName,
                token: this.inputToken,
            });
        },
        onSelect(items) {
            this.selected = items;
        },
        getAlternateLabel(count) {
            let plural = "";

            if (count > 1) {
                plural = "s";
            }

            return `${count} user${plural} selected`;
        },
        onDelete() {
            this.$store.dispatch("removeSelectTokens", this.selected);
        },
    },
};
</script>

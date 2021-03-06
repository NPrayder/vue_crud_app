<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="dialog" max-width="600" persistent>
        <template v-slot:activator="{ on }">
            <v-btn fab dark color="indigo" v-on="on" fixed right bottom>
                <v-icon dark>add</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">{{formTitle}}</span>
            </v-card-title>

            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex v-for="field in fields" xs12 sm12 :class="field.size" :key="field.value">
                            <v-text-field
                                    v-model="item[field.value]"
                                    :label="field.label"
                                    v-if="field.type === 'textField'"
                            ></v-text-field>
                            <v-select
                                    v-else-if="field.type === 'select'"
                                    :items="field.selectItems"
                                    v-model="item[field.value]"
                                    :item-text="field.field || 'name'"
                                    item-value="id"
                                    return-object
                                    :label="field.label"
                            ></v-select>
                            <v-menu
                                    v-else
                                    min-width="240px"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    v-model="field.menu"
                            >
                                <v-text-field
                                        :value="item[field.value]"
                                        slot="activator"
                                        :label="field.label"
                                        prepend-icon="date_range"
                                ></v-text-field>
                                <v-date-picker
                                        v-model="item[field.value]"
                                        no-title
                                        scrollable
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="field.menu = false">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="close">Відмінити</v-btn>
                <v-btn color="blue darken-1" flat @click="save">Зберегти</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import {HTTP} from "@/util/HTTP";
    import DatePicker from "@/components/others/DatePicker";

    export default {
        name: "UniversalDialog",
        components: {DatePicker},
        props: {
            apiLink: String,
            fields: Array,
        },
        data() {
            return {
                dialog: false,
                item: {},
                menu: false
            }
        },
        computed: {
            formTitle() {
                return this.item.id ? "Редагування" : "Додавання";
            }
        },
        watch: {
            dialog(newValue) {
                if (!newValue) {
                    this.close();
                }
            },
        },
        methods: {
            close() {
                this.dialog = false;
                setTimeout(() => {
                    this.item = {};
                }, 300)
            },
            async save() {
                try {
                    const { data } = await HTTP({
                        method: this.item.id ? "PUT" : "POST",
                        url: `api/${this.apiLink}/` + (this.item.id || ""),
                        data: this.item,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    this.close();
                    this.$root.$emit("call-snackbar", this.item.id ? "Запис відредаговано" : "Запис додано");
                    this.$root.$emit((this.item.id ? "edit" : "add") + "-item", data);
                } catch (e) {
                    console.log(e);
                }
            }
        },
        mounted() {
            this.$root.$on("item-edit-dialog", (item) => {
                this.item = Object.assign({}, item);
                this.dialog = true;
            });

            this.fields.forEach(field => {
                if (field.linkForData) {
                    HTTP.get(`api/${field.linkForData}`)
                        .then(res => field.selectItems = res.data)
                        .catch(error => console.log(error));
                }
            });
        }
    }
</script>

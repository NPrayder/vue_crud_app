<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-dialog v-model="dialog" max-width="600" persistent>
            <template v-slot:activator="{ on }">
                <v-btn fab dark color="indigo" v-on="on" fixed right bottom>
                    <v-icon dark>search</v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">Запит №10</span>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark v-on="on">
                                <v-icon
                                        small
                                        class="mr-2"
                                        @click="editItem(props.item)"
                                >
                                    info
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Одержати перелік лабораторій, які беруть участь у випробуванні вказаного виробу. </span>
                    </v-tooltip>

                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12>
                                <v-select
                                        :items="tables"
                                        v-model="currentTable"
                                        item-text="name"
                                        return-object
                                        label="Категорія виробів"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-select
                                        :items="products"
                                        v-model="currentProduct"
                                        item-text="name"
                                        item-value="id"
                                        return-object
                                        label="Виріб"
                                ></v-select>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="closeForm">Відмінити</v-btn>
                    <v-btn color="blue darken-1" flat @click="search">Пошук</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <universal-table
                :api-link="apiLink"
                :items="items"
                :headers="headers"
                :loading="loading"
                table-name="Запит 10"
                :hidden-action="true"
        ></universal-table>
    </div>
</template>

<script>
    import {HTTP} from "@/util/HTTP";
    import UniversalTable from "@/components/UniversalTable";

    export default {
        name: "Query10",
        components: {UniversalTable},
        data() {
            return {
                /*props for table*/
                items: [],
                headers: [
                    {text: 'Назва лабораторії', value: 'name', sortable: false},
                    {text: 'Підприємство', value: 'enterpriseName', sortable: false},
                ],
                loading: false,

                /*props for dialog and others*/
                apiLink: '',
                dialog: true,

                /*objects for select*/
                tables: [
                    {name: 'Планери', apiLink: 'gliders', queryLink: 'get-lab-by-glider-test'},
                    {name: 'Дельтаплани', apiLink: 'hang_gliders', queryLink: 'get-lab-by-hang-glider-test'},
                    {name: 'Гелікоптери', apiLink: 'helicopters', queryLink: 'get-lab-by-helicopter-test'},
                    {name: 'Літаки', apiLink: 'planes', queryLink: 'get-lab-by-plane-test'},
                    {name: 'Ракети', apiLink: 'rockets', queryLink: 'get-lab-by-rocket-test'},
                ],
                products: [],

                /*save current select value*/
                currentTable: {},
                currentProduct: {},
            }
        },
        watch: {
            async currentTable() {
                try {
                    const {data} = await HTTP.get(`/api/${this.currentTable.apiLink}`);
                    this.products = data;
                } catch (e) {
                    console.log(e);
                }
            }
        },
        methods: {
            closeForm() {
                this.dialog = false;
            },
            async search() {
                this.items = [];
                this.loading = true;

                try {
                    const {data} = await HTTP.get(`/api/laboratories/${this.currentTable.queryLink}`, {
                        params: {
                            "product_id": this.currentProduct.id,
                        }
                    });
                    this.items = data;
                } catch (e) {
                    console.log(e);
                } finally {
                    this.closeForm();
                    this.loading = false;
                }
            }
        }
    }
</script>

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
                    <span class="headline">Запит №13</span>

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
                        <span>Одержати перелік устаткування, яке використовувалося під час випробування вказаного виробу, виробів вказаної категорії та загалом у випробуваннях у конкретній лабораторії за вказаний період.</span>
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
                                        :disabled="!canChoose"
                                        :items="products"
                                        v-model="currentProduct"
                                        item-text="name"
                                        item-value="id"
                                        return-object
                                        label="Виріб"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-select
                                        :items="laboratories"
                                        v-model="currentLaboratory"
                                        item-text="name"
                                        item-value="id"
                                        return-object
                                        label="Лабораторія"
                                ></v-select>
                            </v-flex>
                            <!--Date pickers-->
                            <v-flex md6>
                                <v-menu
                                        :disabled="!canChoose"
                                        min-width="240px"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        v-model="datePicker1"
                                >
                                    <v-text-field
                                            :disabled="!canChoose"
                                            :value="startDate"
                                            slot="activator"
                                            label="Початкова дата"
                                            prepend-icon="date_range"
                                    ></v-text-field>
                                    <v-date-picker
                                            v-model="startDate"
                                            no-title
                                            scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="datePicker1 = false">OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex md6>
                                <v-menu
                                        :disabled="!canChoose"
                                        min-width="240px"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        v-model="datePicker2"
                                >
                                    <v-text-field
                                            :value="endDate"
                                            :disabled="!canChoose"
                                            slot="activator"
                                            label="Початкова дата"
                                            prepend-icon="date_range"
                                    ></v-text-field>
                                    <v-date-picker
                                            v-model="endDate"
                                            no-title
                                            scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="datePicker2 = false">OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
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
                table-name="Запит 13"
                :hidden-action="true"
        ></universal-table>
    </div>
</template>

<script>
    import {HTTP} from "@/util/HTTP";
    import UniversalTable from "@/components/UniversalTable";

    export default {
        name: "Query13",
        components: {UniversalTable},
        data() {
            return {
                /*props for table*/
                items: [],
                headers: [
                    {text: 'Назва', value: 'name', sortable: false},
                ],
                loading: false,

                /*props for dialog and others*/
                apiLink: '',
                loadAll: false,
                dialog: true,
                canChoose: false,

                /*objects for select*/
                tables: [
                    {name: 'Планери', apiLink: 'gliders', queryLink: 'get-by-glider-tests'},
                    {name: 'Дельтаплани', apiLink: 'hang_gliders', queryLink: 'get-by-hang-gliders-tests'},
                    {name: 'Гелікоптери', apiLink: 'helicopters', queryLink: 'get-by-helicopter-tests'},
                    {name: 'Літаки', apiLink: 'planes', queryLink: 'get-by-plane-tests'},
                    {name: 'Ракети', apiLink: 'rockets', queryLink: 'get-by-rocket-tests'},
                    {name: 'Усі категорії', queryLink: 'get-used-equipment'},
                ],
                products: [],
                laboratories: [],

                /*save current select value*/
                currentTable: {},
                currentProduct: {},
                currentLaboratory: {},

                /*fields for date*/
                startDate: '',
                endDate: '',
                datePicker1: false,
                datePicker2: false,
            }
        },
        watch: {
            async currentTable() {
                this.loadAll = false;
                this.canChoose = this.currentTable.apiLink;
                if (this.currentTable.apiLink) {
                    try {
                        const {data} = await HTTP.get(`/api/${this.currentTable.apiLink}`);
                        this.products = data;
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    this.loadAll = true;
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
                    const {data} = await HTTP.get(`/api/equipments/${this.currentTable.queryLink}`, {
                        params: {
                            "product_id": this.currentProduct.id,
                            "laboratory_id": this.currentLaboratory.id,
                            "start_date": this.startDate,
                            "end_date": this.endDate
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
        },
        async mounted() {
            try {
                const {data} = await HTTP.get(`/api/laboratories`);
                this.laboratories = data;
            } catch (e) {
                console.log(e);
            }
        }
    }
</script>

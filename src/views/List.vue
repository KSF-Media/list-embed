<template>
    <div>
        <main>
            <button @click="resetFilters()"><font-awesome-icon icon="redo" /></button>
            <table>
                <tr>
                    <td v-for="(header, header_index) in columnHeaders" :key="header_index">
                        <h2 v-text="header.substring(0, 1).toUpperCase() +  header.substring(1, header.length)"></h2>
                        <button @click="sortBy(header)">Sortera a-ö/ö-a</button>
                        <input v-model="searchFields[header.replace(' ', '').toLowerCase()].model" placeholder="Sök..." @input="filterBy()"/>
                    </td>
                </tr>
                <tr v-for="(row, row_index) in listData" :key="row_index">
                    <td v-for="(col, col_index) in row" :key="col_index">
                        <p v-text="col"></p>
                    </td>
                </tr>
            </table>
        </main>
    </div>
</template>

<script>
    import sortArray from 'sort-array';
    
    export default {
        name: "List",
        props: ["gSheetId"],
        data() {
            return {
                original: [],
                onceFetched: [],
                listData: [],
                columnHeaders: [],
                searchFields: {},
                currentSortOrder_s: {}
            };
        },
        methods: {
            resetFilters() {
                this.onceFetched = [];
                this.fetchListData({})
            },
            
            sortBy(column) {
                let order = 'asc';
                
                if (column in this.currentSortOrder_s) {
                    switch (this.currentSortOrder_s[column]) {
                        case 'asc':
                            order = 'desc';
                            break;
                        case 'desc':
                            order = 'asc';
                            break;
                        default:
                            order = 'asc';
                            break;
                    }
                }
                
                this.currentSortOrder_s[column] = order;
                
                this.listData = sortArray(this.listData, {
                    by: column,
                    order: order,
                })
            },
            
            filterBy() {
                let filterObj = {};
                
                for (let i = 0; i < Object.keys(this.searchFields).length; i++) {
                    let tmpSearchField = this.searchFields[
                            Object.keys(this.searchFields)[i]
                            ];
                    filterObj[tmpSearchField.column] = tmpSearchField.model;
                }
                
                let checker = [];
                
                for (
                        let filterObj_i = 0;
                        filterObj_i < Object.keys(filterObj).length;
                        filterObj_i++
                ) {
                    if (filterObj[Object.keys(filterObj)[filterObj_i]] === "") {
                        checker.push(false);
                    }
                }
                
                if (checker.length === Object.keys(filterObj).length) {
                    this.resetFilters();
                } else {
                    this.fetchListData(filterObj);
                }
            },
            
            getColumnHeaders() {
                let tmp_header;
                let key_i;
                let row_i;
                
                for (row_i = 0; row_i < this.listData.length; row_i++) {
                    for (
                            key_i = 0;
                            key_i < Object.keys(this.listData[row_i]).length;
                            key_i++
                    ) {
                        tmp_header = Object.keys(this.listData[row_i])[key_i];
                        if (!this.columnHeaders.includes(tmp_header)) {
                            this.columnHeaders.push(tmp_header);
                            this.searchFields[tmp_header.replace(" ", "").toLowerCase()] = {
                                model: "",
                                column: tmp_header
                            };
                        }
                    }
                }
            },
            listDataLoader(results, filterObj) {
                if (Object.keys(filterObj).length > 0) {
                    let tmpResults = {};
                    
                    for (let results_i = 0; results_i < results.length; results_i++) {
                        let tmpResult = results[results_i];
                        for (
                                let filter_i = 0;
                                filter_i < Object.keys(filterObj).length;
                                filter_i++
                        ) {
                            let tmpFilter = {
                                title: Object.keys(filterObj)[filter_i],
                                filter: filterObj[Object.keys(filterObj)[filter_i]]
                            };
                            
                            if (Object.keys(tmpResult).includes(tmpFilter.title)) {
                                if (
                                        tmpResult[tmpFilter.title]
                                                .toLowerCase()
                                                .includes(tmpFilter.filter.toLowerCase())
                                ) {
                                    if (!Object.keys(tmpResults).includes(tmpFilter.title)) {
                                        tmpResults[tmpFilter.title] = [];
                                    }
                                    
                                    if (!tmpResults[tmpFilter.title].includes(tmpResult)) {
                                        tmpResults[tmpFilter.title].push(tmpResult);
                                    }
                                }
                            }
                        }
                    }
                    
                    let final = [];
                    
                    for (
                            let tmpResults_i = 0;
                            tmpResults_i < Object.keys(tmpResults).length;
                            tmpResults_i++
                    ) {
                        final.push(tmpResults[Object.keys(tmpResults)[tmpResults_i]]);
                    }
                    
                    this.listData = final.shift().filter(function(v) {
                        return final.every(function(a) {
                            return a.indexOf(v) !== -1;
                        });
                    });
                } else {
                    this.listData = results;
                }
                
                this.getColumnHeaders();
            },
            
            fetchListData(filterObj) {
                if (Object.keys(this.onceFetched).length === 0) {
                    const GSheetReader = require("g-sheets-api");
                    let readerOptions = {
                        sheetId: this.gSheetId,
                        returnAllResults: false
                    };
                    
                    GSheetReader(readerOptions, results => {
                        this.onceFetched = results;
                        this.listDataLoader(results, filterObj);
                    });
                } else {
                    this.listDataLoader(this.onceFetched, filterObj);
                }
            }
        },
        mounted() {
            this.fetchListData({});
        },
    };
</script>

<style scoped>
    body {
        max-height: 100vh;
        padding: 0;
        margin: 0;
    }
    
    main {
        width: 100%;
        height: 100%;
    }
    
    table {
        width: 100%;
        overflow: scroll;
    }
    
    table input {
        padding: 10px;
        font-size: 1.2em;
        border: 1px solid #eee;
        border-radius: 10px;
        width: 80%;
        box-shadow: none;
        outline: none;
    }
    
    td h2 {
        font-size: 1.3em;
        padding: 2px;
        border-radius: 10px;
        max-width: 50%;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        background-color: #eee;
        color: #444;
    }
    
    td p {
        font-size: 1.2em;
        color: #4f4f4f;
        padding: 5px;
    }
</style>

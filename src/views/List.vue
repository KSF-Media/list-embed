<template>
    <div>
        <main>
            <button @click="resetFilters()">Ladda om <font-awesome-icon icon="redo" /></button>
            <table>
                <tr>
                    <td v-for="(header, header_index) in columnHeaders" :key="header_index">
                        <h2 v-text="header.substring(0, 1).toUpperCase() +  header.substring(1, header.length)"></h2>
                        <button @click="sortBy(header)">Sortera a-ö (0-99)/ö-a (99-0)</button>
                        <div v-if="filterTypes[header].type === 'search'">
                            <input type="search" v-model="filterFields[header].model" placeholder="Sök..." @input="filterBy()"/>
                        </div>
                        <div v-else-if="filterTypes[header].type === 'category'">
                            <input type="search" :list="header.replace(' ', '') + '-list'" v-model="filterFields[header].model" placeholder="Sök..."  @input="filterBy()">
                            <datalist :id="header.replace(' ', '') + '-list'">
                                <div v-for="(value, value_index) in filterTypes[header].values" :key="value_index">
                                    <option :value="value"></option>
                                </div>
                            </datalist>
                        </div>
                        <div v-else-if="filterTypes[header].type === 'range'">
                            <p v-text="filterFields[header].model + ' - ' + filterFields[header].model2"></p>
                            <input value="0" type="range" :id="header.replace(' ', '') + '-range'" v-model="filterFields[header].model" placeholder="Minst" @input="filterBy()" :min="filterTypes[header].min" :max="filterTypes[header].max">
                            <input value="0" type="range" :id="header.replace(' ', '') + '-range2'" v-model="filterFields[header].model2" placeholder="Högst" @input="filterBy()" :min="filterTypes[header].min" :max="filterTypes[header].max">
                            <button @click="resetRange(header)"><font-awesome-icon icon="redo" /></button>
                        </div>
                    </td>
                </tr>
                <tbody>
                    <tr v-for="(row, row_index) in listData" :key="row_index">
                        <td v-for="(col, col_index) in row" :key="col_index">
                            <p v-text="col"></p>
                        </td>
                    </tr>
                </tbody>
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
                filterFields: {},
                currentSortOrder_s: {},
                filterTypes: {},
            };
        },
        methods: {
            resetRange(header) {
                document.querySelector('#' + header.replace(' ', '') + '-range').value = '';
                document.querySelector('#' + header.replace(' ', '') + '-range2').value = '';
                this.filterFields[header].model = '';
                this.filterFields[header].model2 = '';
                this.filterBy();
            },
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
                console.log(this.listData);
                
                this.listData = sortArray(this.listData, {
                    by: column,
                    order: order,
                })
            },
            
            filterBy() {
                let filterObj = {};
                
                for (let i = 0; i < Object.keys(this.filterFields).length; i++) {
                    let tmpSearchField = this.filterFields[
                            Object.keys(this.filterFields)[i]
                            ];
                    filterObj[tmpSearchField.column] = tmpSearchField.model;
                    if ('model2' in tmpSearchField) {
                        filterObj[tmpSearchField.column] = [tmpSearchField.model, tmpSearchField.model2];
                    }
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
            
            getColumnValues(column) {
                let column_values = [];
                
                for (let row_i = 0; row_i < this.listData.length; row_i++) {
                    let row = this.listData[row_i];
                    let column_value = row[column];
                    if (!column_values.includes(column_value)) {
                        column_values.push(column_value);
                    }
                }
                
                return column_values;
            },
            
            getFilterTypes() {
                let filterRow;
                
                for (let i = 0; i < this.listData.length; i++) {
                    if (i === 0) {
                        filterRow = this.listData[i];
                        break;
                    }
                }
                this.listData.splice(0, 1);
    
                for (let filter_i = 0; filter_i < Object.keys(filterRow).length; filter_i++) {
                    let forColumn = Object.keys(filterRow)[filter_i];
                    
                    let filterType = filterRow[forColumn];
                    this.filterTypes[forColumn] = {
                        type: filterType,
                    };
                    
                    if (filterType === 'category') {
                       this.filterTypes[forColumn]['values'] = this.getColumnValues(forColumn)
                    }
                    
                    if (filterType === 'range') {
                        const values = this.getColumnValues(forColumn);
                        this.filterTypes[forColumn]['max'] = Math.max(...values);
                        this.filterTypes[forColumn]['min'] = Math.min(...values);
                        this.filterFields[forColumn]['model2'] = ''
                    }
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
                            this.filterFields[tmp_header] = {
                                model: '',
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

                            if (Array.isArray(filterObj[Object.keys(filterObj)[filter_i]])) {
                                tmpFilter.filter = 'is_range';
                                tmpFilter['min'] = filterObj[Object.keys(filterObj)[filter_i]][0];
                                tmpFilter['max'] = filterObj[Object.keys(filterObj)[filter_i]][1];
                            }
                            
                            if (Object.keys(tmpResult).includes(tmpFilter.title)) {
                                if (tmpFilter.filter === 'is_range') {
                                    let min = tmpFilter.min;
                                    let max = tmpFilter.max;

                                    if (isFinite(tmpResult[tmpFilter.title])) {
                                        if (Number(tmpResult[tmpFilter.title]) >= min && tmpResult[tmpFilter.title] <= max) {
                                            if (!Object.keys(tmpResults).includes(tmpFilter.title)) {
                                                tmpResults[tmpFilter.title] = [];
                                            }

                                            if (!tmpResults[tmpFilter.title].includes(tmpResult)) {
                                                tmpResults[tmpFilter.title].push(tmpResult);
                                            }
                                        }
                                    }

                                } else {
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
                        this.getFilterTypes();
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
        font-size: 16px;
        line-height: 24px;
        color: #4f4f4f;
        padding: 5px;
    }

    tbody tr:nth-child(odd){
        background-color: #F3F1ED !important;
    }
    
    .search-area {
        visibility: hidden;
    }

    button {
        padding: 5px;
        border: 1px solid #1f1f1f;
        box-shadow: none;
        margin-top: 5px;
        margin-bottom: 5px;
    }
</style>

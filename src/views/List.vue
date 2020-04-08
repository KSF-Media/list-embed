<template>
    <div>
        <main>
            <button @click="resetFilters()"><font-awesome-icon icon="redo" /></button>
            <table aria-describedby="list data">
                <tr>
                    <th v-for="(header, header_index) in columnHeaders" :key="header_index">
                        <div class="th-data">
                            <h2 v-text="header.substring(0, 1).toUpperCase() +  header.substring(1, header.length)"></h2>
                            <div class="row mx-auto">
                                <div class="col-12" v-if="filterTypes[header].type === 'search'">
                                    <div class="row search-area">
                                        <input class="col-12" type="search" v-model="filterFields[header].model" placeholder="Sök..." @input="filterBy()"/>
                                    </div>
                                </div>
                                <div class="col-12" v-else-if="filterTypes[header].type === 'category'">
                                    <div class="row search-area">
                                        <input class="col-12" type="search" :list="header.replace(' ', '') + '-list'" v-model="filterFields[header].model" placeholder="Sök..."  @input="filterBy()">
                                        <datalist :id="header.replace(' ', '') + '-list'">
                                            <div v-for="(value, value_index) in filterTypes[header].values" :key="value_index">
                                                <option :value="value"></option>
                                            </div>
                                        </datalist>
                                    </div>
                                </div>
                                <div class="col-12 range-input-area" v-else-if="filterTypes[header].type === 'range'">
                                    <div class="row search-area">
                                        <input class="slider col-4" value="0" type="range" :id="header.replace(' ', '') + '-range'" v-model="filterFields[header].model" placeholder="Minst" @input="filterBy()" :min="filterTypes[header].min" :max="filterTypes[header].max">
                                        <p class="range-label col-4" v-text="getRangeLabel(filterFields[header])"></p>
                                        <input class="slider col-4" value="0" type="range" :id="header.replace(' ', '') + '-range2'" v-model="filterFields[header].model2" placeholder="Högst" @input="filterBy()" :min="filterTypes[header].min" :max="filterTypes[header].max">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <button @click="sortBy(header, 'asc')" :id="header.replace(' ', '') + '-asc-btn'"><font-awesome-icon icon="sort-alpha-down"/></button>
                                    <button v-if="filterTypes[header].type === 'range'" @click="resetRange(header)"><font-awesome-icon icon="redo" /></button>
                                    <button @click="sortBy(header, 'desc')" :id="header.replace(' ', '') + '-desc-btn'"><font-awesome-icon icon="sort-alpha-down-alt"/></button>
                                </div>
                            </div>
                        </div>
                    </th>
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
                filterTypes: {},
            };
        },
        methods: {
            getRangeLabel(filter) {
                let label = '';
                if (!filter.model) {
                    label = '0 - '
                } else {
                    label = filter.model + ' - '
                }

                if (!filter.model2) {
                    label += '0'
                } else {
                    label += filter.model2
                }

                return label

            },
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
            
            sortBy(column, order) {
                this.listData = sortArray(this.listData, {
                    by: column,
                    order: order,
                });

                const all_actives = document.getElementsByClassName('active-btn');

                for (let i = 0; i < all_actives.length; i++) {
                    let tmpBtn = all_actives[i];
                    tmpBtn.classList.toggle('active-btn');
                }

                document.querySelector('#' + column.replace(' ', '') + '-' + order + '-btn').classList.toggle('active-btn');
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
        padding: 5px;
        background-color: #f7f7f7;
    }
    
    table {
        width: 100%;
        overflow: scroll;
    }

    .th-data {
        text-align: center;
        width: 100%;
    }

    h2 {
        font-size: 1.2em !important;
        font-weight: bold !important;
        padding: 2px;
        border-radius: 10px;
        max-width: 50%;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        color: #444;
    }

    tbody tr:nth-child(odd){
        background-color: #F3F1ED !important;
    }

    td p {
        font-size: 16px;
        line-height: 20px;
        color: #4f4f4f;
        padding: 5px;
    }

    .search-area {
        width: 90%;
        margin-left: auto;
        margin-right: auto;
    }

    button {
        padding: 5px;
        border: 1px solid #ddd;
        box-shadow: none;
        margin: 5px;
        border-radius: 5px;
        background-color: #fff;
    }

    button * {
        font-size: 1em;
        color: #555;
        display: flex;
        align-items: center;
    }

    button:hover {
        background-color: #ddd;
        cursor: pointer;
    }

    .active-btn {
        background-color: #ddd;
    }

    input {
        padding: 5px;
        font-size: 1em;
        border: 1px solid #F3F1ED;
        border-radius: 5px;
        width: 100%;
        box-shadow: none;
        outline: none;
        height: 35px;
    }

    .slider {
        height: 19px;
        margin-top: 8px;
        margin-bottom: 8px;
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        background: #ddd;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 13px;
        width: 13px;
        border-radius: 50%;
        background: #444;
    }

    * {
        box-shadow: none !important;
        outline: none !important;
    }

    @media screen and (max-width: 600px) {
        table {
            padding: 10px;
        }

        .th-data {
            border-top: 2px solid #ddd;
            padding-top: 5px;
        }

        tr {
            border-bottom: 3px solid #ddd;
            display: block;
            margin-bottom: .625em;
            text-align: center;
        }

        td, th {
            border-bottom: 1px solid #F3F1ED;
            display: block;
        }

        td:last-child {
            border-bottom: 0;
        }
}
</style>

<template>
    <main>
        <div id="inner">
            <header>
            <h1>Embeddable List</h1>
            </header>

            <div id="form">
                <p>URL to a published Google spreadsheet</p>
                <input type="url" v-model="url">
                <button @click="generate()">OK</button>
            </div>

            <div id="result">
                <div v-if="done">
                    <code v-text="iframe" id="iframe-code"></code>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    export default {
        name: 'Generator',
        data() {
            return {
                url: '',
                done: false,
                iframe: ''
            }
        },
        methods: {
            generate() {
                if (this.url) {
                    const id = this.url.replace('https://docs.google.com/spreadsheets/d/', '').replace('/edit#gid=0', '');
                    this.iframe = '<iframe src="http://localhost:8080/list/' + id + '"></iframe>';

                    this.done = true;
                }
            },
        }
    }
</script>

<style scoped>
    code {
        font-family: monospace;
        font-size: 1em;
        background-color: #1f1f1f;
        color: #ddd;
        padding: 5px;
    }

    main {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
    }

    #inner {
        margin-left: auto;
        margin-right: auto;
        padding: 60px;
        background-color: #eee;
        border-radius: 10px;
    }

    header {
        width: 100%;
    }

    header h1 {
        margin-right: auto;
        margin-left: auto;
        text-align: center;
        font-weight: bold;
        color: #333;
        padding-left: 20px;
        padding-right: 20px;
    }

    #form {
        padding: 10px;
        padding-top: 60px;
        padding-bottom: 80px;
        margin-top: 20px;
        border-radius: 10px;
        text-align: center;
    }

    #form p {
        color: #444;
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    }

    #form input {
        width: 90%;
        padding: 8px;
        border-radius: 5px;
        outline: none;
        box-shadow: none;
        border: 1px solid #ddd;
        color: #333;
    }

    #form button {
        margin-top: 10px;
        margin-bottom: 10px;
        width: 90%;
        padding: 8px;
        background-color: #2f2f2f;
        color: #eee;
        margin-left: auto;
        margin-right: auto;
        box-shadow: none !important;
        outline: none;
    }

    @media screen and (max-width: 450px) {
        main {
            display: block;
        }

        #inner {
            height: 100%;
            width: 100%;
        }
    }
</style>
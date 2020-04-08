<template>
    <div id="help">
        <h1>Help</h1>
        <div class="guide">
            <h2>How to setup your Google Spreadsheet</h2>
            <ul>
                <li>1. Publishing your spreadsheet to the web</li>
                <li class="li-under-1">Click on "File" and select "Publish to the web".</li>
                <li class="li-under-1 li-under-1-img"><img src="../assets/guide1.png" alt="Step 1"></li>
                <li class="li-under-1">Click on "Publish".</li>
                <li class="li-under-1 li-under-1-img"><img src="../assets/guide2.png" alt="Step 2"></li>
                <li class="li-under-1">Click on "OK" in the browser pop-up.</li>
                <li class="li-under-1">Close the publish to the web modal.</li>
                <li>2. Getting the embedding code</li>
                <li class="li-under-1">Copy your spreadsheet's url from the address bar.</li>
                <li class="li-under-1 li-under-1-img"><img src="../assets/guide3.png" alt="Step 3"></li>
                <li class="li-under-1">Go to the list-embed page <a href="https://list-embed.netlify.com" target="_blank" rel="noopener noreferrer">here</a>, and paste in the url</li>
                <li class="li-under-1">Click on "OK" and copy the embedding code.</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Help',
    }
</script>

<style scoped>
    #help {
        padding: 50px;
    }

    h2 {
        width: 100%;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom: 3px solid #bbb;
    }

    .guide {
        padding: 30px;
        background-color: #F3F1ED;
    }

    .guide ul li {
        padding: 5px;
        font-size: 1.5em;
    }

    .guide ul li:not(.li-under-1) {
        font-size: 1.7em;
        font-weight: bold;
        list-style-type: square;
        border-bottom: 1px solid #bbb;
        margin-top: 10px;
    }

    .li-under-1 {
        margin-left: 30px;
    }

    .li-under-1-img {
        list-style-type: none;
    }

    .li-under-1-img img {
        max-width: 450px;
    }

    @media screen and (max-width: 760px) {
        #help {
            padding: 10px;
        }

        h2 {
            font-size: 1.6em;
        }

        .guide {
            padding: 10px;
        }

        .guide ul li {
            font-size: 1em;
        }

        .li-under-1-img img {
            max-width: 250px;
        }

        .li-under-1 {
            margin-left: 10px;
        }
    }

    @media screen and (max-width: 500px) {
        #help {
            padding: 2px;
        }

        .guide {
            padding: 2px;
        }
    }
</style>
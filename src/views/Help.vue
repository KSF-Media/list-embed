<template>
    <div id="help">
        <h1>Help</h1>
        <div class="guide">
            <h2>How to setup a Google Spreadsheet for use with the embeddable list</h2>
            <ul>
                <li>1. Setting up the spreadsheet</li>
                <li class="li-under-1">Put your column headers on the first row.</li>
                <li class="li-under-1">Configure filtering on the second row. The available filter types are: <em>category</em>, <em>search</em>, and <em>range.</em>. You can also leave the cell blank for no filtering.</li>
                <li class="li-under-1 li-under-1-info">
                    <h3>Different filtering options:</h3>
                    <h4>- Search</h4>
                    <p>A simple search box that matches exact text.</p>
                    <h4>- Category</h4>
                    <p>Picks out all cells in the column and put's them in a (searchable) drop-down.</p>
                    <h4>- Range</h4>
                    <p>Two sliders that go from the lowest to the highest number in the column's cells.</p>
                    <p>Shows all cells with numbers between (and matching) the slider's values.</p>
                </li>
                <li class="li-under-1">Example:</li>
                <li class="li-under-1 li-under-1-img"><img src="../assets/guide1.png" alt="Step 1"></li>
                <li>2. Publishing your spreadsheet to the web</li>
                <li class=" li-under-1">Click on "File" and select "Publish to the web".</li>
                <li class="li-under-1 li-under-1-img"><img src="../assets/guide2.png" alt="Step 2"></li>
                <li class="li-under-1">Click on "Publish".</li>
                <li class="li-under-1 li-under-1-img"><img src="../assets/guide3.png" alt="Step 3"></li>
                <li class="li-under-1">Click "OK" in the browser pop-up.</li>
                <li>3. Getting the embedding code</li>
                <li class="li-under-1">Copy the spreadsheet's url from the address bar.</li>
                <li class="li-under-1 li-under-1-img"><img src="../assets/guide4.png" alt="Step 4"></li>
                <li class="li-under-1">Go to the <a href="https://list-embed.netlify.com" target="_blank" rel="noopener noreferrer">list-embed page</a>, and paste in the url</li>
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

    .li-under-1-img, .li-under-1-info {
        list-style-type: none;
    }

    .li-under-1-img img {
        max-width: 450px;
    }

    .li-under-1-info {
        background-color: var(--info);
        border-radius: 10px;
        color: #fff;
        padding: 20px !important;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .li-under-1-info p {
        margin-left: 15px;
    }

    .li-under-1-info h3 {
        color: #1f1f1f;
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
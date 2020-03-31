# list-embed
An Embeddable list/table with sorting and filtering. Uses Google Spreadsheets as the data source.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


# Google Sheets Setup
- Headers on the first row
- Filter types on the second row.
  - You can use the filter types, `search`, `category`, and `range`, you can also leave it empty for no filter.
- The spreadsheet should look something like this:

| Header 1 | Header 2 | Header 3 | Header 4 |
|----------|----------|----------|----------|
| search   | category |          | range    |
| ..       | ..       | ..       | ..       |

- Publish your spreadsheet to the web.
- Copy the url from your address bar and get the id from the url.
  - Ex. `https://docs.google.com/spreadsheets/d/`[the id goes here]`/edit#gid=0`
- The id is used in the url to this app like this:
  - `https://[url]/list/[the spreadsheet id]`
spendesk-utils
==========

Technical test for spendesk - extract a valid VAT number from a PDF file

Installation
------------
```
npm install
```

Usage
-----

### Simple command line client ###
```javascript
node index.js PARSABLE_PDF_FILE <COMMA_SEPARATED_EXCLUDED_VAT_NUMBERS>
```
### Launching Web app ###
```javascript
node server.js
```

Then open [http://localhost:3000](http://localhost:3000)

### Running the tests ###

It's easy, just run `npm test`. The tests are written in BDD style, so they are a good starting
point to understand the code. Mocha is required though (`sudo npm install mocha -g`)


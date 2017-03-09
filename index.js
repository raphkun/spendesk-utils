var Spendesk = require('./spendeskutils.js');

var excludedVATNumbers = [];

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " PDF_FILE <COMMA_SEPARATED_EXCLUDED_VAT_NUMBERS>");
    process.exit(-1);
}

if (process.argv[3]) {
    excludedVATNumbers = process.argv[3].split(',');
}
excludedVATNumbers.push('FR10821893286'); // by default, excludes Spendesk's VAT number

Spendesk.extractVATFromPDF(process.argv[2], excludedVATNumbers)
    .then(function (result) {
        console.log(result);
    })
    .fail(function (error) {
        console.log(error);
    })
;
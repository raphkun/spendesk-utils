var Q = require('q'),
    PdfReader = require('pdfreader').PdfReader,
    jsVAT = require('jsvat');

module.exports = {
    extractVATFromPDF: function (pdfFilePath, excludedVATNumbers, callback) {
        //var outputFilename = pdfFilePath.replace(/^.*[\\\/]/, '');//.replace(/\.[^/.]+$/, "");
        //console.log(outputFilename);
        var deferred = Q.defer();
        var lastValidVATNumber = null; // holds the last valid VAT number

        if (typeof pdfFilePath !== 'string' || pdfFilePath.trim() === '') {
            deferred.reject("input pdfWithMultipleVATNumbers is not a string or is empty");
        }

        new PdfReader().parseFileItems(pdfFilePath, function (err, item) {
            if (err) {
                deferred.reject(err);
            }
            else if (!item) {
                // TODO: if lastValidVATNumber is still null, try to OCRed PDF pdfWithMultipleVATNumbers (eg: using http://tesseract.projectnaptha.com/)
                deferred.resolve(lastValidVATNumber);
            }
            else if (item.text) {
                var token = item.text.replace(/\s/g, '');
                if (token.length >= 2) { // at least, must detect ISO Alpha-2 code
                    // (slightly modified) regular expression from http://bit.ly/1MnZelQ
                    var regex = /((AT)U[0-9]{8}|(BE)0[0-9]{9}|(BG)[0-9]{9,10}|(CY)[0-9]{8}L|(CZ)[0-9]{8,10}|(DE)[0-9]{9}|(DK)[0-9]{8}|(EE)[0-9]{9}|(EL|GR)[0-9]{9}|(ES)[0-9A-Z][0-9]{7}[0-9A-Z]|(FI)[0-9]{8}|(FR)[0-9A-Z]{2}[0-9]{9}|(GB)([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})|(HU)[0-9]{8}|(IE)[0-9]S[0-9]{5}L|(IT)[0-9]{11}|(LT)([0-9]{9}|[0-9]{12})|(LU)[0-9]{8}|(LV)[0-9]{11}|(MT)[0-9]{8}|(NL)[0-9]{9}B[0-9]{2}|(PL)[0-9]{10}|(PT)[0-9]{9}|(RO)[0-9]{2,10}|(SE)[0-9]{12}|(SI)[0-9]{8}|(SK)[0-9]{10})/gi;
                    var match = regex.exec(token);
                    if (match !== null) {
                        var validVATNumber = jsVAT.checkVAT(match[0]);
                        if (validVATNumber.isValid) {
                            if (excludedVATNumbers && excludedVATNumbers.length) {
                                if (!excludedVATNumbers.includes(validVATNumber.value)) {
                                    lastValidVATNumber = validVATNumber.value;
                                }
                            } else {
                                lastValidVATNumber = validVATNumber.value;
                            }
                        }
                    }
                }
            }
        });

        deferred.promise.nodeify(callback);
        return deferred.promise;
    }
};
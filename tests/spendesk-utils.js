var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var chaiAsPromised = require("chai-as-promised");
var Spendesk = require('../spendeskutils');

chai.use(chaiAsPromised);

var excludedVATNumbers = ['FR10821893286'];
var invalidPDF = './toto.pdf';
var unparsablePDF = './tests/invoices/empty.pdf';
var PDFWithMultipleVATNumbers = './tests/invoices/multipleVATNumbers.pdf';

describe('Spendesk utils', function () {
    it('extractVATFromPDF(InvalidPDFFile, emptyExcludedVATNumbers) should thrown an object error', function (done) {
        Spendesk.extractVATFromPDF(invalidPDF, []).fail(function(error) {
            //console.log(error);
            expect(error).to.be.an('object');
            done();
        });
    });

    it('extractVATFromPDF(unparsablePDF, emptyExcludedVATNumbers) should return a null value', function (done) {
        Spendesk.extractVATFromPDF(unparsablePDF, []).then(function(VATNumber) {
            expect(VATNumber).to.be.null;
            done();
        });
    });

    it('extractVATFromPDF(validPDFFileWithVATNumbers, emptyExcludedVATNumbers) should return a string', function (done) {
        Spendesk.extractVATFromPDF(PDFWithMultipleVATNumbers, []).then(function(VATNumber) {
            //console.log(VATNumber);
            expect(VATNumber).to.be.a('string');
            done();
        });
    });

    it('extractVATFromPDF(validPDFFileWithVATNumbers, ourOwnVATNumbers) should return a string not contained in ourOwnVATNumbers', function (done) {
        Spendesk.extractVATFromPDF(PDFWithMultipleVATNumbers, excludedVATNumbers).then(function(VATNumber) {
            expect(VATNumber).to.not.equal(excludedVATNumbers[0]);
            done();
        });
    });

    it('TODO: extractVATFromPDF(containExcludedVATNumber, ourOwnVATNumbers) should return a null value', function (done) {
        expect(true).to.be.true;
        done();
    });
});
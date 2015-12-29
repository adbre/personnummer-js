'use strict';

var Personnummer = require('../src/Personnummer');

function toDate(year, month, day) {
    return new Date(year, month - 1, day);
}

describe("Personnummer", function () {
    it("Should validate a personnummer", function () {
        expect(Personnummer.isValid("640823-3234")).toBe(true);
    });

    it("Should validate personnummer without separator", function () {
        expect(Personnummer.isValid("6408833231")).toBe(true);
    });

    it("Should validate personnummer with century", function () {
        expect(Personnummer.isValid("19640883-3231")).toBe(true);
    });

    it("Should validate a personnumer with plus sign as separator", function () {
        expect(Personnummer.isValid("640823+3234")).toBe(true);
    });

    it("Should validate co-ordination number", function () {
        // From SKV 717B
        // http://www.skatteverket.se/privat/sjalvservice/blanketterbroschyrer/broschyrer/info/717b.4.39f16f103821c58f680008017.html
        //
        // "A co-ordination number, like a personal identity
        // number, consists of ten digits. The first six
        // digits are based on the person's date of birth
        // with the difference that the number 60 is added to
        // the date of birth. For a person who is born on 23
        // August 1964, the first six digits in the
        // co-ordination number become 640883."
        //
        expect(Personnummer.isValid("640883-3231")).toBe(true);
    });

    it("Should invalidate a empty string", function () {
        expect(Personnummer.isValid("")).toBe(false);
    });

    it("Should invalidate a invalid personnummer", function () {
        expect(Personnummer.isValid("112233-4455")).toBe(false);
    });

    it("Should validate personnummer with century and without separator", function() {
        expect(Personnummer.isValid("196408233234")).toBe(true);
    });

    describe("constructor", function () {
        it("Should create a new instance of Personnummer", function () {
            var personnummer = new Personnummer("19640883+3231");
            expect(personnummer.century).toEqual("19");
            expect(personnummer.year).toEqual("64");
            expect(personnummer.month).toEqual("08");
            expect(personnummer.day).toEqual("83");
            expect(personnummer.separator).toEqual("+");
            expect(personnummer.number).toEqual("323");
            expect(personnummer.checksum).toEqual("1");
        });
        it("Should throw on invalid personnummer", function () {
            expect(function () {
                new Personnummer("640883-323");
            }).toThrow(new Error("Invalid personnummer: 640883-323"));
        });
    });

    describe("parse", function () {
        it("Should create a new instance of Personnummer", function () {
            var personnummer = Personnummer.parse("19640883+3231");
            expect(personnummer.century).toEqual("19");
            expect(personnummer.year).toEqual("64");
            expect(personnummer.month).toEqual("08");
            expect(personnummer.day).toEqual("83");
            expect(personnummer.separator).toEqual("+");
            expect(personnummer.number).toEqual("323");
            expect(personnummer.checksum).toEqual("1");
        });
        it("Should throw on invalid personnummer", function () {
            expect(function () {
                Personnummer.parse("640883-323");
            }).toThrow(new Error("Invalid personnummer: 640883-323"));
        });
    });

    describe("format", function () {
        it("should return a traditional formatted personnummer", function () {
            expect((new Personnummer("19640883-3231")).format(Personnummer.FORMAT_TRADITIONAL)).toEqual("640883-3231");
        });
        it("should return a traditional formatted personnummer", function () {
            expect((new Personnummer("19640883-3231")).format(Personnummer.FORMAT_MODERN)).toEqual("196408833231");
        });
        it("should return correct century", function () {
            expect((new Personnummer("640883-3231")).format(Personnummer.FORMAT_MODERN)).toEqual("196408833231");
        });
        it("should expand 'yyyy' to full year", function () {
            expect((new Personnummer("640883-3231")).format("yyyy")).toEqual("1964");
        });
        it("should expand 'yy' to year without century", function () {
            expect((new Personnummer("640883-3231")).format("yy")).toEqual("64");
        });
        it("should expand 'mm' to month", function () {
            expect((new Personnummer("640883-3231")).format("mm")).toEqual("08");
        });
        it("should expand 'dd' to day", function () {
            expect((new Personnummer("640883-3231")).format("dd")).toEqual("83");
        });
        it("should expand '-' to separator", function () {
            expect((new Personnummer("640883+3231")).format("-")).toEqual("+");
        });
        it("should expand 'nnn' to numbers", function () {
            expect((new Personnummer("640883+3231")).format("nnn")).toEqual("323");
        });
        it("should expand 'x' to checksum", function () {
            expect((new Personnummer("640883+3231")).format("x")).toEqual("1");
        });
        it("should escape characters with backslash 'nnn' to numbers", function () {
            expect((new Personnummer("640883+3231")).format('yyyy\\-mm\\-dd')).toEqual("1864-08-83");
        });
    });

    describe("toString", function () {
        it("should return a traditional formatted personnummer", function () {
            expect((new Personnummer("19640883-3231")).toString()).toEqual("640883-3231");
        });
        it("should return a traditional formatted personnummer", function () {
            expect((new Personnummer("19640883-3231")).toString(Personnummer.FORMAT_TRADITIONAL)).toEqual("640883-3231");
        });
        it("should return a traditional formatted personnummer", function () {
            expect((new Personnummer("19640883-3231")).toString(Personnummer.FORMAT_MODERN)).toEqual("196408833231");
        });
        it("should return correct century", function () {
            expect((new Personnummer("640883-3231")).toString(Personnummer.FORMAT_MODERN)).toEqual("196408833231");
        });
    });

    describe("toTraditionalString", function () {
        it("should return a traditional formatted personnummer", function () {
            expect((new Personnummer("19640883-3231")).toTraditionalString()).toEqual("640883-3231");
        });
    });

    describe("toModernString", function () {
        it("should return a modern formatted personnummer", function () {
            expect((new Personnummer("19640883-3231")).toModernString()).toEqual("196408833231");
        });
    });

    describe("format", function () {
        it("should return a traditional formatted personnummer by default", function () {
            expect(Personnummer.format("19640883-3231")).toEqual("640883-3231");
        });
        it("should return a traditional formatted personnummer", function () {
            expect(Personnummer.format("19640883-3231", Personnummer.FORMAT_TRADITIONAL)).toEqual("640883-3231");
        });
        it("should return a traditional formatted personnummer", function () {
            expect(Personnummer.format("19640883-3231", Personnummer.FORMAT_MODERN)).toEqual("196408833231");
        });
    });

    describe("getDateOfBirth should return personnummer as date", function () {
        it("When given a traditional personnummer", function () {
            expect(Personnummer.getDateOfBirth("640823-3234")).toEqual(toDate(1964, 8, 23));
        });
        it("When given a coordination number with century", function () {
            expect(Personnummer.getDateOfBirth("19640883-3231")).toEqual(toDate(1964, 8, 23));
        });
        it("When given a coordination number with century and incorrect separator", function () {
            expect(Personnummer.getDateOfBirth("19640883+3231")).toEqual(toDate(1964, 8, 23));
        });
        it("When given a modern personnummer", function () {
            expect(Personnummer.getDateOfBirth("196408833231")).toEqual(toDate(1964, 8, 23));
        });
        it("When given a traditional personnummer born in the previous century", function () {
            expect(Personnummer.getDateOfBirth("640823+3234")).toEqual(toDate(1864, 8, 23));
        });
        it("When given a coordination number", function () {
            expect(Personnummer.getDateOfBirth("640883-3231")).toEqual(toDate(1964, 8, 23));
        });
        it("When given a personnummer born very recently", function () {
            expect(Personnummer.getDateOfBirth("1006238362")).toEqual(toDate(2010, 6, 23));
        });
    });

    describe("getAge", function () {
        beforeEach(function () {
            Personnummer.mockDate(toDate(2015, 6, 23));
        });

        afterEach(function () {
            Personnummer.mockDate(false);
        });

        it("should return age in years", function () {
            expect((new Personnummer("100623-8362")).getAge()).toEqual(5);
        });
        it("should return only full years", function () {
            Personnummer.mockDate(toDate(2015, 6, 22));
            expect((new Personnummer("100623-8362")).getAge()).toEqual(4);
        });
        it("should return age for coordination number", function () {
            expect((new Personnummer("640883-3231")).getAge()).toEqual(50);
        });
        it("should calculate age with given date", function () {
            expect((new Personnummer("100623-8362")).getAge(toDate(2016, 6, 23))).toEqual(6);
        });
    });
});

'use strict';

var moment = require('moment');
  
var COORDINATION_NUMBER_OFFSET = 60;
var FORMAT_TRADITIONAL = "yymmdd-nnnx";
var FORMAT_MODERN = "yyyymmddnnnx";

var mockDate = null;

function mod10(number) {
    var total = 0;
    for (var i = 0; i < number.length; i++) {
        var num = ((i % 2 === 0) ? (2 * number[i]) : number[i]).toString();
        for (var j = 0; j < num.length; j++) {
            total += parseInt(num[j], 10);
        }
    }

    return total % 10 === 0;
}

function tryParse(data) {
    var regex = /^(([0-9]{2})?([0-9]{2}))([0-9]{2})([0-9]{2})(-|\+)?([0-9]{3})([0-9])$/,
        match = regex.exec(data);

    if (!match) {
        return false;
    }

    this.personnummer = data;
    this.century = match[2];
    this.year = match[3];
    this.month = match[4];
    this.day = match[5];
    this.separator = match[6];
    this.number = match[7];
    this.checksum = match[8];

    if (!mod10([this.year, this.month, this.day, this.number, this.checksum].join(""))) {
        return false;
    }

    return true;
}

function getNow() {
    if (mockDate instanceof Date) {
        return mockDate;
    }

    return new Date();
}

function diffYears(dateA, dateB) {
    return Math.floor(moment(dateA).diff(dateB, "years"));
}

var Personnummer = function Personnummer (data) {
    var self = this;

    self.personnummer = undefined;
    self.century = undefined;
    self.year = undefined;
    self.month = undefined;
    self.day = undefined;
    self.separator = undefined;
    self.number = undefined;
    self.checksum = undefined;

    self.getDateOfBirth = function () {
        var year = parseInt(self.year, 10),
            month = parseInt(self.month, 10) - 1,
            day = parseInt(self.day, 10),
            now = getNow();

        if (day > COORDINATION_NUMBER_OFFSET) {
            day -= COORDINATION_NUMBER_OFFSET;
        }

        if (self.century) {
            year += parseInt(self.century, 10) * 100;
        } else {
            year += Math.floor(now.getFullYear() / 100) * 100;
            if (new Date(year, month, day) >= now) {
                year -= 100;
            }

            if (self.separator === "+") {
                year -= 100;
            }
        }

        return new Date(year, month, day);
    };

    self.format = function (format) {
        if (!format) {
            format = FORMAT_TRADITIONAL;
        }

        var dateOfBirth = self.getDateOfBirth(),
            formatSpecifiers = {
                'yyyy': dateOfBirth.getFullYear(),
                'yy': self.year,
                'mm': self.month,
                'dd': self.day,
                '-': self.separator,
                'nnn': self.number,
                'x': self.checksum
            },
            result = '';

        for (var i=0; i < format.length; i++) {
            var c = format[i];

            if (c === "\\" && i + 1 < format.length) {
                i++;
                result += format[i];
                continue;
            }

            for (var specifier in formatSpecifiers) {
                if (formatSpecifiers.hasOwnProperty(specifier)) {
                    if (i + specifier.length - 1 < format.length && format.substr(i, specifier.length) === specifier) {
                        i += specifier.length - 1;
                        result += formatSpecifiers[specifier];
                        break;
                    }
                }
            }
        }

        return result;
    };

    self.toString = function (format) {
        return self.format(format);
    };

    self.toModernString = function () {
        return self.toString(FORMAT_MODERN);
    };

    self.toTraditionalString = function () {
        return self.toString(FORMAT_TRADITIONAL);
    };

    self.getAge = function (now) {
        if (!(now instanceof Date)) {
            now = getNow();
        }

        return diffYears(now, self.getDateOfBirth());
    };

    if (typeof data !== "undefined") {
        if (!tryParse.call(self, data)) {
            throw new Error("Invalid personnummer: " + data);
        }
    }
};

Personnummer.FORMAT_MODERN = FORMAT_MODERN;
Personnummer.FORMAT_TRADITIONAL = FORMAT_TRADITIONAL;
Personnummer.COORDINATION_NUMBER_OFFSET = COORDINATION_NUMBER_OFFSET;

Personnummer.parse = function (data) {
    return new Personnummer(data);
};

Personnummer.tryParse = function (data) {
    var personnummer = new Personnummer();
    if (!tryParse.call(personnummer, data)) {
        return false;
    }

    return personnummer;
};

Personnummer.isValid = function (data) {
    return !!Personnummer.tryParse(data);
};

Personnummer.getDateOfBirth = function (data) {
    return (new Personnummer(data)).getDateOfBirth();
};

Personnummer.format = function (data, format) {
    return (new Personnummer(data)).toString(format);
};

Personnummer.getAge = function (data, now) {
    return (new Personnummer(data)).getAge(now);
};

Personnummer.mockDate = function (date) {
    mockDate = date;
};

module.exports = Personnummer;

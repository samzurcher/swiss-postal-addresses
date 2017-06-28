var csv = require("fast-csv");
var _ = require('lodash');
var iconv = require('iconv-lite');
var fs = require("fs");

// Data structures containing the data read from the csv input file before
// they are written again.
var states = {};
var cities = {};
var zipCodes = {};
var cityToStrIds = {};
var streets = {};
var houseNumbers = {};

// Input is in latin1; convert to UTF8
var inputStream = fs.createReadStream("input.csv", {encoding: "latin1"})
    .pipe(iconv.encodeStream('utf8'));

var outputStream = fs.createWriteStream('swiss-addresses.csv');
outputStream.on('finish', function() {
    console.log("Finished writing...");
});
outputStream.on('error', function(error) {
    console.log("An error occurred while writing:");
    console.log(error);
});

csv
    .fromStream(inputStream, {delimiter: ';'})
    .on("data", function(data){
        var  type = data[0];
        if (type === '01') {
            var onrp = data[1];
            states[onrp] = data[9];
            cities[onrp] = data[7];
            zipCodes[onrp] = data[4];
            cityToStrIds[onrp] = [];
        } else if (type === '04') {
            var cityOnrp = data[2];
            var strId = data[1];
            var streetName = data[6];
            cityToStrIds[cityOnrp].push(strId);
            streets[strId] = streetName;
            houseNumbers[strId] = [];
        } else if (type === '06') {
            var strId = data[2];
            var houseNumber = data[3];
            var houseNumberAlpha = data[4];
            var value = houseNumber;
            if (!_.isNull(houseNumberAlpha)) {
                value += houseNumberAlpha;
            }
            houseNumbers[strId].push(value);
        }
    })
    .on("end", function(){
        console.log("Finished reading input file...");
        console.log("Starting to write to output file...");

        var onrps = _.sortBy(_.keys(cities), function(onrp){return zipCodes[onrp];});
        _.forEach(onrps, function(onrp){
            var state = states[onrp];
            var city = cities[onrp];
            var zipCode = zipCodes[onrp];
            var streetIds = _.sortBy(cityToStrIds[onrp], function(strId){return streets[strId];});
            _.forEach(streetIds, function(strId) {
                var street = streets[strId];
                var numbers = houseNumbers[strId];

                // Handle streets without street numbers.
                if (_.isUndefined(numbers)) {
                    outputStream.write(state + ";" + zipCode + ";" + city + ";" + street + ";" + "\n");
                } else {
                    numbers = _.sortBy(numbers);
                    _.forEach(numbers, function(houseNumber){
                        outputStream.write(state + ";" + zipCode + ";" + city +
                                      ";" + street + ";" +  houseNumber + "\n");
                    });
                }
            });
        });
        outputStream.end();
    });

const express = require('express');
const router = express.Router();
const fs = require('fs');
const convert = require('xml-js');
const _ = require('lodash');
const defaultEmail = 'Gajerarubin@gmail.com';
router.post('/:xml/:givenXml', (req, res) => {
    fs.readFile(__dirname + '/' + req.params.givenXml, 'utf8', function (err, data) {
        let json = '';
        data.toString().split('\n').forEach((line) => {
            if (!line.includes('/*')) {
                json += line.toString()
                    .replace("\r\n", "")
                    .replace("\r", "")
                    .replace("\n", "");
            }
        })
        json = JSON.parse(json);
        getXML(json, req, res);
    });
})
router.post('/:xml/myJson/:givenXml', (req, res) => {
    getXML(req.body, req, res);
})

function replaceValue(object, keyToBeReplace, value, attr) {
    Object.keys(object)
        .forEach(key => {
            if (typeof object[key] === "object") {
                key === keyToBeReplace ? object[key][attr] = value === '' ? object[key][attr] : value : replaceValue(object[key], keyToBeReplace, value, attr);
            }
            return key
        })
    return object;
}

function appendJson(object, keyToBeReplace, value, attr) {
    Object.keys(object)
        .forEach(key => {
            if (typeof object[key] === "object") {
                if (key === keyToBeReplace) {
                    let data = [];
                    value.forEach((i) => {
                        if (typeof i === 'object') {
                            data.push(i)
                        } else {
                            data.push({[attr]: i})
                        }
                    });
                    console.log(data)
                    object[key] = data;
                } else {
                    appendJson(object[key], keyToBeReplace, value, attr);
                }
            }
            return key
        })
    return object;
}

function getXML(json, req, res) {
    fs.readFile(__dirname + '/../jsonFiles/' + req.params.xml + '.json', 'utf8', function (err, data) {
        if (err) throw err;
        let options = {compact: true, ignoreComment: true, spaces: 4};
        let serverJSON = JSON.parse(data);
        Object.keys(json[req.params.xml]).forEach((key) => {
            if (typeof json[req.params.xml][key] === 'object') {
                appendJson(serverJSON, key, json[req.params.xml][key], '_text');
            } else {
                serverJSON = replaceValue(serverJSON, key, json[req.params.xml][key], '_text');
            }
        });
        let result = convert.json2xml(serverJSON, options);
        res.send(result);
    });
}

module.exports = router;

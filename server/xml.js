const express = require('express');
const router = express.Router();
const fs = require('fs');
const convert = require('xml-js');
const _ = require('lodash');
const defaultEmail = require('../config').email;


// For email


// Display XML from upload file
router.post('/getemailxml', (req, res) => {
    fs.readFile(__dirname + '/scanToEmail.json', 'utf8', function (err, data) {
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
        const objectName = Object.keys(json)[0];
        if(json[Object.keys(json)[0]]['Destination'] === defaultEmail) {
            fs.readFile(__dirname + '/../jsonFiles/email-button.json', 'utf8', function (err, data) {
                if (err) {
                    res.send("Faild to scan the file");
                }
                let serverJSON = convert.json2xml(JSON.parse(data), {compact: true, spaces: 4});
                serverJSON = serverJSON.toString().replace('</UiScreen>\n' +
                    '<UiScreen>\n', "")
                let finalJson = {
                    "_declaration": {
                        "_attributes": {
                            "version": "1.0",
                            "encoding": "utf-8"
                        }
                    },
                    "SerioCommands": {
                        "_attributes": {
                            "version": "1.2"
                        },
                        "DisplayForm": {
                            "Script": {"_cdata": serverJSON}
                        }
                    }
                }
                res.send(convert.json2xml(finalJson, {compact: true, spaces: 4, cdataKey: '_cdata'}));
            });
        } else {
            fs.readFile(__dirname + '/../jsonFiles/button.json', 'utf8', function (err, data) {
                if (err) {
                    res.send("Faild to scan the file");
                }
                let serverJSON = convert.json2xml(JSON.parse(data), {compact: true, spaces: 4});
                serverJSON = serverJSON.toString().replace('</UiScreen>\n' +
                    '<UiScreen>\n', "")
                let finalJson = {
                    "_declaration": {
                        "_attributes": {
                            "version": "1.0",
                            "encoding": "utf-8"
                        }
                    },
                    "SerioCommands": {
                        "_attributes": {
                            "version": "1.2"
                        },
                        "DisplayForm": {
                            "Script": {"_cdata": serverJSON}
                        }
                    }
                }
                res.send(convert.json2xml(finalJson, {compact: true, spaces: 4, cdataKey: '_cdata'}));
            });
        }
        // req.params.xml = objectName;
        // getXMLForEmail(json, req, res);
    });
})
function getXMLForEmail(json, req, res, attr = '_text', send = true) {
    fs.readFile(__dirname + '/../jsonFiles/ScanToEmail.json', 'utf8', function (err, data) {
        if (err) throw err;
        let options = {compact: true, ignoreComment: true, spaces: 4};
        let serverJSON = JSON.parse(data);
            json[req.params.xml] && Object.keys(json[req.params.xml]).forEach((key) => {
                if (typeof json[req.params.xml][key] === 'object') {
                    appendJson(serverJSON, key, json[req.params.xml][key], attr);
                } else {
                    serverJSON = replaceValue(serverJSON, key, json[req.params.xml][key], attr);
                }
            });
        let result = convert.json2xml(serverJSON, options);
        res.send(result);
    });
}
// router.post('/getJson', (req, res) => {
//     res.send(convert.xml2json('<?xml version="1.0" encoding="utf-8"?>\n' +
//         '<SerioCommands version="1.2">\n' +
//         '    <DisplayForm>\n' +
//         '        <Script>\n' +
//         '            <![CDATA[<UiScreen><Operations><Op action="../xml/ScanToEmail" type="Submit"/><Op action="../xml/displayScreen/email-button" type="Submit"/>\n' +
//         '    </Operations></UiScreen>]]>\n' +
//         '    </Script>\n' +
//         '</DisplayForm>\n' +
//         '</SerioCommands>', {compact: true, spaces: 4}));
// })

// Display XML from json file
router.post('/displayScreen/:xmlFile', (req, res) => {
    fs.readFile(__dirname + '/../jsonFiles/' + req.params.xmlFile, 'utf8', function (err, data) {
        if (err) {
            res.send("Faild to scan the file");
        }
        let serverJSON = convert.json2xml(JSON.parse(data), {compact: true, spaces: 4});
        serverJSON = serverJSON.toString().replace('</UiScreen>\n' +
            '<UiScreen>\n', "")
        let finalJson = {
            "_declaration": {
                "_attributes": {
                    "version": "1.0",
                    "encoding": "utf-8"
                }
            },
            "SerioCommands": {
                "_attributes": {
                    "version": "1.2"
                },
                "DisplayForm": {
                    "Script": {"_cdata": serverJSON}
                }
            }
        }
        res.send(convert.json2xml(finalJson, {compact: true, spaces: 4, cdataKey: '_cdata'}));
    });
})

// Display XML from json file
router.post('/displayScreen/:xmlFile/:cdata', (req, res) => {
    const serverFiles = '/../jsonFiles/';
    if(req.params.cdata === "1") {
        fs.readFile(__dirname + serverFiles + req.params.xmlFile, 'utf8', function (err, data) {
            if (err) {
                res.send("Faild to scan the file");
            }
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
            let serverJSON = convert.json2xml(json, {compact: true, spaces: 4});
            serverJSON = serverJSON.toString().replace('</UiScreen>\n' +
                '<UiScreen>\n', "")
            let finalJson = {
                "_declaration": {
                    "_attributes": {
                        "version": "1.0",
                        "encoding": "utf-8"
                    }
                },
                "SerioCommands": {
                    "_attributes": {
                        "version": "1.2"
                    },
                    "DisplayForm": {
                        "Script": {"_cdata": serverJSON}
                    }
                }
            }
            res.send(convert.json2xml(finalJson, {compact: true, spaces: 4, cdataKey: '_cdata'}));
        });
    } else {
        fs.readFile(__dirname + serverFiles + req.params.xmlFile, 'utf8', function (err, data) {
            if (err) {
                res.send("Faild to scan the file");
            }
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
            const objectName = Object.keys(json)[0];
            req.params.xml = objectName;
            getXML(json, req, res);
        });
    }
})

// Display Given Post Json to XML
router.post('/:xml/myJson/:givenXml', (req, res) => {
    getXML(req.body, req, res);
})

// Send Mail to default
router.post('/email', (req, res) => {
    fs.readFile(__dirname + '/../jsonFiles/ScanToEmail.json', 'utf8', function (err, data) {
        if (err) throw err;
        let options = {compact: true, ignoreComment: true, spaces: 4};
        let serverJSON = JSON.parse(data);
        serverJSON = appendJson(serverJSON, 'Destination', [defaultEmail, req.val || req.email ], '_text');
        let result = convert.json2xml(serverJSON, options);
        res.send(result);
    });
})

// Display XML
router.post('/:xml', (req, res) => {
        getXML({}, req, res);
})

// Display XML from upload file
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

// Display XML from upload file with attribute name
router.post('/:xml/:givenXml/:attr', (req, res) => {
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
        getXML(json, req, res, req.params.attr);
    });
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
                    value[0] && value.forEach((i) => {
                        if (typeof i === 'object') {
                            data.push(i)
                        } else {
                            data.push({[attr]: i})
                        }
                    });
                    object[key] = value[0] ? data : value;
                } else {
                    appendJson(object[key], keyToBeReplace, value, attr);
                }
            }
            return key
        })
    return object;
}

function getXML(json, req, res, attr = '_text', send = true) {
    fs.readFile(__dirname + '/../jsonFiles/' + req.params.xml + '.json', 'utf8', function (err, data) {
        if (err) throw err;
        let options = {compact: true, ignoreComment: true, spaces: 4};
        let serverJSON = JSON.parse(data);
        if(json && !json.length) {
            json[req.params.xml] && Object.keys(json[req.params.xml]).forEach((key) => {
                if (typeof json[req.params.xml][key] === 'object') {
                    appendJson(serverJSON, key, json[req.params.xml][key], attr);
                } else {
                    serverJSON = replaceValue(serverJSON, key, json[req.params.xml][key], attr);
                }
            });
        }
        let result = convert.json2xml(serverJSON, options);
        res.send(result);
    });
}

module.exports = router;

/**
 * Copyright 2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var path = require("path");
var when = require("when");

var settings = module.exports = {
    uiPort: process.env.PORT || 1880,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 10000000,

    // Add the nodes in
    nodesDir: path.join(__dirname,"nodes"),

    // Blacklist the non-bluemix friendly nodes
    nodesExcludes:[ '66-mongodb.js','75-exec.js','35-arduino.js','36-rpi-gpio.js','25-serial.js','28-tail.js','50-file.js','31-tcpin.js','32-udp.js','23-watch.js' ],

    // Enable module reinstalls on start-up; this ensures modules installed
    // post-deploy are restored after a restage
    autoInstallModules: true,

    // Move the admin UI
    httpAdminRoot: '/red',

    // You can protect the user interface with a userid and password by using the following property
    // the password must be an md5 hash  eg.. 5f4dcc3b5aa765d61d8327deb882cf99 ('password')
    //httpAdminAuth: {user:"user",pass:"5f4dcc3b5aa765d61d8327deb882cf99"},

    // Serve up the welcome page
    httpStatic: path.join(__dirname,"public"),

    functionGlobalContext: {
        cryptoModule:require('crypto'),
        config : {  "webRequest" : {
                        "headers": {
                            "Accept": "application/xml, text/xml, */*",
                            "Accept-Encoding": "gzip, deflate, sdch",
                            "Accept-Language": "en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4",
                            "Cache-Control": "no-cache",
                            "Connection": "keep-alive",
                            "Host": "invest.ameritrade.com",
                            "Pragma": "no-cache",
                            "Referer": "https://invest.ameritrade.com/cgi-bin/apps/u/OptionChain",
                            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36",
                            "X-Requested-With": "XMLHttpRequest",
                            "Cookie": null
                        },
                        "url": "https://invest.ameritrade.com/cgi-bin/apps/u/OptionChain",
                        "urlRealTime": "https://invest.ameritrade.com/cgi-bin/apps/xml/Quote"
                    },
                    "dbConfig": {
                        "host": "localhost",
                        "port": 5432,
                        "user": "thomas",
                        "database": "bigoptions"
                    },
                    "stockList" : {
                        "full" : ["SVXY","UVXY","SPY","SPXL","SPLS","$SPX.X","$NDX.X","$RUT.X","TNA","TZA"]
                    },
                    "debug" : 0,
                    "saveHTML" : 1,
                    "marketHours" : 1,
                    "mobileNumber" : "4243247194",
                    "blower" : "https://59fa601e-d364-490c-9284-329a273240e4:dUuEgPOaUW-IwwWWJXcCow@api.blower.io/"
        }
    },
    storageModule: require("./mongostorage")
}

if (process.env.NODE_RED_USERNAME && process.env.NODE_RED_PASSWORD) {
    settings.adminAuth = {
        type: "credentials",
        users: function(username) {
            if (process.env.NODE_RED_USERNAME == username) {
                return when.resolve({username:username,permissions:"*"});
            } else {
                return when.resolve(null);
            }
        },
        authenticate: function(username, password) {
            if (process.env.NODE_RED_USERNAME == username &&
                process.env.NODE_RED_PASSWORD == password) {
                return when.resolve({username:username,permissions:"*"});
            } else {
                return when.resolve(null);
            }
        }
    }
}

settings.mongoAppname = process.env.FLOW_REPO || 'nodered';
settings.mongoUrl = process.env.MONGODB_URI;
process.env.MONGOLAB_URI = process.env.MONGODB_URI;

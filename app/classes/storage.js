export default class Storage {
    constructor() {}
    /*
    * saves history
    * @param1 {String} title
    * @param2 {String} url
    */
    static saveHistory(title, url) {
        var fs = require('fs');
        if (title != null && url != null) {
            //get today's date
            var array,
                today = new Date(),
                dd = today.getDate(),
                mm = today.getMonth() + 1,
                yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }
            today = mm + '-' + dd + '-' + yyyy;

            //read history.json file and append new history items
            fs.readFile(historyPath, function(err, data) {
                if (err)
                    throw err;
                var json = data.toString();

                //replace weird characters in utf-8
                json = json.replace("\ufeff", "");
                var obj = JSON.parse(json);
                if (!url.startsWith("webexpress://") && !url.startsWith("about:blank")) {

                    //get current time
                    var date = new Date(),
                        current_hour = date.getHours(),
                        current_minute = date.getMinutes(),
                        time = `${current_hour}:${current_minute}`;

                    //push new history item
                    if (obj['history'][obj['history'].length - 1] == null) {
                        obj['history'].push({"link": url, "title": title, "date": today, "time": time, "id": 0});
                    } else {
                        obj['history'].push({
                            "link": url,
                            "title": title,
                            "date": today,
                            "time": time,
                            "id": obj['history'][obj['history'].length - 1].id + 1
                        });
                    }

                    var jsonStr = JSON.stringify(obj);
                    json = jsonStr;

                    //append new history item to history.json
                    fs.writeFile(historyPath, json, function(err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                }
            });
        }
    }
    /*
    * sets bookmarks data
    * @param1 {String} content
    * @param2 {Function} callback
    */
    static setBookmarksData(json, callback) {
        fs.writeFile(bookmarksDataPath, json, function(err) {
            if (err) {
                Storage.resetBookmarksData();
                throw err;
            } else {
                callback();
            }
        });
    }
    /*
    * returns JSON object bookmarks data
    * @param1 {Function} callback
    */
    static getBookmarksData(callback) {
        fs.readFile(bookmarksDataPath, function(err, data) {
            if (err || data.length < 16) {
                Storage.resetBookmarksData();
                throw err
            } else {
                var json = data.toString();
                //replace weird characters in utf-8
                json = json.replace("\ufeff", "");
                callback(JSON.parse(json));
            }
        });
    }
    /*
    * sets bookmarks to default
    * @param1 {Function} callback
    */
    static resetBookmarksData(callback) {
        var _json = {
            "bookmarks": []
        };
        _json = JSON.stringify(_json);
        Storage.setBookmarksData(_json, function() {
            if (callback != undefined) {
                callback();
            }
        });
    }
    /*
    * adds bookmarks
    * @param1 {Object} data
    * @param2 {Function} callback
    */
    static addBookmark(data, callback) {
        Storage.getBookmarksData(function(_json) {
            var brightness = Storage.colorBrightness(data.color);
            var _ripplecolor = '#000';
            if (brightness < 125 || brightness == NaN) {
                _ripplecolor = '#fff';
            }
            var x = 5;
            _json.bookmarks.push({
              name: data.name,
              url: data.url,
              backgroundColor: data.color,
              icon: data.favicon
            });
            _json = JSON.stringify(_json);
            Storage.setBookmarksData(_json, function() {
                callback();
            });
        });
    }
    /*
    * deletes bookmark
    * @param1 {int} index of bookmark item
    * @param2 {Function} callback
    */
    static delBookmark(_id, callback) {
        try {
            Storage.getBookmarksData(function(_json) {
                _id = parseInt(_id);
                _json.bookmarks.splice(_id, 1);
                _json = JSON.stringify(_json);
                Storage.setBookmarksData(_json, function() {
                    callback();
                });
            });
        } catch (err) {
            Storage.resetBookmarksData();
            throw err;
        }
    }
    /*
    * returns index of bookmark item
    * @param1 {String} url
    * @param2 {Function} callback
    */
    static getBookmarkIndex(url, callback) {
        Storage.getBookmarksData(function(_json) {
            var id = -1;
            for (var i = 0; i < _json.bookmarks.length; i++) {
              if (_json.bookmarks[i].url == url) {
                id = i;
                callback(id);
                break;
              }
            }
        });
    }
    /*
    * returns brightness of color
    * @param1 {String} hex color
    */
    static colorBrightness(color) {
        color = color.replace('#', '');
        var c_r = parseInt(color.substr(0, 2),16);
        var c_g = parseInt(color.substr(2, 2),16);
        var c_b = parseInt(color.substr(4, 2),16);
        return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    }
}

var {app, remote} = require('electron').remote;
var fs = require('fs');
var {ipcRenderer} = require('electron');
var bookmarksPath = app.getPath('userData') + '/userdata/bookmarks.json';
var extensionsPath = app.getPath('userData') + '/userdata/extensions';
var historyPath = app.getPath('userData') + '/userdata/history.json';
var env = "s";
ipcRenderer.on('env', function(e, data) {
    env = data;
});

global.getEnv = function() {
    return env;
}

global.getBookmarksData = function() {
    return JSON.parse(fs.readFileSync(bookmarksPath));
}

global.delBookmark = function(_id, callback) {
    try {
        var _json = getBookmarksData();
        _id = parseInt(_id);
        _json.bookmarks.splice(_id, 1);
        _json = JSON.stringify(_json);
        saveBookmarksData(_json, function() {
            callback();
        });
    } catch (err) {
        throw err;
    }
}

global.getBookmarkIndex = function(url, callback) {
    var _json = getBookmarksData();
    var id = -1;
    for (var i = 0; i < _json.bookmarks.length; i++) {
      if (_json.bookmarks[i].url == url) {
        id = i;
        callback(id);
        break;
      }
    }
}

global.resetBookmarksData = function() {
    var _json = {
        "bookmarks": []
    }
    _json = JSON.stringify(_json);
    global.saveBookmarksData(_json);
}

global.saveBookmarksData = function(json, callback) {
    fs.writeFile(bookmarksPath, json, function(err) {
        if (err) {
            return console.log(err);
        }
        if (global.isFunction(callback)) {
            callback();
        }
    });
}

global.updateFavouriteIcons = function() {
    ipcRenderer.sendToHost("update-favourites");
}

global.getHistoryData = function() {
    return JSON.parse(fs.readFileSync(historyPath));
}

global.saveHistory = function(json) {
    fs.writeFile(historyPath, json, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

global.removeHistory = function(callback = function() {}) {
    fs.unlink(historyPath, callback);
}

document.addEventListener("click", function(e) {
    if (e.which == 2) {
        if (e.target.tagName == "A") {
            ipcRenderer.sendToHost("scroll", e.target.href);
        }
    }
    if (e.which == 1) {
        ipcRenderer.sendToHost("LMB");
    }
});

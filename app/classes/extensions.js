export default class Extensions {
    constructor(tab) {
        this.extensions = [];
        this.tab = tab;
    }
    /*
    * deletes extensions
    */
    deleteExtensions() {
        for (var i = 0; i < this.extensions.length; i++) {
            this.extensions[i].dispose();
        }
    }
    /*
    * loads extensions
    * @param1 {Function} callback
    */
    loadExtensions(callback = null) {
        var t = this;
        //get all .JSON files in folder to an array
        var listOfExtensions = [];
        var listOfExtensionsDirs = [];

        dir.subdirs(extensionsPath, function(err, subdirs) {

            if (err)
                throw err;

            for (var x = 0; x < subdirs.length; x++) {
                var directory = subdirs[x];
                dir.files(subdirs[x], function(err, files) {
                    if (err)
                        throw err;
                    for (var y = 0; y < files.length; y++) {
                        if (files[y].replace(/^.*[\\\/]/, '') === "manifest.json") {
                            listOfExtensions.push(files[y]);
                            //read json from all files
                            requestUrl(files[y], function(data) {
                                //Deserialize JSON string
                                var jsonObject = JSON.parse(data);
                                var jsonData = {
                                    name: jsonObject.name,
                                    version: jsonObject.version,
                                    description: jsonObject.description,
                                    icon: jsonObject.icon,
                                    popup: jsonObject.popup,
                                    settings: jsonObject.settings,
                                    extension: jsonObject.extension
                                };
                                var fileUrl = directory + "\\" + jsonData.extension;
                                //read extension html
                                requestUrl(fileUrl, function(data) {
                                    //add webview to execute extension
                                    var webview = document.createElement('webview');
                                    webview.preload = "../../classes/preloads/extension.js";
                                    webview.src = fileUrl;
                                    document.body.appendChild(webview);
                                    var api = new ExtensionAPI(t.tab, webview);
                                    t.extensions.push(api);
                                    //execute callback
                                    if (typeof(callback) === 'function') {
                                        jsonData.code = data;
                                        var icon = directory.replace(/\\/g,"/") + "/" + jsonData.icon;
                                        var result = jsonData;
                                        result.directory = directory;
                                        result.api = api;
                                        result.icon = icon;
                                        result.popup = 'file://' + directory.replace(/\\/g,"/") + "/" + jsonData.popup;
                                        callback(result);
                                    }
                                });
                            });
                        }
                    }
                });
            }
        });
    }
    /*
    * adds extension to menu
    * @param1 {Object} extension
    * @param2 {MDMenu} menu
    */
    addExtensionToMenu(extension, menu) {
        var newState = menu.state;
        newState.extensionsToCreate.push(extension);
        menu.setState(newState);
    }
}

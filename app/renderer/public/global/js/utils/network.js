function requestUrl(url, callback = null) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            if (callback != null) {
                callback(xmlHttp.responseText);
            }
        }
    };
}

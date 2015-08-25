var THREEx = THREEx || {};
THREEx.FullScreen = THREEx.FullScreen || {};
THREEx.FullScreen.available = function() {
    return this._hasWebkitFullScreen || this._hasMozFullScreen
};
THREEx.FullScreen.activated = function() {
    if (this._hasWebkitFullScreen) {
        return document.webkitIsFullScreen
    } else if (this._hasMozFullScreen) {
        return document.mozFullScreen
    } else {
        console.assert(false)
    }
};
THREEx.FullScreen.request = function(e) {
    e = e || document.body;
    if (this._hasWebkitFullScreen) {
        e.webkitRequestFullScreen()
    } else if (this._hasMozFullScreen) {
        e.mozRequestFullScreen()
    } else {
        console.assert(false)
    }
};
THREEx.FullScreen.cancel = function() {
    if (this._hasWebkitFullScreen) {
        document.webkitCancelFullScreen()
    } else if (this._hasMozFullScreen) {
        document.mozCancelFullScreen()
    } else {
        console.assert(false)
    }
};
THREEx.FullScreen._hasWebkitFullScreen = "webkitCancelFullScreen" in document ? true : false;
THREEx.FullScreen._hasMozFullScreen = "mozCancelFullScreen" in document ? true : false
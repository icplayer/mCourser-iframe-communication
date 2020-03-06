function MCourserCommunication () {
    this.top = window.top.window;
    this.initialized = false;
    this.calledInit = false;
    this.eventsListeners = [];
    this.evCallback = null;
}

MCourserCommunication.prototype.EVENTS_MAP = {
    HANDSHAKE: 'HANDSHAKE',
    REQUEST_USER_DATA: 'REQUEST_USER_DATA',
    REQUEST_COLLECTIONS_DATA: 'REQUEST_COLLECTIONS_DATA',
    REQUEST_COLLECTION_DATA: 'REQUEST_COLLECTION_DATA',
    COLLECTIONS_DATA: 'COLLECTIONS_DATA',
    COLLECTION_DATA: 'COLLECTION_DATA'
}

MCourserCommunication.prototype.init = function () {
    if (this.calledInit) {
        throw new Error("This communication was initialized!");
    }

    this.calledInit = true;

    this._runMessagesListener();
    var promise = new Promise(function (resolve, reject) {
        this._connectIntoEvent(this.EVENTS_MAP.HANDSHAKE).then(function () {
            this.initialized = true;
            resolve(true);
        }.bind(this));
    }.bind(this));

    this._sendEvent(this.EVENTS_MAP.HANDSHAKE, {});
    return promise;
}

MCourserCommunication.prototype.destroy = function () {
    if (!this.initialized) {
        return;
    }

    window.removeEventListener('message', this.evCallback);
    this.initialized = false;
    this.eventsListeners.forEach((ev) => {
        ev.promise.reject(new Error('Destroyed communication'));
    });
    this.eventsListeners = [];
    this.evCallback = null;
}

MCourserCommunication.prototype.updateIFrameHeight = function (newHeight) {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this.top.postMessage('mCurriculum_RESIZE:0:' + newHeight, '*');
}

MCourserCommunication.prototype.requestCollectionsData = function () {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_COLLECTIONS_DATA, {});
    return this._connectIntoEvent(this.EVENTS_MAP.COLLECTIONS_DATA)
}

MCourserCommunication.prototype.requestCollectionData = function (id) {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_COLLECTION_DATA, {id: id})
    return this._connectIntoEvent(this.EVENTS_MAP.COLLECTION_DATA, function (collectionData) {
        var data = collectionData.data;
        if (!data) {
            return false;
        }

        return data.id === id;
    });
}

MCourserCommunication.prototype._connectIntoEvent = function (type, matchEvent) {
    var pResolve, pReject;
    var promise = new Promise (function (resolve, reject) {
        pResolve = resolve;
        pReject = reject;
    }.bind(this));

    var event = {
        name: type,
        promise: {
            resolve: pResolve,
            reject: pReject
        },
        matchEvent: matchEvent || function () {return true} // In case if we want to match specific ID or different field
    };
    this.eventsListeners.push(event);

    return promise;
}

MCourserCommunication.prototype._sendEvent = function (type, data) {
    var copy={};
    Object.assign(copy, data);
    data['type'] = type;
    this.top.postMessage(data, '*')
}

MCourserCommunication.prototype._runMessagesListener = function () {
    var listener = function (message) {
        if (message.data && message.data.type) {
            var type = message.data.type;
            var called = false;

            this.eventsListeners = this.eventsListeners.filter(function (event) {
                if (called) {
                    return true;
                }

                if (event.name === type) {
                    try {
                        if (!event.matchEvent(message.data)) {
                            return true;
                        }    
                    } catch (error) {
                        return true;
                    }

                    called = true;
                    try {
                        event.promise.resolve(message.data);
                    } finally {
                        return false;
                    }
                } else {
                    return true;
                }
            });
        }
    }.bind(this);
    window.addEventListener('message', listener);
    this.evCallback = listener;
}

// var communication = new MCourserCommunication();
// communication.init().then(function (data) {
//     console.log("Initialization status: ", data);
//     if (data) {
//         updateIframeHeight();
//         communication.requestCollectionsData().then(function (data) {
//             var found = false; 
//             data.data.forEach(function (el) {
//                 if (el.mAuthorId === 5392122382909440) {
//                     found = true;
//                     manageAvailable(el);
//                 }
//             });

//             if (!found) {
//                 manageNotAvailable();
//             }
//         })
//     }
// });


// function manageNotAvailable() {
//     console.log("Not available");
// }

// function manageAvailable(collectionData) {
//     console.log("Manage available", collectionData);
//     communication.requestCollectionData(collectionData.id).then(function (data) {
//         console.log(data);
//     });
// }

// function updateIframeHeight () {
//     var height = window.document.documentElement.getBoundingClientRect().height;
//     communication.updateIFrameHeight(height);
// }
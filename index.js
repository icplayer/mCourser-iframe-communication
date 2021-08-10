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
    REQUEST_COLLECTION_ID: 'REQUEST_COLLECTION_ID',
    REQUEST_COLLECTION_DATA: 'REQUEST_COLLECTION_DATA',
    REQUEST_COLLECTION_EXTERNAL_RESOURCES: 'REQUEST_COLLECTION_EXTERNAL_RESOURCES',
    REQUEST_COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA: 'REQUEST_COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA',
    POST_COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA: 'POST_COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA',
    REQUEST_COLLECTION_CUSTOM_TOC_STATE_DATA: 'REQUEST_COLLECTION_CUSTOM_TOC_STATE_DATA',
    POST_COLLECTION_CUSTOM_TOC_STATE_DATA: 'POST_COLLECTION_CUSTOM_TOC_STATE_DATA',
    COLLECTIONS_DATA: 'COLLECTIONS_DATA',
    COLLECTION_ID: 'COLLECTION_ID',
    COLLECTION_DATA: 'COLLECTION_DATA',
    COLLECTION_EXTERNAL_RESOURCES: 'COLLECTION_EXTERNAL_RESOURCES',
    COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA: 'COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA',
    COLLECTION_CUSTOM_TOC_STATE_DATA: 'COLLECTION_CUSTOM_TOC_STATE_DATA',
    COLLECTION_LESSONS_PAGINATED_RESULTS_DATA: 'COLLECTION_LESSONS_PAGINATED_RESULTS_DATA',
    REQUEST_CROSS_RESOURCE: 'REQUEST_CROSS_RESOURCE',
    REQUEST_LESSON: 'REQUEST_LESSON',
    REQUEST_COLLECTION_DATA_BY_URL: 'REQUEST_COLLECTION_DATA_BY_URL',
    REQUEST_COLLECTION_LESSONS_PAGINATED_RESULTS_DATA: 'REQUEST_COLLECTION_LESSONS_PAGINATED_RESULTS_DATA',
    COLLECTION_DATA_BY_URL: 'COLLECTION_DATA_BY_URL',
    REQUEST_FIRESTORE_CUSTOM_TOKEN: 'REQUEST_FIRESTORE_CUSTOM_TOKEN',
    FIRESTORE_CUSTOM_TOKEN: 'FIRESTORE_CUSTOM_TOKEN',
    REQUEST_LOGIN_VIEW: 'REQUEST_LOGIN_VIEW'
};

MCourserCommunication.prototype.init = function () {
    if (this.calledInit) {
        throw new Error("This communication was initialized!");
    }

    this.calledInit = true;

    this._runMessagesListener();
    var promise = new Promise(function (resolve, reject) {
        this._connectIntoEvent(this.EVENTS_MAP.HANDSHAKE).then(function (data) {
            this.initialized = true;
            resolve(data.isAuthenticated);
        }.bind(this));
    }.bind(this));

    this._sendEvent(this.EVENTS_MAP.HANDSHAKE, {});
    return promise;
};

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
};

MCourserCommunication.prototype.updateIFrameHeight = function (newHeight) {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this.top.postMessage('mCurriculum_RESIZE:0:' + newHeight, '*');
};

MCourserCommunication.prototype.requestCollectionsData = function () {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_COLLECTIONS_DATA, {});
    return this._connectIntoEvent(this.EVENTS_MAP.COLLECTIONS_DATA)
};

MCourserCommunication.prototype.requestCollectionId = function () {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_COLLECTION_ID, {})
    return this._connectIntoEvent(this.EVENTS_MAP.COLLECTION_ID)
};

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
};

MCourserCommunication.prototype.requestCollectionExternalResources = function () {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_COLLECTION_EXTERNAL_RESOURCES, {})
    return this._connectIntoEvent(this.EVENTS_MAP.COLLECTION_EXTERNAL_RESOURCES)
};

MCourserCommunication.prototype.requestCollectionLessonsPaginatedResults = function (id) {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_COLLECTION_LESSONS_PAGINATED_RESULTS_DATA, {id: id})

    return this._connectIntoEvent(this.EVENTS_MAP.COLLECTION_LESSONS_PAGINATED_RESULTS_DATA,
        function (collectionLessonsPaginatedResults) {

        let data = collectionLessonsPaginatedResults.data;
        if (!data) {
            return false;
        }

        return data.id === id;
    });
};

MCourserCommunication.prototype.requestCollectionDataByURL = function (publisherURL, collectionURL) {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_COLLECTION_DATA_BY_URL, {
        publisherURL: publisherURL,
        collectionURL: collectionURL
    });

    return this._connectIntoEvent(this.EVENTS_MAP.COLLECTION_DATA_BY_URL, function (collectionData) { 
        var data = collectionData.data;
        if (!data) {
            return false;
        }

        return data.collectionURL === collectionURL && publisherURL === publisherURL;
    });
};

MCourserCommunication.prototype.requestCollectionCustomTOCFirstVisitDate = function (id) {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA, {id: id})

    return this._connectIntoEvent(this.EVENTS_MAP.COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA,
        function (collectionCustomTOCFirstVisitDate) {

        let data = collectionCustomTOCFirstVisitDate.data;

        if (!data) {
            return false;
        }

        return data.id === id;
    });
};

MCourserCommunication.prototype.postCollectionCustomTOCFirstVisitDate = function (id) {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.POST_COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA, {id: id})

    return this._connectIntoEvent(this.EVENTS_MAP.COLLECTION_CUSTOM_TOC_FIRST_VISIT_DATE_DATA,
        function (collectionCustomTOCFirstVisitDate) {

        let data = collectionCustomTOCFirstVisitDate.data;

        if (!data) {
            return false;
        }

        return data.id === id;
    });
};

MCourserCommunication.prototype.requestCollectionCustomTOCState = function (id, state) {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_COLLECTION_CUSTOM_TOC_STATE_DATA, {id: id, state: state})

    return this._connectIntoEvent(this.EVENTS_MAP.COLLECTION_CUSTOM_TOC_STATE_DATA,
        function (collectionCustomTOCState) {

        let data = collectionCustomTOCState.data;

        if (!data) {
            return false;
        }

        return data.id === id;
    });
};

MCourserCommunication.prototype.postCollectionCustomTOCState = function (id, state) {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.POST_COLLECTION_CUSTOM_TOC_STATE_DATA, {id: id, state: state})

    return this._connectIntoEvent(this.EVENTS_MAP.COLLECTION_CUSTOM_TOC_STATE_DATA,
        function (collectionCustomTOCState) {

        let data = collectionCustomTOCState.data;

        if (!data) {
            return false;
        }

        return data.id === id;
    });
};

MCourserCommunication.prototype.requestCrossResource = function (resourceId, lessonId, courseId, pageId, lessonType) {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }
    
    this._sendEvent(this.EVENTS_MAP.REQUEST_CROSS_RESOURCE, {
        resourceId: resourceId,
        lessonId: lessonId,
        courseId: courseId,
        pageId: pageId,
        lessonType: lessonType
    });
};

MCourserCommunication.prototype.requestOpenLesson = function (lessonID) {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_LESSON, {
        lessonId: lessonID
    });
};

MCourserCommunication.prototype.requestFirestoreToken = function () {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_FIRESTORE_CUSTOM_TOKEN);

    return this._connectIntoEvent(this.EVENTS_MAP.FIRESTORE_CUSTOM_TOKEN);
}

MCourserCommunication.prototype.requestLoginView = function () {
    if (!this.initialized) {
        throw new Error('This communication is not initialized!');
    }

    this._sendEvent(this.EVENTS_MAP.REQUEST_LOGIN_VIEW);
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
};

MCourserCommunication.prototype._sendEvent = function (type, data) {
    var copy={};
    Object.assign(copy, data);
    copy['type'] = type;
    this.top.postMessage(copy, '*')
};

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
};

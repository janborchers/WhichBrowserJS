'use strict';

(function (window) {

    window.WHICHBROWSER_DATA = {};

    window.WHICHBROWSER_DATA.DEFINITIONS = {

        _BASEPATH_: '/',

        TYPE_DESKTOP: 'desktop',
        TYPE_MOBILE: 'mobile',
        TYPE_TABLET: 'tablet',
        TYPE_GAMING: 'gaming',
        TYPE_EREADER: 'ereader',
        TYPE_MEDIA: 'media',
        TYPE_HEADSET: 'headset',
        TYPE_WATCH: 'watch',
        TYPE_EMULATOR: 'emulator',
        TYPE_TELEVISION: 'television',
        TYPE_MONITOR: 'monitor',
        TYPE_CAMERA: 'camera',
        TYPE_SIGNAGE: 'signage',
        TYPE_WHITEBOARD: 'whiteboard',
        TYPE_GPS: 'gps',
        TYPE_CAR: 'car',
        TYPE_POS: 'pos',
        TYPE_BOT: 'bot',

        FLAG_GOOGLETV: 1,
        FLAG_GOOGLEGLASS: 2,

        ID_NONE: 0,
        ID_INFER: 1,
        ID_PATTERN: 2,
        ID_MATCH_UA: 4,
        ID_MATCH_PROF: 8,

        ENGINE_TRIDENT: 1,
        ENGINE_PRESTO: 2,
        ENGINE_CHROMIUM: 4,
        ENGINE_GECKO: 8,
        ENGINE_WEBKIT: 16,
        ENGINE_V8: 32,

        FEATURE_SANDBOX: 1,
        FEATURE_WEBSOCKET: 2,
        FEATURE_WORKER: 4,
        FEATURE_APPCACHE: 8,
        FEATURE_HISTORY: 16,
        FEATURE_FULLSCREEN: 32,
        FEATURE_FILEREADER: 64,

        NULL: null

    };


}(window));


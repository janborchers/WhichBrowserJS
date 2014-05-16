'use strict';

(function (window) {

    var TYPE_MOBILE = window.WHICHBROWSER_DATA.DEFINITIONS.TYPE_MOBILE;
    var TYPE_MEDIA = window.WHICHBROWSER_DATA.DEFINITIONS.TYPE_MEDIA;
    var TYPE_TABLET = window.WHICHBROWSER_DATA.DEFINITIONS.TYPE_TABLET;

    window.WHICHBROWSER_DATA.ANDROID_MODELS.IOS_MODELS = {

        /* Generic names */
        'iPhone': [ 'Apple', 'iPhone', TYPE_MOBILE ],
        'iPhone 3G': [ 'Apple', 'iPhone 3G', TYPE_MOBILE ],
        'iPhone 3GS': [ 'Apple', 'iPhone 3GS', TYPE_MOBILE ],
        'iPhone 4': [ 'Apple', 'iPhone 4', TYPE_MOBILE ],
        'iPhone 4S': [ 'Apple', 'iPhone 4S', TYPE_MOBILE ],
        'iPhone 5': [ 'Apple', 'iPhone 5', TYPE_MOBILE ],
        'iPhone 5c': [ 'Apple', 'iPhone 5c', TYPE_MOBILE ],
        'iPhone 5s': [ 'Apple', 'iPhone 5s', TYPE_MOBILE ],
        'iPod': [ 'Apple', 'iPod touch', TYPE_MEDIA ],
        'iPod touch': [ 'Apple', 'iPod touch', TYPE_MEDIA ],
        'iPad': [ 'Apple', 'iPad', 'tablet' ],

        /* Offical gestalt names */
        'iPhone1,1': [ 'Apple', 'iPhone', TYPE_MOBILE ],
        'iPhone1,2': [ 'Apple', 'iPhone 3G', TYPE_MOBILE ],
        'iPhone2,1': [ 'Apple', 'iPhone 3GS', TYPE_MOBILE ],
        'iPhone3,1': [ 'Apple', 'iPhone 4', TYPE_MOBILE ],
        'iPhone3,2': [ 'Apple', 'iPhone 4', TYPE_MOBILE ],
        'iPhone3,3': [ 'Apple', 'iPhone 4', TYPE_MOBILE ],
        'iPhone4,1': [ 'Apple', 'iPhone 4S', TYPE_MOBILE ],
        'iPhone5,1': [ 'Apple', 'iPhone 5', TYPE_MOBILE ],
        'iPhone5,2': [ 'Apple', 'iPhone 5', TYPE_MOBILE ],
        'iPhone5,3': [ 'Apple', 'iPhone 5c', TYPE_MOBILE ],
        'iPhone5,4': [ 'Apple', 'iPhone 5c', TYPE_MOBILE ],
        'iPhone6,1': [ 'Apple', 'iPhone 5s', TYPE_MOBILE ],
        'iPhone6,2': [ 'Apple', 'iPhone 5s', TYPE_MOBILE ],
        'iPod1,1': [ 'Apple', 'iPod touch', TYPE_MEDIA ],
        'iPod2,1': [ 'Apple', 'iPod touch (2nd gen)', TYPE_MEDIA ],
        'iPod3,1': [ 'Apple', 'iPod touch (3rd gen)', TYPE_MEDIA ],
        'iPod4,1': [ 'Apple', 'iPod touch (4th gen)', TYPE_MEDIA ],
        'iPod5,1': [ 'Apple', 'iPod touch (5th gen)', TYPE_MEDIA ],
        'iPad1,1': [ 'Apple', 'iPad', TYPE_TABLET ],
        'iPad1,2': [ 'Apple', 'iPad 2', TYPE_TABLET ],
        'iPad2,1': [ 'Apple', 'iPad 2', TYPE_TABLET ],
        'iPad2,2': [ 'Apple', 'iPad 2', TYPE_TABLET ],
        'iPad2,3': [ 'Apple', 'iPad 2', TYPE_TABLET ],
        'iPad2,4': [ 'Apple', 'iPad 2', TYPE_TABLET ],
        'iPad2,5': [ 'Apple', 'iPad mini', TYPE_TABLET ],
        'iPad2,6': [ 'Apple', 'iPad mini', TYPE_TABLET ],
        'iPad2,7': [ 'Apple', 'iPad mini', TYPE_TABLET ],
        'iPad3,1': [ 'Apple', 'iPad (3rd gen)', TYPE_TABLET ],
        'iPad3,2': [ 'Apple', 'iPad (3rd gen)', TYPE_TABLET ],
        'iPad3,3': [ 'Apple', 'iPad (3rd gen)', TYPE_TABLET ],
        'iPad3,4': [ 'Apple', 'iPad (4th gen)', TYPE_TABLET ],
        'iPad3,5': [ 'Apple', 'iPad (4th gen)', TYPE_TABLET ],
        'iPad3,6': [ 'Apple', 'iPad (4th gen)', TYPE_TABLET ],
        'iPad4,1': [ 'Apple', 'iPad Air', TYPE_TABLET ],
        'iPad4,2': [ 'Apple', 'iPad Air', TYPE_TABLET ],
        'iPad4,3': [ 'Apple', 'iPad Air', TYPE_TABLET ],
        'iPad4,4': [ 'Apple', 'iPad mini (2nd gen)', TYPE_TABLET ],
        'iPad4,5': [ 'Apple', 'iPad mini (2nd gen)', TYPE_TABLET ]
    };



}(window));

'use strict';
/*global require*/
/*global console*/

var compressor = require('node-minify');


new compressor.minify({
    type: 'gcc',
    fileIn: [
        'js/data/definitions.js',
        'js/data/build-android.js',
        'js/data/id-android.js',
        'js/data/models-android.js',
        'js/data/models-bada.js',
        'js/data/models-asha.js',
        'js/data/models-blackberry.js',
        'js/data/models-brew.js',
        'js/data/models-feature.js',
        'js/data/models-firefoxos.js',
        'js/data/models-ios.js',
        'js/data/models-s40.js',
        'js/data/models-s60.js',
        'js/data/models-tizen.js',
        'js/data/models-touchwiz.js',
        'js/data/models-wm.js',
        'js/data/models-wp.js',
        'js/data/profiles.js',
        'js/libraries/whichbrowser.js'
    ],
    fileOut: 'whichbrowser-js-min.js',
    options: ['--compilation_level=SIMPLE_OPTIMIZATIONS'],
    callback: function(err, min){
        if (err)
        {
            console.log(err);
        }
        else if (min)
        {
            console.log("done");
        }
        else
        {
            console.log("not done");
        }

    }
});

WhichBrowserJS
==============

This is a pure-frontend port of Niels Leenheer's [WhichBrowser](https://github.com/NielsLeenheer/WhichBrowser) library.

It's slightly less powerful than the original and might not be maintained as frequently ("maintained" as in "copied from WhichBrowser") as the original, but it works without a php-setup.


**Dependencies**

Should work out of the box if you just download [this file](https://raw.githubusercontent.com/janborchers/WhichBrowserJS/master/whichbrowser-js-min.js).

If you want to change it and use the included `minify.js` script you need [node-js](http://nodejs.org/) with the [node-minify](https://www.npmjs.org/package/node-minify) library installed.

It just works by typing `node minify.js` on the cli.


**Usage**

    (new WhichBrowser()).onReady(function (info) {

        doStuffWith(info);

    });

`info` is a JSON-structure looking roughly like this

    {
        "browser": {
            "stock": <bool>,
            "hidden": <bool>,
            "channel": <string>,
            "mode": <string>,
            "name": <string>,
            "version": {
                "value": <string>,
                "alias": <string>,
                "details": <number>
            }
        },
        "device": {
            "type": <string>,
            "identified": <number>
        },
        "engine": {
            "name": <string>,
            "version": {
                "value": <string>,
                "alias": <string>,
                "details": <number>
            }
        },
        "os": {
            "name": <string>
        },
        "camouflage": <bool>,
        "features": <object>
    }


For more information about the reliability of this information and how exactly to interpret it, see (and ideally *use* in the first place) [the original library](https://github.com/NielsLeenheer/WhichBrowser).


License
-------

Copyright (c) 2013 Niels Leenheer

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

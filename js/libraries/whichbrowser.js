'use strict';
/*
    Copyright (c) 2010-2013 Niels Leenheer

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
*/


/*jslint bitwise: true */
/*jslint white: true */

// /*global _BASEPATH_*/

/*global TYPE_DESKTOP*/
/*global TYPE_MOBILE*/
/*global TYPE_TABLET*/
/*global TYPE_GAMING*/
/*global TYPE_EREADER*/
/*global TYPE_MEDIA*/
// /*global TYPE_HEADSET*/
// /*global TYPE_WATCH*/
/*global TYPE_EMULATOR*/
/*global TYPE_TELEVISION*/
// /*global TYPE_MONITOR*/
// /*global TYPE_CAMERA*/
/*global TYPE_SIGNAGE*/
/*global TYPE_WHITEBOARD*/
// /*global TYPE_GPS*/
/*global TYPE_CAR*/
// /*global TYPE_POS*/
/*global TYPE_BOT*/

/*global FLAG_GOOGLETV*/
/*global FLAG_GOOGLEGLASS*/

/*global ID_NONE*/
/*global ID_INFER*/
/*global ID_PATTERN*/
/*global ID_MATCH_UA*/
/*global ID_MATCH_PROF*/

/*global ENGINE_TRIDENT*/
/*global ENGINE_PRESTO*/
/*global ENGINE_CHROMIUM*/
/*global ENGINE_GECKO*/
/*global ENGINE_WEBKIT*/
/*global ENGINE_V8*/

/*global FEATURE_SANDBOX*/
/*global FEATURE_WEBSOCKET*/
/*global FEATURE_WORKER*/
/*global FEATURE_APPCACHE*/
/*global FEATURE_HISTORY*/
/*global FEATURE_FULLSCREEN*/
/*global FEATURE_FILEREADER*/

/*global ANDROID_BROWSERS*/
/*global ANDROID_BUILDS*/

/*global ANDROID_MODELS*/
/*global ASHA_MODELS*/
/*global BADA_MODELS*/
/*global BREW_MODELS*/
/*global FIREFOXOS_MODELS*/
/*global TIZEN_MODELS*/
/*global TOUCHWIZ_MODELS*/
/*global WINDOWS_MOBILE_MODELS*/
/*global WINDOWS_PHONE_MODELS*/
/*global S40_MODELS*/
/*global S60_MODELS*/
/*global FEATURE_MODELS*/
/*global BLACKBERRY_MODELS*/
/*global IOS_MODELS*/
/*global PROFILES*/


var getallheaders = function (cb) {


    try
    {
        var xmlhttp = null;
        /*@cc_on @*/
        /*@if (@_jscript_version >= 5)
        // JScript gives us Conditional compilation, we can cope with old IE versions.
        // and security blocked creation of the objects.
        try
        {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e)
        {
            try
            {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e)
            {
                xmlhttp = false;
            }
        }
        @end @*/

        if (!xmlhttp && typeof XMLHttpRequest !== 'undefined')
        {
            xmlhttp = new XMLHttpRequest();

        }
        if (!xmlhttp && window.createRequest)
        {
            xmlhttp = window.createRequest();
        }

        xmlhttp.open("HEAD", '', false);

        xmlhttp.onreadystatechange = function (event) {

            var request = event.target;
            if (request.readyState === xmlhttp.DONE)
            {
                var headerlist = request.getAllResponseHeaders().trim().split('\n');
                var headers = {};
                var item;

                for (var i = 0, l = headerlist.length; i < l; i += 1)
                {
                    item = headerlist[i];
                    if (item)
                    {
                        item = item.split(':');
                        headers[item[0].trim()] = item[1].trim();
                    }
                }

                cb(headers);
            }
        };
        xmlhttp.send(null);

        return true;

    }
    catch (exception)
    {
        console.warn("Can't check headers:", exception);
        cb({});
        return false;
    }

};




function Version(options)
{

    if (options)
    {
        this.value = options.value || null;
        this.alias = options.alias || null;
        this.details = options.details || null;

    }

}

Version.prototype.toFloat = function () {
    return parseFloat(this.value);
};

Version.prototype.toNumber = function () {
    return parseInt(this.value, 10);
};




var DeviceProfiles = {
    identify: function (url) {
        return PROFILES[url] || false;
    }
};


var DeviceModels = {

    identify: function (type, model) {

        switch (type)
        {
            case 'android':
                return DeviceModels.identifyAndroid(model);
            case 'asha':
                return DeviceModels.identifyList(ASHA_MODELS, model);
            case 'bada':
                return DeviceModels.identifyList(BADA_MODELS, model);
            case 'blackberry':
                return DeviceModels.identifyBlackBerry(model);
            case 'brew':
                return DeviceModels.identifyList(BREW_MODELS, model);
            case 'firefoxos':
                return DeviceModels.identifyList(FIREFOXOS_MODELS, model);
            case 'ios':
                return DeviceModels.identifyIOS(model);
            case 'tizen':
                return DeviceModels.identifyList(TIZEN_MODELS, model);
            case 'touchwiz':
                return DeviceModels.identifyList(TOUCHWIZ_MODELS, model);
            case 'wm':
                return DeviceModels.identifyList(WINDOWS_MOBILE_MODELS, model);
            case 'wp':
                return DeviceModels.identifyList(WINDOWS_PHONE_MODELS, model);
            case 's40':
                return DeviceModels.identifyList(S40_MODELS, model);
            case 's60':
                return DeviceModels.identifyList(S60_MODELS, model);
            case 'feature':
                return DeviceModels.identifyList(FEATURE_MODELS, model);
        }

        return {
            type: '',
            model: model,
            identified: ID_NONE
        };
    },

    identifyIOS: function (model) {
        model = model.replace(/Unknown/g, '');
        model = model.replace(/iPh([0-9],[0-9])/, 'iPhone\\1');
        model = model.replace(/iPd([0-9],[0-9])/, 'iPod\\1');

        return DeviceModels.identifyList(IOS_MODELS, model);
    },

    identifyAndroid: function (model) {
        var result = DeviceModels.identifyList(ANDROID_MODELS, model);

        if (!result.identified)
        {
            model = DeviceModels.cleanup(model);
            if (/AndroVM/i.test(model) ||
                model === 'Emulator' ||
                model === 'x86 Emulator' ||
                model === 'x86 VirtualBox' ||
                model === 'vm')
            {
                return {
                    type: TYPE_EMULATOR,
                    identified: ID_PATTERN,
                    manufacturer: null,
                    model: null
                };
            }
        }

        return result;
    },

    identifyBlackBerry: function (model) {
        var device = {
            type: TYPE_MOBILE,
            identified: ID_PATTERN,
            manufacturer: 'RIM',
            model: 'BlackBerry ' + model
        };

        if (BLACKBERRY_MODELS[model])
        {
            device.model = 'BlackBerry ' + BLACKBERRY_MODELS[model] + ' ' + model;
            device.identified |= ID_MATCH_UA;
        }

        return device;
    },

    identifyList: function (list, model) {

        model = DeviceModels.cleanup(model);

        var device = {
            type: TYPE_MOBILE,
            identified: ID_NONE,
            manufacturer: null,
            model: model
        };

        var match, value;
        for (var key in list)
        {
            if (list.hasOwnProperty(key))
            {
                match = false;
                value = list[key];
                if (key[key.length - 1] === "!")
                {
                    match = !!(new RegExp('/^' + key.substr(0, key.length - 1) + '/i')).test(model);
                }
                else
                {
                    match = (key.toLowerCase() === model.toLowerCase());
                }

                if (match)
                {
                    device.manufacturer = value[0];
                    device.model = value[1];

                    if (!!value[2])
                    {
                        device.type = value[2];
                    }
                    if (!!value[3])
                    {
                        device.flag = value[3];
                    }
                    device.identified = ID_MATCH_UA;

                    if (!device.manufacturer && !device.model)
                    {
                        device.identified = ID_PATTERN;
                    }

                    return device;
                }
            }
        }

        return device;
    },

    cleanup: function (s) {
        s = s || '';

        s = s.replace(/\/[^\/]+$/, '');
        s = s.replace(/\/[^\/]+ Android\/.*/, '');

        s = s.replace(/UCBrowser$/, '');

        s = s.replace(/_TD$/, '');
        s = s.replace(/_CMCC$/, '');

        s = s.replace(/_/, ' ');
        s = s.replace(/^\s+|\s+$/, '');

        s = s.replace(/^tita on /, '');
        s = s.replace(/^De-Sensed /, '');
        s = s.replace(/^ICS AOSP on /, '');
        s = s.replace(/^Baidu Yi on /, '');
        s = s.replace(/^Buildroid for /, '');
        s = s.replace(/^Gingerbread on /, '');
        s = s.replace(/^Android (on |for )/, '');
        s = s.replace(/^Generic Android on /, '');
        s = s.replace(/^Full JellyBean( on )?/, '');
        s = s.replace(/^Full (AOSP on |Android on |Cappuccino on |MIPS Android on |Android)/, '');
        s = s.replace(/^AOSP on /, '');

        s = s.replace(/^Acer( |-)?/i, '');
        s = s.replace(/^Iconia( Tab)? /, '');
        s = s.replace(/^ASUS ?/, '');
        s = s.replace(/^Ainol /, '');
        s = s.replace(/^Coolpad ?/i, 'Coolpad ');
        s = s.replace(/^ALCATEL /, '');
        s = s.replace(/^Alcatel OT-(.*)/, 'one touch $1');
        s = s.replace(/^YL-/, '');
        s = s.replace(/^Novo7 ?/i, 'Novo7 ');
        s = s.replace(/^G[iI]ONEE[ \-]/, '');
        s = s.replace(/^HW-/, '');
        s = s.replace(/^Huawei[ \-]/i, 'Huawei ');
        s = s.replace(/^SAMSUNG[ \-]/i, '');
        s = s.replace(/^SAMSUNG SAMSUNG-/i, '');
        s = s.replace(/^(Sony ?Ericsson|Sony)/, '');
        s = s.replace(/^(Lenovo Lenovo|LNV-Lenovo|LENOVO-Lenovo)/, 'Lenovo');
        s = s.replace(/^Lenovo-/, 'Lenovo');
        s = s.replace(/^ZTE-/, 'ZTE ');
        s = s.replace(/^(LG)[ _\/]/, '$1-');
        s = s.replace(/^(HTC.+)\s[v|V][0-9.]+$/, '$1');
        s = s.replace(/^(HTC)[\-\/]/, '$1');
        s = s.replace(/^(HTC)([A-Z][0-9][0-9][0-9])/, '$1 $2');
        s = s.replace(/^(Motorola[\s|\-])/, '');
        s = s.replace(/^(Moto|MOT-)/, '');

        s = s.replace(/-?(orange(-ls)?|vodafone|bouygues|parrot|Kust)$/i, '');
        s = s.replace(/http:\/\/.+$/i, '');
        s = s.replace(/^\s+|\s+$/, '');

        return s;
    }

};


var BrowserIds = {

    identify: function (type, model) {

        switch (type)
        {
            case 'android':
                return BrowserIds.identifyList(ANDROID_BROWSERS, model);
        }

        return false;
    },

    identifyList: function (list, id) {
        return list[id] || false;
    }
};


var BuildIds = {

    identify: function ($type, $id) {

        switch ($type)
        {
            case 'android':
                return BuildIds.identifyList(ANDROID_BUILDS, $id);
        }

        return false;
    },

    identifyList: function (list, id) {
        if (!!list[id])
        {
            return new Version({ value: list[id] });
        }
        return false;
    }
};






var WhichBrowser = function (options) {

    this.options = options;
    if (!!options.headers)
    {
        this.headers = options.headers;
    }
    else
    {
        this.headers = {};
    }

    this.browser = {
        stock: true,
        hidden: false,
        channel: '',
        mode: ''
    };
    this.device = {
        type: '',
        identified: ID_NONE
    };
    this.engine = {};
    this.os = {};

    this.camouflage = false;
    this.features = {};

    var that = this;
    getallheaders(function (headers) {


        that.options.headers = that.headers = headers;

        var ua = that.getHeader('User-Agent') || window.navigator.userAgent || '';
        that.analyseUserAgent(ua);

        ua = that.getHeader('X-Original-User-Agent');
        if (ua)
        {
            that.analyseAlternativeUserAgent(ua);
        }

        ua = that.getHeader('X-Device-User-Agent');
        if (ua)
        {
            that.analyseAlternativeUserAgent(ua);
        }

        ua = that.getHeader('Device-Stock-UA');
        if (ua)
        {
            that.analyseAlternativeUserAgent(ua);
        }

        ua = that.getHeader('X-OperaMini-Phone-UA');
        if (ua)
        {
            that.analyseAlternativeUserAgent(ua);
        }

        ua = that.getHeader('X-UCBrowser-Device-UA');
        if (ua)
        {
            that.analyseAlternativeUserAgent(ua);
        }

        ua = that.getHeader('X-UCBrowser-Phone-UA');
        if (ua)
        {
            that.analyseOldUCUserAgent(ua);
        }

        ua = that.getHeader('X-UCBrowser-UA');
        if (ua)
        {
            that.analyseNewUCUserAgent(ua);
        }

        ua = that.getHeader('X-Puffin-UA');
        if (ua)
        {
            that.analysePuffinUserAgent(ua);
        }

        ua = that.getHeader('Baidu-FlyFlow');
        if (ua)
        {
            that.analyseBaiduHeader(ua);
        }

        ua = that.getHeader('X-Requested-With');
        if (ua)
        {
            that.analyseBrowserId(ua);
        }

        ua = that.getHeader('X-Wap-Profile');
        if (ua)
        {
            that.analyseWapProfile(ua);
        }

        that.detectCamouflage();

        if (that.cb)
        {
            that.cb(that)
        }

        that.ready = true;

    });

};


WhichBrowser.prototype.getHeader = function (h) {
    return this.headers[h] ||
           this.headers[h.toLowerCase()] ||
           this.headers[h.toUpperCase()] ||
           null;
};


WhichBrowser.prototype.analyseUserAgent = function (ua) {

    var match, device, version;

    /****************************************************
     *        Unix
     */
    if (/Unix/.test(ua))
    {
        this.os.name = 'Unix';
    }

    /****************************************************
     *        FreeBSD
     */
    if (/FreeBSD/.test(ua))
    {
        this.os.name = 'FreeBSD';
    }

    /****************************************************
     *        OpenBSD
     */
    if (/OpenBSD/.test(ua))
    {
        this.os.name = 'OpenBSD';
    }

    /****************************************************
     *        NetBSD
     */
    if (/NetBSD/.test(ua))
    {
        this.os.name = 'NetBSD';
    }


    /****************************************************
     *        Solaris
     */
    if (/SunOS/.test(ua))
    {
        this.os.name = 'Solaris';
    }


    /****************************************************
     *        IRIX
     */
    if (/IRIX/.test(ua))
    {
        this.os.name = 'IRIX';

        match = /IRIX ([0-9.]*)/.exec(ua);
        if (match)
        {
            this.os.version = new Version({'value': match[1]});
        }

        match = /IRIX;(?:64|32) ([0-9.]*)/.exec(ua);
        if (match)
        {
            this.os.version = new Version({'value': match[1]});
        }
    }


    /****************************************************
     *        Syllable
     */
    if (/Syllable/.test(ua))
    {
        this.os.name = 'Syllable';
    }


    /****************************************************
     *        Linux
     */
    if (/Linux/.test(ua))
    {
        this.os.name = 'Linux';

        if (/CentOS/.test(ua))
        {
            this.os.name = 'CentOS';

            match = /CentOS\/[0-9\.\-]+el([0-9_]+)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({value: match[1]});
            }

            this.device.type = TYPE_DESKTOP;
        }

        if (/Debian/.test(ua))
        {
            this.os.name = 'Debian';
            this.device.type = TYPE_DESKTOP;
        }

        if (/Fedora/.test(ua))
        {
            this.os.name = 'Fedora';

            match = /Fedora\/[0-9\.\-]+fc([0-9]+)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({value: match[1]});
            }

            this.device.type = TYPE_DESKTOP;
        }

        if (/Gentoo/.test(ua))
        {
            this.os.name = 'Gentoo';
            this.device.type = TYPE_DESKTOP;
        }

        if (/gNewSense/.test(ua))
        {
            this.os.name = 'gNewSense';

            match = /gNewSense\/[^\(]+\(([0-9\.]+)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({'value': match[1]});
            }

            this.device.type = TYPE_DESKTOP;
        }

        if (/Kubuntu/.test(ua))
        {
            this.os.name = 'Kubuntu';
            this.device.type = TYPE_DESKTOP;
        }

        if (/Mandriva Linux/.test(ua))
        {
            this.os.name = 'Mandriva';

            match = /Mandriva Linux\/[0-9\.\-]+mdv([0-9]+)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({'value': match[1]});
            }

            this.device.type = TYPE_DESKTOP;
        }

        if (/Mageia/.test(ua))
        {
            this.os.name = 'Mageia';

            match = /Mageia\/[0-9\.\-]+mga([0-9]+)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({'value': match[1]});
            }

            this.device.type = TYPE_DESKTOP;
        }

        if (/Mandriva/.test(ua))
        {
            this.os.name = 'Mandriva';

            match = /Mandriva\/[0-9\.\-]+mdv([0-9]+)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({'value': match[1]});
            }

            this.device.type = TYPE_DESKTOP;
        }

        if (/Red Hat/.test(ua))
        {
            this.os.name = 'Red Hat';

            match = /Red Hat[^\/]*\/[0-9\.\-]+el([0-9_]+)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({value: match[1].replace(/_/g, '.')});
            }

            this.device.type = TYPE_DESKTOP;
        }

        if (/Slackware/.test(ua))
        {
            this.os.name = 'Slackware';
            this.device.type = TYPE_DESKTOP;
        }

        if (/SUSE/.test(ua))
        {
            this.os.name = 'SUSE';
            this.device.type = TYPE_DESKTOP;
        }

        if (/Turbolinux/.test(ua))
        {
            this.os.name = 'Turbolinux';
            this.device.type = TYPE_DESKTOP;
        }

        if (/Ubuntu/.test(ua))
        {
            this.os.name = 'Ubuntu';

            match = /Ubuntu\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({'value': match[1]});
            }

            this.device.type = TYPE_DESKTOP;
        }
    }

    else if (/\(Ubuntu; (Mobile|Tablet)/.test(ua))
    {
        this.os.name = 'Ubuntu Touch';

        if (/\(Ubuntu; Mobile/.test(ua))
        {
            this.device.type = TYPE_MOBILE;
        }
        if (/\(Ubuntu; Tablet/.test(ua))
        {
            this.device.type = TYPE_TABLET;
        }
    }


    /****************************************************
     *        iOS
     */
    if (/iPhone/.test(ua) || /iPad/.test(ua) || /iPod/.test(ua))
    {
        this.os.name = 'iOS';
        this.os.version = new Version({value: '1.0'});

        match = /OS (.*) like Mac OS X/.exec(ua);
        if (match)
        {
            this.os.version = new Version({value: match[1].replace(/_/g, '.')});
        }

        if (/iPhone Simulator;/.test(ua))
        {
            this.device.type = TYPE_EMULATOR;
        }
        else
        {
            match = /(iPad|iPhone( 3GS| 3G| 4S| 4| 5)?|iPod( touch)?)/.exec(ua);
            if (match)
            {
                device = DeviceModels.identify('ios', match[0]);
                if (device)
                {
                    this.device = device;
                }
            }


            match = /(iPad|iPhone|iPod)[0-9],[0-9]/.exec(ua);
            if (match)
            {
                device = DeviceModels.identify('ios', match[0]);

                if (device)
                {
                    this.device = device;
                }
            }
        }
    }


    /****************************************************
     *        OS X
     */
    else if (/Mac OS X/.test(ua))
    {
        this.os.name = 'Mac OS X';

        match = /Mac OS X (10[0-9\._]*)/.exec(ua);
        if (match)
        {
            this.os.version = new Version({value: match[1].replace(/_/g, '.')});
        }

        this.device.type = TYPE_DESKTOP;
    }


    /****************************************************
     *        Windows
     */
    if (/Windows/.test(ua))
    {
        this.os.name = 'Windows';
        this.device.type = TYPE_DESKTOP;


        match = /Windows NT ([0-9]\.[0-9])/.exec(ua);
        if (match)
        {
            this.os.version = new Version({ 'value': match[1] });

            switch (match[1])
            {
                case '6.3':
                    if (/; ARM;/.test(ua))
                    {
                        this.os.version = new Version({ value: match[1], alias: 'RT 8.1' });
                    }
                    else
                    {
                        this.os.version = new Version({ value: match[1], alias: '8.1' });
                    }
                    break;

                case '6.2':
                    if (/; ARM;/.test(ua))
                    {
                        this.os.version = new Version({ value: match[1], alias: 'RT' });
                    }
                    else
                    {
                        this.os.version = new Version({ value: match[1], alias: '8' });
                    }
                    break;

                case '6.1':
                    this.os.version = new Version({ value: match[1], alias: '7' });
                    break;
                case '6.0':
                    this.os.version = new Version({ value: match[1], alias: 'Vista' });
                    break;
                case '5.2':
                    this.os.version = new Version({ value: match[1], alias: 'Server 2003' });
                    break;
                case '5.1':
                    this.os.version = new Version({ value: match[1], alias: 'XP' });
                    break;
                case '5.0':
                    this.os.version = new Version({ value: match[1], alias: '2000' });
                    break;
                default:
                    this.os.version = new Version({ value: match[1], alias: 'NT ' + match[1] });
                    break;
            }
        }

        if (/Windows 95/.test(ua) || /Win95/.test(ua) || /Win 9x 4.00/.test(ua))
        {
            this.os.version = new Version({ value: '4.0', alias: '95' });
        }

        if (/Windows 98/.test(ua) || /Win98/.test(ua) || /Win 9x 4.10/.test(ua))
        {
            this.os.version = new Version({ value: '4.1', alias: '98' });
        }

        if (/Windows ME/.test(ua) || /WinME/.test(ua) || /Win 9x 4.90/.test(ua))
        {
            this.os.version = new Version({ value: '4.9', alias: 'ME' } );
        }

        if (/Windows XP/.test(ua) || /WinXP/.test(ua))
        {
            this.os.version = new Version({ value: '5.1', alias: 'XP' } );
        }

        if (/WPDesktop/.test(ua))
        {
            this.os.name = 'Windows Phone';
            this.os.version = new Version({ value: '8', details: 1 });
            this.device.type = TYPE_MOBILE;
        }

        if (/WP7/.test(ua))
        {
            this.os.name = 'Windows Phone';
            this.os.version = new Version({ value: '7', details: 1 });
            this.device.type = TYPE_MOBILE;
            this.browser.mode = 'desktop';
        }

        if (/Windows CE/.test(ua) || /WinCE/.test(ua) || /WindowsCE/.test(ua))
        {
            if (/ IEMobile/.test(ua))
            {
                this.os.name = 'Windows Mobile';

                if (/ IEMobile 8/.test(ua))
                {
                    this.os.version = new Version({ value: '6.5', details: 2 });
                }

                if (/ IEMobile 7/.test(ua))
                {
                    this.os.version = new Version({ value: '6.1', details: 2 });
                }

                if (/ IEMobile 6/.test(ua))
                {
                    this.os.version = new Version({ value: '6.0', details: 2 });
                }
            }
            else
            {
                this.os.name = 'Windows CE';

                match = /WindowsCEOS\/([0-9.]*)/.exec(ua);
                if (match)
                {
                    this.os.version = new Version({ value: match[1], details: 2 });
                }

                match = /Windows CE ([0-9.]*)/.exec(ua);
                if (match)
                {
                    this.os.version = new Version({ value: match[1], details: 2 });
                }
            }

            this.device.type = TYPE_MOBILE;
        }

        if (/Windows ?Mobile/.test(ua))
        {
            this.os.name = 'Windows Mobile';
            this.device.type = TYPE_MOBILE;
        }


        match = /WindowsMobile\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.os.name = 'Windows Mobile';
            this.os.version = new Version({ value: match[1], details: 2 });
            this.device.type = TYPE_MOBILE;
        }

        if (/Windows Phone/.test(ua))
        {
            this.os.name = 'Windows Phone';
            this.device.type = TYPE_MOBILE;


            match = /Windows Phone (?:OS )?([0-9.]*)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({ value: match[1], details: 2 });

                if (parseInt(match[1], 10) < 7)
                {
                    this.os.name = 'Windows Mobile';
                }
            }


            match = /IEMobile\/[^;]+;(?: ARM; Touch; )?\s*([^;\s][^;]*);\s*([^;\)\s][^;\)]*)[;|\)]/.exec(ua);
            if (match)
            {
                this.device.manufacturer = match[1];
                this.device.model = match[2];
                this.device.identified |= ID_PATTERN;

                device = DeviceModels.identify('wp', match[2]);
                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.device = device;
                }
            }


            match = /WPDesktop; \s*([^;\s][^;]*);\s*([^;\)\s][^;\)]*)[;|\)]/.exec(ua);
            if (match)
            {
                this.device.manufacturer = match[1];
                this.device.model = match[2];
                this.device.identified |= ID_PATTERN;

                device = DeviceModels.identify('wp', match[2]);
                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.device = device;
                }
            }

            if (!!this.device.manufacturer && !!this.device.model)
            {
                if (this.device.manufacturer === 'ARM' && this.device.model === 'Touch')
                {
                    this.device.manufacturer = null;
                    this.device.model = null;
                    this.device.identified = ID_NONE;
                }

                if (this.device.manufacturer === 'Microsoft' && this.device.model === 'XDeviceEmulator')
                {
                    this.device.manufacturer = null;
                    this.device.model = null;
                    this.device.type = TYPE_EMULATOR;
                    this.device.identified |= ID_MATCH_UA;
                }
            }
        }
    }


    /****************************************************
     *        Android
     */
    if (/Android/.test(ua))
    {
        this.os.name = 'Android';
        this.os.version = new Version();

        match = /Android(?: )?(?:AllPhone_|CyanogenMod_|OUYA )?(?:\/)?v?([0-9.]+)/.exec(ua.replace('-update', ','));
        if (match)
        {
            this.os.version = new Version({ 'value': match[1], 'details': 3 });
        }

        match = /Android [0-9][0-9].[0-9][0-9].[0-9][0-9]\(([^)]+)\);/.exec(ua.replace('-update', ','));
        if (match)
        {
            this.os.version = new Version({ 'value': match[1], 'details': 3 });
        }

        if (/Android Eclair/.test(ua))
        {
            this.os.version = new Version({ 'value': '2.0', 'details': 3 });
        }

        if (/Android KeyLimePie/.test(ua))
        {
            this.os.version = new Version({ 'value': '4.4', 'details': 3 });
        }

        this.device.type = TYPE_MOBILE;
        if (this.os.version.toFloat() >= 3)
        {
            this.device.type = TYPE_TABLET;
        }
        if (this.os.version.toFloat() >= 4 && /Mobile/.test(ua))
        {
            this.device.type = TYPE_MOBILE;
        }


        match = /Eclair; (?:[a-zA-Z][a-zA-Z](?:[\-_][a-zA-Z][a-zA-Z])?) Build\/([^\/]*)\//.exec(ua);
        if (match)
        {
            this.device.model = match[1];
        }

        else if((match = /; ?([^;]*[^;\s])\s+Build/.exec(ua)))
        {
            this.device.model = match[1];
        }

        else if((match = /[a-zA-Z][a-zA-Z](?:[\-_][a-zA-Z][a-zA-Z])?; ([^;]*[^;\s]);\s+Build/.exec(ua)))
        {
            this.device.model = match[1];
        }

        else if((match = /\(([^;]+);U;Android\/[^;]+;[0-9]+\*[0-9]+;CTC\/2.0\)/.exec(ua)))
        {
            this.device.model = match[1];
        }

        else if((match = /;\s?([^;]+);\s?[0-9]+\*[0-9]+;\s?CTC\/2.0/.exec(ua)))
        {
            this.device.model = match[1];
        }

        else if((match = /Android [^;]+; (?:[a-zA-Z][a-zA-Z](?:[\-_][a-zA-Z][a-zA-Z])?; )?([^)]+)\)/.exec(ua)))
        {
            if (!/[a-zA-Z][a-zA-Z](?:[\-_][a-zA-Z][a-zA-Z])?/.test(ua))
            {
                this.device.model = match[1];
            }
        }

        /* Sometimes we get a model name that starts with Android, in that case it is a mismatch and we should ignore it */
        if (!!this.device.model && this.device.model.substr(0, 7) === 'Android')
        {
            this.device.model = null;
        }

        if (!!this.device.model && this.device.model)
        {
            this.device.identified |= ID_PATTERN;

            device = DeviceModels.identify('android', this.device.model);
            if (device.identified)
            {
                device.identified |= this.device.identified;
                this.device = device;
            }
        }

        if (/HP eStation/.test(ua))
        {
            this.device.manufacturer = 'HP';
            this.device.model = 'eStation';
            this.device.type = TYPE_TABLET;
            this.device.identified |= ID_MATCH_UA;
        }
        if (/Pre\/1.0/.test(ua))
        {
            this.device.manufacturer = 'Palm';
            this.device.model = 'Pre';
            this.device.identified |= ID_MATCH_UA;
        }
        if (/Pre\/1.1/.test(ua))
        {
            this.device.manufacturer = 'Palm';
            this.device.model = 'Pre Plus';
            this.device.identified |= ID_MATCH_UA;
        }
        if (/Pre\/1.2/.test(ua))
        {
            this.device.manufacturer = 'Palm';
            this.device.model = 'Pre 2';
            this.device.identified |= ID_MATCH_UA;
        }
        if (/Pre\/3.0/.test(ua))
        {
            this.device.manufacturer = 'HP';
            this.device.model = 'Pre 3';
            this.device.identified |= ID_MATCH_UA;
        }
        if (/Pixi\/1.0/.test(ua))
        {
            this.device.manufacturer = 'Palm';
            this.device.model = 'Pixi';
            this.device.identified |= ID_MATCH_UA;
        }
        if (/Pixi\/1.1/.test(ua))
        {
            this.device.manufacturer = 'Palm';
            this.device.model = 'Pixi Plus';
            this.device.identified |= ID_MATCH_UA;
        }
        if (/P160UN?A?\/1.0/.test(ua))
        {
            this.device.manufacturer = 'HP';
            this.device.model = 'Veer';
            this.device.identified |= ID_MATCH_UA;
        }
    }



    /****************************************************
     *        Aliyun OS
     */

    if (/Aliyun/.test(ua) || /YunOs/i.test(ua))
    {
        this.os.name = 'Aliyun OS';
        this.os.version = new Version();

        match = /YunOs[ \/]([0-9.]+)/i.exec(ua);
        if (match)
        {
            this.os.version = new Version({ 'value': match[1], 'details': 3 });
        }

        match = /AliyunOS ([0-9.]+)/.exec(ua);
        if (match)
        {
            this.os.version = new Version({ 'value': match[1], 'details': 3 });
        }

        this.device.type = TYPE_MOBILE;

        match = /; ([^;]*[^;\s])\s+Build/.exec(ua);
        if (match)
        {
            this.device.model = match[1];
        }

        if (this.device.model)
        {
            this.device.identified |= ID_PATTERN;

            device = DeviceModels.identify('android', this.device.model);
            if (device.identified)
            {
                device.identified |= this.device.identified;
                this.device = device;
            }
        }
    }

        if (/Android/.test(ua))
        {
            match = /Android v(1.[0-9][0-9])_[0-9][0-9].[0-9][0-9]-/.exec(ua);
            if (match)
            {
                this.os.name = 'Aliyun OS';
                this.os.version = new Version({ 'value': match[1], 'details': 3 });
            }

            match = /Android (1.[0-9].[0-9].[0-9]+)-R?T/.exec(ua);
            if (match)
            {
                this.os.name = 'Aliyun OS';
                this.os.version = new Version({ 'value': match[1], 'details': 3 });
            }

            match = /Android ([12].[0-9].[0-9]+)-R-20[0-9]+/.exec(ua);
            if (match)
            {
                this.os.name = 'Aliyun OS';
                this.os.version = new Version({ 'value': match[1], 'details': 3 });
            }

            match = /Android 20[0-9]+/.exec(ua);
            if (match)
            {
                this.os.name = 'Aliyun OS';
                this.os.version = null;
            }
        }



        /****************************************************
         *        Baidu Yi
         */

        if (/Baidu Yi/.test(ua))
        {
            this.os.name = 'Baidu Yi';
            this.os.version = null;
        }




        /****************************************************
         *        Google TV
         */

        if (/GoogleTV/.test(ua))
        {
            this.os.name = 'Google TV';

            /*
            if (/Chrome\/5./.test(ua))
            {
                this.os.version = new Version({ 'value': '1' });
            }

            if (/Chrome\/11./.test(ua))
            {
                this.os.version = new Version({ 'value': '2' });
            }
            */

            this.device.type = TYPE_TELEVISION;

            match = /GoogleTV [0-9\.]+; ?([^;]*[^;\s])\s+Build/.exec(ua);
            if (match)
            {
                this.device.model = match[1];
            }

            if (!!this.device.model && this.device.model)
            {
                this.device.identified |= ID_PATTERN;

                device = DeviceModels.identify('android', this.device.model);
                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.device = device;
                }
            }
        }


        /****************************************************
         *        Chromecast
         */

        if (/CrKey/.test(ua))
        {
            this.device.manufacturer = 'Google';
            this.device.model = 'Chromecast';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }


        /****************************************************
         *        WoPhone
         */

        if (/WoPhone/.test(ua))
        {
            this.os.name = 'WoPhone';

            match = /WoPhone\/([0-9\.]*)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({ 'value': match[1] });
            }

            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        BlackBerry
         */

        if (/BlackBerry/.test(ua) && !/BlackBerry Runtime for Android Apps/.test(ua))
        {
            this.os.name = 'BlackBerry OS';

            this.device.model = 'BlackBerry';
            this.device.manufacturer = 'RIM';
            this.device.type = TYPE_MOBILE;
            this.device.identified = ID_NONE;

            if (!/Opera/.test(ua))
            {
                match = /BlackBerry([0-9]*)\/([0-9.]*)/.exec(ua);
                if (match)
                {
                    this.device.model = match[1];
                    this.os.version = new Version({ 'value': match[2], 'details': 2 });
                }

                match = /; BlackBerry ([0-9]*);/.exec(ua);
                if (match)
                {
                    this.device.model = match[1];
                }

                match = /; ([0-9]+)[^;\)]+\)/.exec(ua);
                if (match)
                {
                    this.device.model = match[1];
                }

                match = /Version\/([0-9.]*)/.exec(ua);
                if (match)
                {
                    this.os.version = new Version({ 'value': match[1], 'details': 2 });
                }

                if (this.os.version.toFloat() >= 10)
                {
                    this.os.name = 'BlackBerry';
                }

                if (this.device.model)
                {
                    device = DeviceModels.identify('blackberry', this.device.model);

                    if (device.identified)
                    {
                        device.identified |= this.device.identified;
                        this.device = device;
                    }
                }
            }
        }

        match = /\(BB(1[^;]+); ([^\)]+)\)/.exec(ua);
        if (match)
        {
            this.os.name = 'BlackBerry';
            this.os.version = new Version({ 'value': match[1], 'details': 2 });

            this.device.manufacturer = 'BlackBerry';
            this.device.model = match[2];

            if (this.device.model === 'Kbd')
            {
                this.device.model = 'Q series';
            }

            if (this.device.model === 'Touch')
            {
                this.device.model = 'A or Z series';
            }

            this.device.type = /Mobile/.test(ua) ? TYPE_MOBILE : TYPE_TABLET;
            this.device.identified |= ID_MATCH_UA;

            match = /Version\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({ 'value': match[1], 'details': 2 });
            }
        }

        /****************************************************
         *        BlackBerry PlayBook
         */

        match = /RIM Tablet OS ([0-9.]*)/.exec(ua);
        if (match)
        {
            this.os.name = 'BlackBerry Tablet OS';
            this.os.version = new Version({ 'value': match[1], 'details': 2 });

            this.device.manufacturer = 'RIM';
            this.device.model = 'BlackBerry PlayBook';
            this.device.type = TYPE_TABLET;
            this.device.identified |= ID_MATCH_UA;
        }

        else if (/\(PlayBook;/.test(ua) && (match = /PlayBook Build\/([0-9.]*)/.exec(ua)))
        {
            this.os.name = 'BlackBerry Tablet OS';
            this.os.version = new Version({ 'value': match[1], 'details': 2 });

            this.device.manufacturer = 'RIM';
            this.device.model = 'BlackBerry PlayBook';
            this.device.type = TYPE_TABLET;
            this.device.identified |= ID_MATCH_UA;
        }

        else if (/PlayBook/.test(ua) && !/Android/.test(ua))
        {
            match = /Version\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.os.name = 'BlackBerry Tablet OS';
                this.os.version = new Version({ 'value': match[1], 'details': 2 });

                this.device.manufacturer = 'RIM';
                this.device.model = 'BlackBerry PlayBook';
                this.device.type = TYPE_TABLET;
                this.device.identified |= ID_MATCH_UA;
            }
        }


        /****************************************************
         *        WebOS
         */

        match = /(?:web|hpw)OS\/(?:HP webOS )?([0-9.]*)/.exec(ua);
        if (match)
        {
            this.os.name = 'webOS';
            this.os.version = new Version({ 'value': match[1], 'details': 2 });
            this.device.type = /Tablet/i.test(ua) ? TYPE_TABLET : TYPE_MOBILE;

            if (/Pre\/1.0/.test(ua))
            {
                this.device.model = 'Pre';
            }
            if (/Pre\/1.1/.test(ua))
            {
                this.device.model = 'Pre Plus';
            }
            if (/Pre\/1.2/.test(ua))
            {
                this.device.model = 'Pre 2';
            }
            if (/Pre\/3.0/.test(ua))
            {
                this.device.model = 'Pre 3';
            }
            if (/Pixi\/1.0/.test(ua))
            {
                this.device.model = 'Pixi';
            }
            if (/Pixi\/1.1/.test(ua))
            {
                this.device.model = 'Pixi Plus';
            }
            if (/P160UN?A?\/1.0/.test(ua))
            {
                this.device.model = 'Veer';
            }
            if (/TouchPad\/1.0/.test(ua))
            {
                this.device.model = 'TouchPad';
            }
            if (!!this.device.model)
            {
                this.device.manufacturer = /hpwOS/.test(ua) ? 'HP' : 'Palm';
            }

            if (/Emulator\//.test(ua) || /Desktop\//.test(ua))
            {
                this.device.type = TYPE_EMULATOR;
                this.device.manufacturer = null;
                this.device.model = null;
            }

            this.device.identified |= ID_MATCH_UA;
        }

        match = /elite\/fzz/.exec(ua);
        if (match)
        {
            this.os.name = 'webOS';
        }

        if (/Web[0O]S/.test(ua) && /Large Screen/.test(ua))
        {
            this.os.name = 'webOS';
            this.device.type = 'television';
        }


        /****************************************************
         *        S80
         */

        match = /Series80\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.os.name = 'Series80';
            this.os.version = new Version({ 'value': match[1] });

            match = /Nokia([^\/;\)]+)[\/|;|\)]/.exec(ua);
            if (match)
            {
                if (match[1] !== 'Browser')
                {
                    this.device.manufacturer = 'Nokia';
                    this.device.model = DeviceModels.cleanup(match[1]);
                    this.device.identified |= ID_PATTERN;
                }
            }
        }


        /****************************************************
         *        S60
         */

        if (/Symbian/.test(ua) || /Series[ ]?60/.test(ua) || /S60;/.test(ua) || /S60V/.test(ua))
        {
            this.os.name = 'Series60';

            if (/SymbianOS\/9.1/.test(ua) && !/Series60/.test(ua))
            {
                this.os.version = new Version({ 'value': '3.0' });
            }

            match = /Series60\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({ 'value': match[1] });
            }

            match = /S60V([0-9.]*)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({ 'value': match[1] });
            }

            match = /Nokia([^\/;\)]+)[\/|;|\)]/.exec(ua);
            if (match)
            {
                if (match[1] !== 'Browser')
                {
                    this.device.manufacturer = 'Nokia';
                    this.device.model = DeviceModels.cleanup(match[1]);
                    this.device.identified |= ID_PATTERN;
                }
            }

            match = /Symbian; U; (?:Nokia)?([^;]+); [a-z][a-z]\-[a-z][a-z]/.exec(ua);
            if (match)
            {
                this.device.manufacturer = 'Nokia';
                this.device.model = DeviceModels.cleanup(match[1]);
                this.device.identified |= ID_PATTERN;
            }

            match = /Vertu([^\/;]+)[\/|;]/.exec(ua);
            if (match)
            {
                this.device.manufacturer = 'Vertu';
                this.device.model = DeviceModels.cleanup(match[1]);
                this.device.identified |= ID_PATTERN;
            }

            match = /Samsung\/([^;]*);/.exec(ua);
            if (match)
            {
                this.device.manufacturer = 'Samsung';
                this.device.model = DeviceModels.cleanup(match[1]);
                this.device.identified |= ID_PATTERN;
            }

            if (!!this.device.model)
            {
                device = DeviceModels.identify('s60', this.device.model);
                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.device = device;
                }
            }

            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        S40
         */

        if (/Series40/.test(ua))
        {
            this.os.name = 'Series40';

            match = /Nokia([^\/]+)\//.exec(ua);
            if (match)
            {
                this.device.manufacturer = 'Nokia';
                this.device.model = DeviceModels.cleanup(match[1]);
                this.device.identified |= ID_PATTERN;
            }

            if (!!this.device.model)
            {
                device = DeviceModels.identify('s40', this.device.model);
                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.device = device;
                }
            }

            if (!!this.device.model)
            {
                device = DeviceModels.identify('asha', this.device.model);
                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.os.name = 'Nokia Asha Platform';
                    this.device = device;
                }
            }

            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        MeeGo
         */

        if (/MeeGo/.test(ua))
        {
            this.os.name = 'MeeGo';
            this.device.type = TYPE_MOBILE;

            match = /Nokia([^\)]+)\)/.exec(ua);
            if (match)
            {
                this.device.manufacturer = 'Nokia';
                this.device.model = DeviceModels.cleanup(match[1]);
                this.device.identified |= ID_PATTERN;
            }
        }

        /****************************************************
         *        Maemo
         */

        if (/Maemo/.test(ua))
        {
            this.os.name = 'Maemo';
            this.device.type = TYPE_MOBILE;

            match = /(N[0-9]+)/.exec(ua);
            if (match)
            {
                this.device.manufacturer = 'Nokia';
                this.device.model = match[1];
                this.device.identified |= ID_PATTERN;
            }
        }

        /****************************************************
         *        Tizen
         */

        if (/Tizen/.test(ua))
        {
            this.os.name = 'Tizen';

            match = /Tizen[\/ ]([0-9.]*)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({ 'value': match[1] });
            }

            this.device.type = TYPE_MOBILE;

            match = /\(([^;]+); ([^\/]+)\//.exec(ua);
            if (match)
            {
                if (match[1] !== 'Linux' && match[1] !== 'Tizen')
                {
                    this.device.manufacturer = match[1];
                    this.device.model = match[2];
                    this.device.identified = ID_PATTERN;

                    device = DeviceModels.identify('tizen', match[2]);

                    if (device.identified)
                    {
                        device.identified |= this.device.identified;
                        this.device = device;
                    }
                }
            }

            match = /\s*([^;]+);\s+([^;\)]+)\)/.exec(ua);
            if (match)
            {
                if (match[1] !== 'U' && match[2].substr(0, 5) !== 'Tizen')
                {
                    this.device.model = match[2];
                    this.device.identified = ID_PATTERN;

                    device = DeviceModels.identify('tizen', match[2]);

                    if (device.identified)
                    {
                        device.identified |= this.device.identified;
                        this.device = device;
                    }
                }
            }
        }

        /****************************************************
         *        Jolla Sailfish
         */

        if (/Jolla; Sailfish;/.test(ua))
        {
            this.os.name = 'Sailfish';
            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        Bada
         */

        if (/[b|B]ada/.test(ua))
        {
            this.os.name = 'Bada';

            match = /[b|B]ada[\/ ]([0-9.]*)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({ 'value': match[1], 'details': 2 });
            }

            this.device.type = TYPE_MOBILE;

            match = /\(([^;]+); ([^\/]+)\//.exec(ua);
            if (match)
            {
                if (match[1] !== 'Bada')
                {
                    this.device.manufacturer = match[1];
                    this.device.model = match[2];
                    this.device.identified = ID_PATTERN;

                    device = DeviceModels.identify('bada', match[2]);

                    if (device.identified)
                    {
                        device.identified |= this.device.identified;
                        this.device = device;
                    }
                }
            }
        }

        /****************************************************
         *        Brew
         */

        if (/BREW/i.test(ua) || /BMP( [0-9.]*)?; U/.test(ua) || /BMP\/([0-9.]*)/.test(ua))
        {
            this.os.name = 'Brew';

            match = /BREW; U; ([0-9.]*)/i.exec(ua);
            if (match)
            {
                this.os.version = new Version({ 'value': match[1] });
            }

            else if((match = /BREW MP ([0-9.]*)/i.exec(ua)))
            {
                this.os.version = new Version({ 'value': match[1] });
            }

            else if((match = /;BREW[\/ ]([0-9.]*)/i.exec(ua)))
            {
                this.os.version = new Version({ 'value': match[1] });
            }

            else if((match = /BMP( [0-9.]*)?; U/i.exec(ua)))
            {
                this.os.version = new Version({ 'value': match[1] });
            }

            else if((match = /BMP\/([0-9.]*)/i.exec(ua)))
            {
                this.os.version = new Version({ 'value': match[1] });
            }


            this.device.type = TYPE_MOBILE;

            match = /\(([^;]+);U;REX\/[^;]+;BREW\/[^;]+;(?:.*;)?[0-9]+\*[0-9]+;CTC\/2.0\)/.exec(ua);
            if (match)
            {
                this.device.model = match[1];
                this.device.identified = ID_PATTERN;

                device = DeviceModels.identify('brew', match[1]);

                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.device = device;
                }
            }
        }

        /****************************************************
         *        MTK
         */

        if (/\(MTK;/.test(ua))
        {
            this.os.name = 'MTK';
            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        MAUI Runtime
         */

        if (/\(MAUI Runtime;/.test(ua))
        {
            this.os.name = 'MAUI Runtime';
            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        VRE
         */

        if (/\(VRE;/.test(ua))
        {
            this.os.name = 'VRE';
            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        SpreadTrum
         */

        if (/\(SpreadTrum;/.test(ua))
        {
            this.os.name = 'SpreadTrum';
            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        ThreadX
         */

        match = /ThreadX_OS\/([0-9.]*)/i.exec(ua);
        if (match)
        {
            this.os.name = 'ThreadX';
            this.os.version = new Version({ 'value': match[1] });
        }

        /****************************************************
         *        COS
         */

        match = /COS like Android/i.exec(ua);
        if (match)
        {
            this.os.name = 'COS';
            this.os.version = null;
        }

        match = /COSBrowser\/([0-9.]*)/i.exec(ua);
        if (match)
        {
            this.os.name = 'COS';
            this.os.version = new Version({ 'value': match[1], 'details': 2 });
        }

        match = /\(Chinese Operating System ([0-9.]*);/i.exec(ua);
        if (match)
        {
            this.os.name = 'COS';
            this.os.version = new Version({ 'value': match[1], 'details': 2 });
        }

        match = /\(COS ([0-9.]*);/i.exec(ua);
        if (match)
        {
            this.os.name = 'COS';
            this.os.version = new Version({ 'value': match[1], 'details': 2 });
        }

        match = /\(COS;/i.exec(ua);
        if (match)
        {
            this.os.name = 'COS';
        }


        /****************************************************
         *        CrOS
         */

        if (/CrOS/.test(ua))
        {
            this.os.name = 'Chrome OS';
            this.device.type = TYPE_DESKTOP;
        }

        /****************************************************
         *        Joli OS
         */

        match = /Joli OS\/([0-9.]*)/i.exec(ua);
        if (match)
        {
            this.os.name = 'Joli OS';
            this.os.version = new Version({ 'value': match[1] });
            this.device.type = TYPE_DESKTOP;
        }

        /****************************************************
         *        BeOS
         */

        if (/BeOS/.test(ua))
        {
            this.os.name = 'BeOS';
            this.device.type = TYPE_DESKTOP;
        }

        /****************************************************
         *        Haiku
         */

        if (/Haiku/.test(ua))
        {
            this.os.name = 'Haiku';
            this.device.type = TYPE_DESKTOP;
        }

        /****************************************************
         *        QNX
         */

        if (/QNX/.test(ua))
        {
            this.os.name = 'QNX';
            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        OS/2 Warp
         */

        match = /OS\/2; (?:U; )?Warp ([0-9.]*)/i.exec(ua);
        if (match)
        {
            this.os.name = 'OS/2 Warp';
            this.os.version = new Version({ 'value': match[1] });
            this.device.type = TYPE_DESKTOP;
        }

        /****************************************************
         *        Grid OS
         */

        match = /Grid OS ([0-9.]*)/i.exec(ua);
        if (match)
        {
            this.os.name = 'Grid OS';
            this.os.version = new Version({ 'value': match[1] });
            this.device.type = TYPE_TABLET;
        }

        /****************************************************
         *        AmigaOS
         */

        match = /AmigaOS ([0-9.]*)/i.exec(ua);
        if (match)
        {
            this.os.name = 'AmigaOS';
            this.os.version = new Version({ 'value': match[1] });
            this.device.type = TYPE_DESKTOP;
        }

        /****************************************************
         *        MorphOS
         */

        match = /MorphOS ([0-9.]*)/i.exec(ua);
        if (match)
        {
            this.os.name = 'MorphOS';
            this.os.version = new Version({ 'value': match[1] });
            this.device.type = TYPE_DESKTOP;
        }

        /****************************************************
         *        AROS
         */

        match = /AROS/.exec(ua);
        if (match)
        {
            this.os.name = 'AROS';
            this.device.type = TYPE_DESKTOP;
        }

        /****************************************************
         *        Kindle
         */

        if (/Kindle/.test(ua) && !/Fire/.test(ua))
        {
            this.os.name = '';

            this.device.manufacturer = 'Amazon';
            this.device.model = 'Kindle';
            this.device.type = TYPE_EREADER;

            if (/Kindle\/2.0/.test(ua))
            {
                this.device.model = 'Kindle 2';
            }
            if (/Kindle\/3.0/.test(ua))
            {
                this.device.model = 'Kindle 3 or later';
            }

            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        NOOK
         */

        if (/nook browser/.test(ua))
        {
            this.os.name = 'Android';

            this.device.manufacturer = 'Barnes & Noble';
            this.device.model = 'NOOK';
            this.device.type = TYPE_EREADER;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        Bookeen
         */

        if (/bookeen\/cybook/.test(ua))
        {
            this.os.name = '';

            this.device.manufacturer = 'Bookeen';
            this.device.model = 'Cybook';
            this.device.type = TYPE_EREADER;

            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        Kobo Reader
         */

        match = /Kobo Touch/.exec(ua);
        if (match)
        {
            this.os.name = '';
            this.os.version = null;

            this.device.manufacturer = 'Kobo';
            this.device.model = 'eReader';
            this.device.type = TYPE_EREADER;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        Sony Reader
         */

        match = /EBRD([0-9]+)/.exec(ua);
        if (match)
        {
            this.os.name = '';


            this.device.manufacturer = 'Sony';
            this.device.model = 'Reader';
            this.device.type = TYPE_EREADER;
            this.device.identified |= ID_MATCH_UA;

            switch (match[1])
            {
                case '1101':
                    this.device.model = 'Reader PRS-T1';
                    break;
                case '1102':
                    this.device.model = 'Reader PRS-T1';
                    break;
                case '1201':
                    this.device.model = 'Reader PRS-T2';
                    break;
                case '1301':
                    this.device.model = 'Reader PRS-T3';
                    break;
            }
        }

        /****************************************************
         *        iRiver
         */

        if (/Iriver ;/.test(ua))
        {
            this.os.name = '';

            this.device.manufacturer = 'iRiver';
            this.device.model = 'Story';
            this.device.type = TYPE_EREADER;

            if (/EB07/.test(ua))
            {
                this.device.model = 'Story HD EB07';
            }

            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        Tesla Model S in-car browser
         */

        if (/QtCarBrowser/.test(ua))
        {
            this.os.name = '';

            this.device.manufacturer = 'Tesla';
            this.device.model = 'Model S';
            this.device.type = TYPE_CAR;
            this.device.identified |= ID_MATCH_UA;
        }


        /****************************************************
         *        Nintendo
         *
         *        Opera/9.30 (Nintendo Wii; U; ; 3642; en)
         *        Opera/9.30 (Nintendo Wii; U; ; 2047-7; en)
         *        Opera/9.50 (Nintendo DSi; Opera/507; U; en-US)
         *        Mozilla/5.0 (Nintendo 3DS; U; ; en) Version/1.7455.US
         *        Mozilla/5.0 (Nintendo 3DS; U; ; en) Version/1.7455.EU
         *
         *        Mozilla/5.0 (Nintendo WiiU) AppleWebKit/534.52 (KHTML, like Gecko) NX/2.1.0.8.8 Version/1.0.0.6760.JP
         *        Mozilla/5.0 (Nintendo WiiU) AppleWebKit/534.53 (KHTML, like Gecko) NWF/1.2.0.USA
         *        Mozilla/5.0 (Nintendo WiiU) AppleWebKit/534.53 (KHTML, like Gecko) NWF/1.2.13993.USA
         *        Mozilla/5.0 (Nintendo WiiU) AppleWebKit/534.53 (KHTML, like Gecko) NWF/1.3.0.USA
         *        Mozilla/5.0 (Nintendo WiiU) AppleWebKit/534.52 (KHTML, like Gecko) NX/2.1.0.10.9 NintendoBrowser/1.5.0.8047.EU
         *        Mozilla/5.0 (Nintendo WiiU) AppleWebKit/536.28 (KHTML, like Gecko) NX/3.0.3.11.12 NintendoBrowser/2.0.0.9098.JP
         *        Mozilla/5.0 (Nintendo WiiU) AppleWebKit/536.28 (KHTML, like Gecko) NX/3.0.3.12.6 NintendoBrowser/2.0.0.9362.EU
         */

        if (/Nintendo Wii/.test(ua))
        {
            this.os.name = '';

            this.device.manufacturer = 'Nintendo';
            this.device.model = 'Wii';
            this.device.type = TYPE_GAMING;
            this.device.identified |= ID_MATCH_UA;
        }

        if (/Nintendo Wii ?U/.test(ua))
        {
            this.os.name = '';

            this.device.manufacturer = 'Nintendo';
            this.device.model = 'Wii U';
            this.device.type = TYPE_GAMING;
            this.device.identified |= ID_MATCH_UA;
        }

        if (/Nintendo DSi/.test(ua))
        {
            this.os.name = '';

            this.device.manufacturer = 'Nintendo';
            this.device.model = 'DSi';
            this.device.type = TYPE_GAMING;
            this.device.identified |= ID_MATCH_UA;
        }

        if (/Nintendo 3DS/.test(ua))
        {
            this.os.name = '';

            match = /Version\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({ 'value': match[1] });
            }

            this.device.manufacturer = 'Nintendo';
            this.device.model = '3DS';
            this.device.type = TYPE_GAMING;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        Sony Playstation
         *
         *        Mozilla/4.0 (PSP (PlayStation Portable); 2.00)
         *
         *        Mozilla/5.0 (PlayStation Vita 1.00) AppleWebKit/531.22.8 (KHTML, like Gecko) Silk/3.2
         *        Mozilla/5.0 (PlayStation Vita 1.50) AppleWebKit/531.22.8 (KHTML, like Gecko) Silk/3.2
         *        Mozilla/5.0 (PlayStation Vita 1.51) AppleWebKit/531.22.8 (KHTML, like Gecko) Silk/3.2
         *        Mozilla/5.0 (PlayStation Vita 1.52) AppleWebKit/531.22.8 (KHTML, like Gecko) Silk/3.2
         *        Mozilla/5.0 (PlayStation Vita 1.60) AppleWebKit/531.22.8 (KHTML, like Gecko) Silk/3.2
         *        Mozilla/5.0 (PlayStation Vita 1.61) AppleWebKit/531.22.8 (KHTML, like Gecko) Silk/3.2
         *        Mozilla/5.0 (PlayStation Vita 1.80) AppleWebKit/531.22.8 (KHTML, like Gecko) Silk/3.2
         *
         *        Mozilla/5.0 (PLAYSTATION 3; 1.00)
         *        Mozilla/5.0 (PLAYSTATION 3; 2.00)
         *        Mozilla/5.0 (PLAYSTATION 3; 3.55)
         *        Mozilla/5.0 (PLAYSTATION 3 4.11) AppleWebKit/531.22.8 (KHTML, like Gecko)
         *        Mozilla/5.0 (PLAYSTATION 3 4.10) AppleWebKit/531.22.8 (KHTML, like Gecko)
         *
         *        Mozilla/5.0 (PlayStation 3) SonyComputerEntertainmentEurope/531.3 (NCell) NuantiMeta/2.0
         */

        if (/PlayStation Portable/.test(ua))
        {
            this.os.name = '';

            this.device.manufacturer = 'Sony';
            this.device.model = 'Playstation Portable';
            this.device.type = TYPE_GAMING;
            this.device.identified |= ID_MATCH_UA;
        }

        match = /PlayStation Vita ([0-9.]*)/.exec(ua);
        if (match)
        {
            this.os.name = '';
            this.os.version = new Version({ 'value': match[1] });

            this.device.manufacturer = 'Sony';
            this.device.model = 'Playstation Vita';
            this.device.type = TYPE_GAMING;
            this.device.identified |= ID_MATCH_UA;

            match = /VTE\//.exec(ua);
            if (match)
            {
                this.device.model = 'Playstation Vita TV';
            }
        }

        if (/PlayStation 3/i.test(ua))
        {
            this.os.name = '';

            match = /PLAYSTATION 3;? ([0-9.]*)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({ 'value': match[1] });
            }

            this.device.manufacturer = 'Sony';
            this.device.model = 'Playstation 3';
            this.device.type = TYPE_GAMING;
            this.device.identified |= ID_MATCH_UA;
        }

        if (/PlayStation 4/i.test(ua))
        {
            this.os.name = '';

            match = /PlayStation 4 ([0-9.]*)/.exec(ua);
            if (match)
            {
                this.os.version = new Version({ 'value': match[1] });
            }

            this.device.manufacturer = 'Sony';
            this.device.model = 'Playstation 4';
            this.device.type = TYPE_GAMING;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        XBox
         *
         *        Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; Xbox)
         *        Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; Xbox; Xbox One)
         */

        match = /Xbox\)$/.exec(ua);
        if (match)
        {
            this.os.name = '';
            this.os.version = null;

            this.device.manufacturer = 'Microsoft';
            this.device.model = 'Xbox 360';
            this.device.type = TYPE_GAMING;
            this.device.identified |= ID_MATCH_UA;

            if (this.browser.name === 'Mobile Internet Explorer')
            {
                this.browser.name = 'Internet Explorer';
            }
        }

        match = /Xbox One\)$/.exec(ua);
        if (match)
        {
            this.os.name = '';
            this.os.version = null;

            this.device.manufacturer = 'Microsoft';
            this.device.model = 'Xbox One';
            this.device.type = TYPE_GAMING;
            this.device.identified |= ID_MATCH_UA;

            if (this.browser.name === 'Mobile Internet Explorer')
            {
                this.browser.name = 'Internet Explorer';
            }
        }

        /****************************************************
         *        Kin
         *
         *        Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 6.12; en-US; KIN.One 1.0)
         *        Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 6.12; en-US; KIN.Two 1.0)
         */

        match = /KIN\.(One|Two) ([0-9.]*)/i.exec(ua);
        if (match)
        {
            this.os.name = 'Kin OS';
            this.os.version = new Version({ 'value': match[2], 'details': 2 });

            switch (match[1])
            {
                case 'One':
                    this.device.manufacturer = 'Microsoft';
                    this.device.model = 'Kin ONE';
                    this.device.identified |= ID_MATCH_UA;
                    break;

                case 'Two':
                    this.device.manufacturer = 'Microsoft';
                    this.device.model = 'Kin TWO';
                    this.device.identified |= ID_MATCH_UA;
                    break;
            }
        }

        /****************************************************
         *        Zune HD
         *
         *        Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 6.12; Microsoft ZuneHD 4.5)
         */

        if (/Microsoft ZuneHD/.test(ua))
        {
            this.os.name = '';
            this.os.version = null;

            this.device.manufacturer = 'Microsoft';
            this.device.model = 'Zune HD';
            this.device.type = TYPE_MEDIA;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        Panasonic Smart Viera
         *
         *        Mozilla/5.0 (FreeBSD; U; Viera; ja-JP) AppleWebKit/535.1 (KHTML, like Gecko) Viera/1.2.4 Chrome/14.0.835.202 Safari/535.1
         */

        if (/Viera/.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'Panasonic';
            this.device.model = 'Smart Viera';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }


        /****************************************************
         *        Sharp AQUOS TV
         *
         *        Mozilla/5.0 (DTV) AppleWebKit/531.2  (KHTML, like Gecko) AQUOSBrowser/1.0 (US00DTV;V;0001;0001)
         *        Mozilla/5.0 (DTV) AppleWebKit/531.2+ (KHTML, like Gecko) Espial/6.0.4 AQUOSBrowser/1.0 (CH00DTV;V;0001;0001)
         *        Opera/9.80 (Linux armv6l; U; en) Presto/2.8.115 Version/11.10 AQUOS-AS/1.0 LC-40LE835X
         */

        if (/AQUOSBrowser/.test(ua) || /AQUOS-AS/.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'Sharp';
            this.device.model = 'Aquos TV';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }


        /****************************************************
         *        Samsung Smart TV
         *
         *        Mozilla/5.0 (SmartHub; SMART-TV; U; Linux/SmartTV; Maple2012) AppleWebKit/534.7 (KHTML, like Gecko) SmartTV Safari/534.7
         *        Mozilla/5.0 (SmartHub; SMART-TV; U; Linux/SmartTV) AppleWebKit/531.2+ (KHTML, like Gecko) WebBrowser/1.0 SmartTV Safari/531.2+
         */

        if (/SMART-TV/.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'Samsung';
            this.device.model = 'Smart TV';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;

            match = /Maple([0-9]*)/.exec(ua);
            if (match)
            {
                this.device.model += ' ' + match[1];
            }
        }


        /****************************************************
         *        Sony Internet TV
         *
         *        Opera/9.80 (Linux armv7l; U; InettvBrowser/2.2(00014A;SonyDTV115;0002;0100) KDL-46EX640; CC/USA; en) Presto/2.8.115 Version/11.10
         *        Opera/9.80 (Linux armv7l; U; InettvBrowser/2.2(00014A;SonyDTV115;0002;0100) KDL-40EX640; CC/USA; en) Presto/2.10.250 Version/11.60
         *        Opera/9.80 (Linux armv7l; U; InettvBrowser/2.2(00014A;SonyDTV115;0002;0100) N/A; CC/USA; en) Presto/2.8.115 Version/11.10
         *        Opera/9.80 (Linux mips; U; InettvBrowser/2.2 (00014A;SonyDTV115;0002;0100) ; CC/JPN; en) Presto/2.9.167 Version/11.50
         *        Opera/9.80 (Linux mips; U; InettvBrowser/2.2 (00014A;SonyDTV115;0002;0100) AZ2CVT2; CC/CAN; en) Presto/2.7.61 Version/11.00
         *        Opera/9.80 (Linux armv6l; Opera TV Store/4207; U; (SonyBDP/BDV11); en) Presto/2.9.167 Version/11.50
         *        Opera/9.80 (Linux armv6l ; U; (SonyBDP/BDV11); en) Presto/2.6.33 Version/10.60
         *        Opera/9.80 (Linux armv6l; U; (SonyBDP/BDV11); en) Presto/2.8.115 Version/11.10
         */

        if (/SonyDTV|SonyBDP|SonyCEBrowser/.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'Sony';
            this.device.model = 'Internet TV';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        Philips Net TV
         *
         *        Opera/9.70 (Linux armv6l ; U; CE-HTML/1.0 NETTV/2.0.2; en) Presto/2.2.1
         *        Opera/9.80 (Linux armv6l ; U; CE-HTML/1.0 NETTV/3.0.1;; en) Presto/2.6.33 Version/10.60
         *        Opera/9.80 (Linux mips; U; CE-HTML/1.0 NETTV/3.0.1; PHILIPS-AVM-2012; en) Presto/2.9.167 Version/11.50
         *        Opera/9.80 (Linux mips ; U; HbbTV/1.1.1 (; Philips; ; ; ; ) CE-HTML/1.0 NETTV/3.1.0; en) Presto/2.6.33 Version/10.70
         *        Opera/9.80 (Linux i686; U; HbbTV/1.1.1 (; Philips; ; ; ; ) CE-HTML/1.0 NETTV/3.1.0; en) Presto/2.9.167 Version/11.50
         */

        if (/NETTV\//.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'Philips';
            this.device.model = 'Net TV';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        LG NetCast TV
         *
         *        Mozilla/5.0 (DirectFB; Linux armv7l) AppleWebKit/534.26+ (KHTML, like Gecko) Version/5.0 Safari/534.26+ LG Browser/5.00.00(+mouse+3D+SCREEN+TUNER; LGE; GLOBAL-PLAT4; 03.09.22; 0x00000001;); LG NetCast.TV-2012
         *        Mozilla/5.0 (DirectFB; Linux armv7l) AppleWebKit/534.26+ (KHTML, like Gecko) Version/5.0 Safari/534.26+ LG Browser/5.00.00(+SCREEN+TUNER; LGE; GLOBAL-PLAT4; 01.00.00; 0x00000001;); LG NetCast.TV-2012
         *        Mozilla/5.0 (DirectFB; U; Linux armv6l; en) AppleWebKit/531.2  (KHTML, like Gecko) Safari/531.2  LG Browser/4.1.4( BDP; LGE; Media/BD660; 6970; abc;); LG NetCast.Media-2011
         *        Mozilla/5.0 (DirectFB; U; Linux 7631; en) AppleWebKit/531.2  (KHTML, like Gecko) Safari/531.2  LG Browser/4.1.4( NO_NUM; LGE; Media/SP520; ST.3.97.409.F; 0x00000001;); LG NetCast.Media-2011
         *        Mozilla/5.0 (DirectFB; U; Linux 7630; en) AppleWebKit/531.2  (KHTML, like Gecko) Safari/531.2  LG Browser/4.1.4( 3D BDP NO_NUM; LGE; Media/ST600; LG NetCast.Media-2011
         *        (LGSmartTV/1.0) AppleWebKit/534.23 OBIGO-T10/2.0
         */

        match = /LG NetCast\.(?:TV|Media)-([0-9]*)/.exec(ua);
        if (match)
        {
            this.os.name = '';
            this.device.manufacturer = 'LG';
            this.device.model = 'NetCast TV ' + match[1];
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        if (/LGSmartTV/.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'LG';
            this.device.model = 'Smart TV';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        Toshiba Smart TV
         *
         *        Mozilla/5.0 (Linux mipsel; U; HbbTV/1.1.1 (; TOSHIBA; DTV_RL953; 56.7.66.7; t12; ) ; ToshibaTP/1.3.0 (+VIDEO_MP4+VIDEO_X_MS_ASF+AUDIO_MPEG+AUDIO_MP4+DRM+NATIVELAUNCH) ; en) AppleWebKit/534.1 (KHTML, like Gecko)
         *        Mozilla/5.0 (DTV; TSBNetTV/T32013713.0203.7DD; TVwithVideoPlayer; like Gecko) NetFront/4.1 DTVNetBrowser/2.2 (000039;T32013713;0203;7DD) InettvBrowser/2.2 (000039;T32013713;0203;7DD)
         *        Mozilla/5.0 (Linux mipsel; U; HbbTV/1.1.1 (; TOSHIBA; 40PX200; 0.7.3.0.; t12; ) ; Toshiba_TP/1.3.0 (+VIDEO_MP4+AUDIO_MPEG+AUDIO_MP4+VIDEO_X_MS_ASF+OFFLINEAPP) ; en) AppleWebKit/534.1 (KHTML, like Gec
         */

        if (/Toshiba_?TP\//.test(ua) || /TSBNetTV\//.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'Toshiba';
            this.device.model = 'Smart TV';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        NetRange MMH
         */

        if (/NETRANGEMMH/.test(ua))
        {
            this.os.name = '';
            this.os.version = null;
            this.browser.name = '';
            this.browser.version = null;
            this.device.model = 'NetRange MMH';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        MachBlue XT
         */

        match = /mbxtWebKit\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.os.name = '';
            this.browser.name = 'MachBlue XT';
            this.browser.version = new Version({ 'value': match[1], 'details': 2 });
            this.device.type = TYPE_TELEVISION;
        }

        if (ua === 'MachBlue')
        {
            this.os.name = '';
            this.browser.name = 'MachBlue XT';
            this.device.type = TYPE_TELEVISION;
        }


        /****************************************************
         *        Motorola KreaTV
         */

        if (/Motorola KreaTV STB/.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'Motorola';
            this.device.model = 'KreaTV';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        ADB
         */

        match = /\(ADB; ([^\)]+)\)/.exec(ua);
        if (match)
        {
            this.os.name = '';
            this.device.manufacturer = 'ADB';
            this.device.model = ((match[1] === 'Unknown') ? '' : match[1].replace('ADB', '') + ' ') + 'IPTV receiver';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        MStar
         */

        if (/Mstar;OWB/.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'MStar';
            this.device.model = 'PVR';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;

            this.browser.name = 'Origyn Web Browser';
        }

        /****************************************************
         *        TechniSat
         */

        match = /TechniSat ([^;]+);/.exec(ua);
        if (match)
        {
            this.os.name = '';
            this.device.manufacturer = 'TechniSat';
            this.device.model = match[1];
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        Technicolor
         */

        if (/Technicolor_([^;]+);/.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'Technicolor';
            this.device.model = match[1];
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        Winbox Evo2
         */

        if (/Winbox Evo2/.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'Winbox';
            this.device.model = 'Evo2';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        DuneHD
         */

        if (/DuneHD\//.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'Dune HD';
            this.device.model = '';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }

        /****************************************************
         *        Roku
         */

        match = /^Roku\/DVP-([0-9]+)/.exec(ua);
        if (match)
        {
            this.os.name = '';
            this.device.manufacturer = 'Roku';
            this.device.type = TYPE_TELEVISION;

            switch (match[1])
            {
                case '2000':
                    this.device.model = 'HD';
                    break;
                case '2050':
                    this.device.model = 'XD';
                    break;
                case '2100':
                    this.device.model = 'XDS';
                    break;
                case '2400':
                    this.device.model = 'LT';
                    break;
                case '3000':
                    this.device.model = '2 HD';
                    break;
                case '3050':
                    this.device.model = '2 XD';
                    break;
                case '3100':
                    this.device.model = '2 XS';
                    break;
            }

            this.device.identified |= ID_MATCH_UA;
        }


        /****************************************************
         *        MediStream
         */

        if (/MediStream/.test(ua))
        {
            this.os.name = '';
            this.device.manufacturer = 'Bewatec';
            this.device.model = 'MediStream';
            this.device.type = TYPE_TELEVISION;
            this.device.identified |= ID_MATCH_UA;
        }


        /****************************************************
         *        BrightSign
         */

        match = /BrightSign\/[0-9\.]+ \(([^\)]+)/.exec(ua);
        if (match)
        {
            this.os.name = '';
            this.device.manufacturer = 'BrightSign';
            this.device.model = match[1];
            this.device.type = TYPE_SIGNAGE;
            this.device.identified |= ID_MATCH_UA;
        }


        /****************************************************
         *        Iadea
         */

        match = /\(MODEL:([^\)]+)\)/.exec(ua);
        if (/ADAPI/.test(ua) && match)
        {
            this.os.name = '';
            this.device.manufacturer = 'Iadea';
            this.device.model = match[1];
            this.device.type = TYPE_SIGNAGE;
            this.device.identified |= ID_MATCH_UA;
        }


        /****************************************************
         *        Generic
         */

        match = /HbbTV\/[0-9\.]+ \([^;]*;\s*([^;]*)\s*;\s*([^;]*)\s*;/.exec(ua);
        if (match)
        {
            var $vendorName = match[1].trim();
            var $modelName = match[2].trim();

            if (!this.device.manufacturer && $vendorName !== '' && $vendorName !== 'vendorName')
            {
                switch ($vendorName)
                {
                    case 'LG Electronics':
                        this.device.manufacturer = 'LG';
                        break;
                    case 'LGE':
                        this.device.manufacturer = 'LG';
                        break;
                    case 'TOSHIBA':
                        this.device.manufacturer = 'Toshiba';
                        break;
                    case 'smart':
                        this.device.manufacturer = 'Smart';
                        break;
                    case 'tv2n':
                        this.device.manufacturer = 'TV2N';
                        break;
                    default:
                        this.device.manufacturer = $vendorName;
                }

                if (!this.device.model && $modelName !== '' && $modelName !== 'modelName')
                {
                    this.device.identified |= ID_PATTERN;

                    switch ($modelName)
                    {
                        case 'GLOBAL_PLAT3':
                            this.device.model = 'NetCast 3.0';
                            this.device.identified |= ID_MATCH_UA;
                            break;
                        case 'GLOBAL_PLAT4':
                            this.device.model = 'NetCast 4.0';
                            this.device.identified |= ID_MATCH_UA;
                            break;
                        case 'NetCast 4.0':
                            this.device.model = 'NetCast 4.0';
                            this.device.identified |= ID_MATCH_UA;
                            break;
                        case 'SmartTV2012':
                            this.device.model = 'Smart TV 2012';
                            this.device.identified |= ID_MATCH_UA;
                            break;
                        case 'videoweb':
                            this.device.model = 'Videoweb';
                            this.device.identified |= ID_MATCH_UA;
                            break;
                        case 'VIERA 2013':
                            this.device.model = 'Smart Viera';
                            this.device.identified |= ID_MATCH_UA;
                            break;
                        case 'VIERA 2014':
                            this.device.model = 'Smart Viera';
                            this.device.identified |= ID_MATCH_UA;
                            break;
                        case 'hms1000sph2':
                            this.device.manufacturer = 'Humax';
                            this.device.model = 'HMS-1000S';
                            this.device.identified |= ID_MATCH_UA;
                            break;
                        default:
                            this.device.model = $modelName;
                    }

                    if ($vendorName === 'Humax')
                    {
                        this.device.model = this.device.model.toUpperCase();
                    }

                    this.os.name = '';
                }
            }

            this.device.type = TYPE_TELEVISION;
        }

        /****************************************************
         *        Detect type based on common identifiers
         */

        if (/InettvBrowser/.test(ua))
        {
            this.device.type = TYPE_TELEVISION;
        }

        if (/MIDP/.test(ua))
        {
            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        Try to detect any devices based on common
         *        locations of model ids
         */

        if (!this.device.model && !this.device.manufacturer)
        {
            var $candidates = [];
            var $i;

            match = /^(?:MQQBrowser\/[0-9\.]+\/)?([^\s]+)/.exec(ua);
            if (!/^(Mozilla|Opera)/.test(ua) && match)
            {
                match[1] = match[1].replace(/_TD$/g, '');
                match[1] = match[1].replace(/_CMCC$/g, '');
                match[1] = match[1].replace(/[_ ]Mozilla$/g, '');
                match[1] = match[1].replace(/ Linux$/g, '');
                match[1] = match[1].replace(/ Opera$/g, '');
                match[1] = match[1].replace(/\/[0-9].*$/g, '');

                $candidates.push(match[1]);
            }

            match = /^((?:SAMSUNG|TCL|ZTE) [^\s]+)/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /(Samsung (?:GT|SCH|SGH|SHV|SHW|SPH)\-[A-Z\-0-9]+)/i.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /[0-9]+x[0-9]+; ([^;]+)/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /\s*([^;]*[^\s])\s*; [0-9]+\*[0-9]+\)/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /[0-9]+X[0-9]+ ([^;\/\(\)]+)/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /Windows NT 5.1; ([^;]+); Windows Phone/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /\) PPC; (?:[0-9]+x[0-9]+; )?([^;\/\(\)]+)/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /Windows Mobile; ([^;]+); PPC;/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /\(([^;]+); U; Windows Mobile/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /Series60\/[0-9\.]+ ([^\s]+) Profile/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /Vodafone\/1.0\/([^\/]+)/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /^(DoCoMo[^(]+)/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = / ([^\s]+)$/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /; ([^;\)]+)\)/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /^(.*)\/UCWEB/.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /^([a-z0-9\._\+\/ ]+) Linux/i.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            match = /\(([a-z0-9\._\+\/ ]+) Browser/i.exec(ua);
            if (match)
            {
                $candidates.push(match[1]);
            }

            if (!!this.os.name)
            {
                for ($i = 0; $i < $candidates.length; $i += 1)
                {
                    var $result = false;

                    if (!this.device.model && !this.device.manufacturer)
                    {
                        if (!!this.os.name && (this.os.name === 'Android' || this.os.name === 'Linux'))
                        {
                            device = DeviceModels.identify('android', $candidates[$i]);
                            if (device.identified)
                            {
                                $result = true;

                                device.identified |= this.device.identified;
                                this.device = device;

                                if (this.os.name !== 'Android')
                                {
                                    this.os.name = 'Android';
                                    this.os.version = null;
                                }
                            }
                        }

                        if (!this.os.name || this.os.name === 'Windows' || this.os.name === 'Windows Mobile' || this.os.name === 'Windows CE')
                        {
                            device = DeviceModels.identify('wm', $candidates[$i]);
                            if (device.identified)
                            {
                                $result = true;

                                device.identified |= this.device.identified;
                                this.device = device;

                                if (!!this.os.name && this.os.name !== 'Windows Mobile')
                                {
                                    this.os.name = 'Windows Mobile';
                                    this.os.version = null;
                                }
                            }
                        }
                    }
                }
            }

            if (!this.device.model && !this.device.manufacturer)
            {
                var $identified = false;

                for ($i = 0; $i < $candidates.length; $i += 1)
                {
                    if (!this.device.identified)
                    {
                        match = /^acer_([^\/]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Acer';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^ALCATEL[_\-]([^\/]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Alcatel';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;

                            match = /^OT\s*([^\s]*)/i.exec(this.device.model);
                            if (match)
                            {
                                this.device.model = 'One Touch ' + match[1];
                            }

                            $identified = true;
                        }

                        match = /^BenQ\-([^\/]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'BenQ';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^Bird_([^\/]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Bird';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^(?:YL\-)?COOLPAD([^\s]+)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Coolpad';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^DoCoMo\/[0-9\.]+ ([^\s]+)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'DoCoMo';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^dopod[\-_]?([^\s]+)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Dopod';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^GIONEE[\-_]([^\s]+)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Gionee';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^HTC[_\-]?([^\/_]+)(?:\/|_|$)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'HTC';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^HUAWEI[_\-]?([^\/]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Huawei';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^KONKA[\-_]?([^\s]+)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Konka';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^K-Touch_?([^\/]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'K-Touch';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^Lenovo\-([^\/]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Lenovo';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^Lephone_([^\/]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Lephone';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /(?:^|\()LGE?(?:\/|\-|_|\s)([^\s]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'LG';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^MOT-([^\/_]+)(?:\/|_|$)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Motorola';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^Motorola_([^\/_]+)(?:\/|_|$)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Motorola';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^Nokia\-?([^\/]+)(?:\/|$)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Nokia';

                            if (match[1] !== 'Browser')
                            {
                                this.device.model = DeviceModels.cleanup(match[1]);
                                this.device.type = TYPE_MOBILE;
                                this.device.identified = false;
                                $identified = true;

                                if (!this.device.identified)
                                {
                                    device = DeviceModels.identify('s60', this.device.model);
                                    if (device.identified)
                                    {
                                        device.identified |= this.device.identified;
                                        this.device = device;

                                        if (!this.os.name || this.os.name !== 'Series60')
                                        {
                                            this.os.name = 'Series60';
                                            this.os.version = null;
                                        }
                                    }
                                }

                                if (!this.device.identified)
                                {
                                    device = DeviceModels.identify('s40', this.device.model);
                                    if (device.identified)
                                    {
                                        device.identified |= this.device.identified;
                                        this.device = device;

                                        if (!this.os.name || this.os.name !== 'Series40')
                                        {
                                            this.os.name = 'Series40';
                                            this.os.version = null;
                                        }
                                    }
                                }

                                if (!this.device.identified)
                                {
                                    device = DeviceModels.identify('asha', this.device.model);
                                    if (device.identified)
                                    {
                                        device.identified |= this.device.identified;
                                        this.device = device;

                                        if (!this.os.name || this.os.name !== 'Nokia Asha Platform')
                                        {
                                            this.os.name = 'Nokia Asha Platform';
                                            this.os.version = null;
                                        }
                                    }
                                }
                            }
                        }

                        match = /^OPPO_([^\/_]+)(?:\/|_|$)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Oppo';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^Pantech([^\/_]+)(?:\/|_|$)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Pantech';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^SonyEricsson([^\/_]+)(?:\/|_|$)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Sony Ericsson';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            this.device.identified = false;
                            $identified = true;

                            if (/^[a-z][0-9]+/.test(this.device.model))
                            {
                                this.device.model[0] = this.device.model[0].toUpperCase();
                            }

                            if (!!this.os.name && this.os.name === 'Series60')
                            {
                                device = DeviceModels.identify('s60', this.device.model);
                                if (device.identified)
                                {
                                    device.identified |= this.device.identified;
                                    this.device = device;
                                }
                            }
                        }

                        match = /^T-smart_([^\/]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'T-smart';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^TCL[\-_ ]([^\/]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'TCL';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^SHARP[\-_\/]([^\/]*)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Sharp';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^SAMSUNG[\-\/ ]?([^\/_]+)(?:\/|_|$)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Samsung';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            this.device.identified = false;
                            $identified = true;

                            if (!!this.os.name && this.os.name === 'Bada')
                            {
                                device = DeviceModels.identify('bada', this.device.model);
                                if (device.identified)
                                {
                                    device.identified |= this.device.identified;
                                    this.device = device;
                                }
                            }

                            else if (!!this.os.name && this.os.name === 'Series60')
                            {
                                device = DeviceModels.identify('s60', this.device.model);
                                if (device.identified)
                                {
                                    device.identified |= this.device.identified;
                                    this.device = device;
                                }
                            }

                            else if((match = /Jasmine\/([0-9.]*)/.exec(ua)))
                            {
                                version = match[1];

                                device = DeviceModels.identify('touchwiz', this.device.model);
                                if (device.identified)
                                {
                                    device.identified |= this.device.identified;
                                    this.device = device;
                                    this.os.name = 'Touchwiz';

                                    switch (version)
                                    {
                                        case '0.8':
                                            this.os.version = new Version({ 'value': '1.0' });
                                            break;
                                        case '1.0':
                                            this.os.version = new Version({ 'value': '2.0', 'alias': '2.0 or earlier' });
                                            break;
                                        case '2.0':
                                            this.os.version = new Version({ 'value': '3.0' });
                                            break;
                                    }
                                }
                            }

                            else if((match = /(?:Dolfin\/([0-9.]*)|Browser\/Dolfin([0-9.]*))/.exec(ua)))
                            {
                                version = match[1] || match[2];

                                device = DeviceModels.identify('bada', this.device.model);
                                if (device.identified)
                                {
                                    device.identified |= this.device.identified;
                                    this.device = device;
                                    this.os.name = 'Bada';

                                    switch(version)
                                    {
                                        case '2.0':
                                            this.os.version = new Version({ 'value': '1.0' });
                                            break;
                                        case '2.2':
                                            this.os.version = new Version({ 'value': '1.2' });
                                            break;
                                        case '3.0':
                                            this.os.version = new Version({ 'value': '2.0' });
                                            break;
                                    }
                                }

                                else
                                {
                                    device = DeviceModels.identify('touchwiz', this.device.model);
                                    if (device.identified)
                                    {
                                    device.identified |= this.device.identified;
                                        this.device = device;
                                        this.os.name = 'Touchwiz';

                                        switch(version)
                                        {
                                            case '1.5':
                                                this.os.version = new Version({ 'value': '2.0' });
                                                break;
                                            case '2.0':
                                                this.os.version = new Version({ 'value': '3.0' });
                                                break;
                                        }
                                    }
                                }
                            }
                        }

                        match = /^Xiaomi[_]?([^\s]+)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'Xiaomi';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }

                        match = /^ZTE[\-_]?([^\s]+)/i.exec($candidates[$i]);
                        if (match)
                        {
                            this.device.manufacturer = 'ZTE';
                            this.device.model = DeviceModels.cleanup(match[1]);
                            this.device.type = TYPE_MOBILE;
                            $identified = true;
                        }
                    }
                }

                if ($identified && !this.device.identified)
                {
                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('bada', this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                            this.os.name = 'Bada';
                        }
                    }

                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('touchwiz', this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                            this.os.name = 'Touchwiz';
                        }
                    }

                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('wp', this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                            this.os.name = 'Windows Phone';
                        }
                    }

                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('wm', this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                            this.os.name = 'Windows Mobile';
                        }
                    }

                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('android', this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                            this.os.name = 'Android';
                        }
                    }

                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('brew', this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                            this.os.name = 'Brew';
                        }
                    }

                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('feature', this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                        }
                    }
                }

                if ($identified && !this.device.identified)
                {
                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('bada', this.device.manufacturer + ' ' + this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                            this.os.name = 'Bada';
                        }
                    }

                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('touchwiz', this.device.manufacturer + ' ' + this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                            this.os.name = 'Touchwiz';
                        }
                    }

                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('wp', this.device.manufacturer + ' ' + this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                            this.os.name = 'Windows Phone';
                        }
                    }

                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('wm', this.device.manufacturer + ' ' + this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                            this.os.name = 'Windows Mobile';
                        }
                    }

                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('android', this.device.manufacturer + ' ' + this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                            this.os.name = 'Android';
                        }
                    }

                    if (!this.device.identified)
                    {
                        device = DeviceModels.identify('feature', this.device.manufacturer + ' ' + this.device.model);
                        if (device.identified)
                        {
                            device.identified |= this.device.identified;
                            this.device = device;
                        }
                    }
                }

                if ($identified)
                {
                    this.device.identified |= ID_PATTERN;
                }
            }
        }


        match = /Sprint ([^\s]+)/.exec(ua);
        if (match)
        {
            this.device.manufacturer = 'Sprint';
            this.device.model = DeviceModels.cleanup(match[1]);
            this.device.type = TYPE_MOBILE;
            this.device.identified |= ID_PATTERN;
        }

        match = /SoftBank\/[^\/]+\/([^\/]+)\//.exec(ua);
        if (match)
        {
            this.device.manufacturer = 'Softbank';
            this.device.model = DeviceModels.cleanup(match[1]);
            this.device.type = TYPE_MOBILE;
            this.device.identified |= ID_PATTERN;
        }

        match = /\((?:LG[\-|\/])(.*) (?:Browser\/)?AppleWebkit/.exec(ua);
        if (match)
        {
            this.device.manufacturer = 'LG';
            this.device.model = DeviceModels.cleanup(match[1]);
            this.device.type = TYPE_MOBILE;
            this.device.identified |= ID_PATTERN;
        }

        match = /^Mozilla\/5.0 \((?:Nokia|NOKIA)(?:\s?)([^\)]+)\)UC AppleWebkit\(like Gecko\) Safari\/530$/.exec(ua);
        if (match)
        {
            this.device.manufacturer = 'Nokia';
            this.device.model = DeviceModels.cleanup(match[1]);
            this.device.type = TYPE_MOBILE;
            this.device.identified |= ID_PATTERN;

            if (! (this.device.identified & ID_MATCH_UA))
            {
                device = DeviceModels.identify('s60', this.device.model);
                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.device = device;

                    if (!this.os.name || this.os.name !== 'Series60')
                    {
                        this.os.name = 'Series60';
                        this.os.version = null;
                    }
                }
            }

            if (! (this.device.identified & ID_MATCH_UA))
            {
                device = DeviceModels.identify('s40', this.device.model);
                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.device = device;

                    if (!this.os.name || this.os.name !== 'Series40')
                    {
                        this.os.name = 'Series40';
                        this.os.version = null;
                    }
                }
            }
        }



        /****************************************************
         *        Safari
         */

        if (/Safari/.test(ua))
        {

            if (!!this.os.name && this.os.name === 'iOS')
            {
                this.browser.stock = true;
                this.browser.hidden = true;
                this.browser.name = 'Safari';
                this.browser.version = null;
            }

            if (!!this.os.name && (this.os.name === 'Mac OS X' || this.os.name === 'Windows'))
            {
                this.browser.name = 'Safari';
                this.browser.stock = this.os.name === 'Mac OS X';

                match = /Version\/([0-9\.]+)/.exec(ua);
                if (match)
                {
                    this.browser.version = new Version({ 'value': match[1] });
                }

                if (/AppleWebKit\/[0-9\.]+\+/.test(ua))
                {
                    this.browser.name = 'WebKit Nightly Build';
                    this.browser.version = null;
                }
            }
        }

        /****************************************************
         *        Internet Explorer
         */

        if (/MSIE/.test(ua))
        {
            this.browser.name = 'Internet Explorer';

            if (/IEMobile/.test(ua) || /Windows CE/.test(ua) || /Windows Phone/.test(ua) || /WP7/.test(ua) || /WPDesktop/.test(ua))
            {
                this.browser.name = 'Mobile Internet Explorer';
            }

            match = /MSIE ([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            if (/Mac_/.test(ua))
            {
                this.os.name = 'Mac OS';
                this.engine.name = 'Tasman';
                this.device.type = TYPE_DESKTOP;

                if (this.browser.version.toFloat() >= 5.11 && this.browser.version.toFloat() <= 5.13)
                {
                    this.os.name = 'Mac OS X';
                }

                if (this.browser.version.toFloat() >= 5.2)
                {
                    this.os.name = 'Mac OS X';
                }
            }
        }

        match = /\(IE ([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'Internet Explorer';
            this.browser.version = new Version({ 'value': match[1] });
        }

        match = /Browser\/IE([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'Internet Explorer';
            this.browser.version = new Version({ 'value': match[1] });
        }

        match = /Trident\/[789][^\)]+; rv:([0-9.]*)\)/.exec(ua);
        if (match)
        {
            this.browser.name = 'Internet Explorer';
            this.browser.version = new Version({ 'value': match[1] });
        }

        /****************************************************
         *        Firefox
         */

        if (/Firefox/.test(ua))
        {
            this.browser.stock = false;
            this.browser.name = 'Firefox';

            match = /Firefox\/([0-9ab.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });

                if (/a/.test(match[1]))
                {
                    this.browser.channel = 'Aurora';
                }

                if (/b/.test(match[1]))
                {
                    this.browser.channel = 'Beta';
                }
            }

            if (/Fennec/.test(ua))
            {
                this.device.type = TYPE_MOBILE;
            }

            match = /Mobile;(?: ([^;]+);)? rv/.exec(ua);
            if (match)
            {
                this.device.type = TYPE_MOBILE;

                device = DeviceModels.identify('firefoxos', match[1]);
                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.os.name = 'Firefox OS';
                    this.device = device;
                }
            }

            match = /Tablet;(?: ([^;]+);)? rv/.exec(ua);
            if (match)
            {
                this.device.type = TYPE_TABLET;

                device = DeviceModels.identify('firefoxos', match[1]);
                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.os.name = 'Firefox OS';
                    this.device = device;
                }
            }

            if (this.device.type === TYPE_MOBILE || this.device.type === TYPE_TABLET)
            {
                this.browser.name = 'Firefox Mobile';
            }

            if (this.device.type === '')
            {
                this.device.type = TYPE_DESKTOP;
            }
        }

        if (/Namoroka/.test(ua))
        {
            this.browser.stock = false;
            this.browser.name = 'Firefox';

            match = /Namoroka\/([0-9ab.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            this.browser.channel = 'Namoroka';
        }

        if (/Shiretoko/.test(ua))
        {
            this.browser.stock = false;
            this.browser.name = 'Firefox';

            match = /Shiretoko\/([0-9ab.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            this.browser.channel = 'Shiretoko';
        }

        if (/Minefield/.test(ua))
        {
            this.browser.stock = false;
            this.browser.name = 'Firefox';

            match = /Minefield\/([0-9ab.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            this.browser.channel = 'Minefield';
        }

        if (/Firebird/.test(ua))
        {
            this.browser.stock = false;
            this.browser.name = 'Firebird';

            match = /Firebird\/([0-9ab.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }
        }

        /****************************************************
         *        SeaMonkey
         */

        if (/SeaMonkey/.test(ua))
        {
            this.browser.stock = false;
            this.browser.name = 'SeaMonkey';

            match = /SeaMonkey\/([0-9ab.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            if (this.device.type === '')
            {
                this.device.type = TYPE_DESKTOP;
            }
        }

        match = /PmWFx\/([0-9ab.]*)/.exec(ua);
        if (match)
        {
            this.browser.stock = false;
            this.browser.name = 'SeaMonkey';
            this.browser.version = new Version({ 'value': match[1] });
        }



        /****************************************************
         *        Netscape
         */

        if (/Netscape/.test(ua))
        {
            this.browser.stock = false;
            this.browser.name = 'Netscape';

            match = /Netscape[0-9]?\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }
        }

        /****************************************************
         *        Konqueror
         */

        if (/[k|K]onqueror\//.test(ua))
        {
            this.browser.name = 'Konqueror';

            match = /[k|K]onqueror\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            if (this.device.type === '')
            {
                this.device.type = TYPE_DESKTOP;
            }
        }

        /****************************************************
         *        Chrome
         */

        match = /(?:Chrome|CrMo|CriOS)\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.stock = false;
            this.browser.name = 'Chrome';
            this.browser.version = new Version({ 'value': match[1] });

            if (!!this.os.name && this.os.name === 'Android')
            {
                switch (match[1].split('.').splice(0, 3).join('.'))
                {
                    case '16.0.912':
                        this.browser.channel = 'Beta';
                        break;
                    case '18.0.1025':
                    case '25.0.1364':
                    case '27.0.1453':
                    case '29.0.1547':
                    case '30.0.1599':
                    case '31.0.1650':
                    case '32.0.1700':
                    case '33.0.1750':
                    case '34.0.1847':
                        this.browser.version.details = 1;
                        break;
                    default:
                        this.browser.channel = 'Dev';
                        break;
                }

                /* Webview for Android 4.4 and higher */
                if (match[1].split('.').splice(1, 2).join('.') === '0.0' && /Version\//.test(ua))
                {
                    this.browser.stock = true;
                    this.browser.name = null;
                    this.browser.version = null;
                    this.browser.channel = null;
                }

                /* Samsung Chromium based browsers */
                if (!!device.manufacturer && device.manufacturer === 'Samsung')
                {

                    /* Version 1.0 */
                    if (match[1] === '18.0.1025.308' && /Version\/1.0/.test(ua))
                    {
                        this.browser.stock = true;
                        this.browser.name = null;
                        this.browser.version = null;
                        this.browser.channel = null;
                    }

                    /* Version 1.5 */
                    if (match[1] === '28.0.1500.94' && /Version\/1.5/.test(ua))
                    {
                        this.browser.stock = true;
                        this.browser.name = null;
                        this.browser.version = null;
                        this.browser.channel = null;
                    }
                }
            }

            else
            {
                switch (match[1].split('.').splice(0, 3).join('.'))
                {
                    case '0.2.149':
                    case '0.3.154':
                    case '0.4.154':
                    case '4.1.249':
                        this.browser.version.details = 2;
                        break;

                    case '1.0.154':
                    case '2.0.172':
                    case '3.0.195':
                    case '4.0.249':
                    case '5.0.375':
                    case '6.0.472':
                    case '7.0.517':
                    case '8.0.552':
                    case '9.0.597':
                    case '10.0.648':
                    case '11.0.696':
                    case '12.0.742':
                    case '13.0.782':
                    case '14.0.835':
                    case '15.0.874':
                    case '16.0.912':
                    case '17.0.963':
                    case '18.0.1025':
                    case '19.0.1084':
                    case '20.0.1132':
                    case '21.0.1180':
                    case '22.0.1229':
                    case '23.0.1271':
                    case '24.0.1312':
                    case '25.0.1364':
                    case '26.0.1410':
                    case '27.0.1453':
                    case '28.0.1500':
                    case '29.0.1547':
                    case '30.0.1599':
                    case '31.0.1650':
                    case '32.0.1700':
                    case '33.0.1750':
                    case '34.0.1847':
                        this.browser.version.details = 1;
                        break;
                    default:
                        this.browser.channel = 'Dev';
                        break;
                }
            }

            if (this.device.type === '')
            {
                this.device.type = TYPE_DESKTOP;
            }
        }

        /****************************************************
         *        Chromium
         */

        if (/Chromium/.test(ua))
        {
            this.browser.stock = false;
            this.browser.channel = '';
            this.browser.name = 'Chromium';

            match = /Chromium\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            if (this.device.type === '')
            {
                this.device.type = TYPE_DESKTOP;
            }
        }


        /****************************************************
         *        Opera
         */

        match = /OPR\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.stock = false;
            this.browser.channel = '';
            this.browser.name = 'Opera';
            this.browser.version = new Version({ 'value': match[1], 'details': 2 });

            if (/Edition Developer/.test(ua))
            {
                this.browser.channel = 'Developer';
            }

            if (/Edition Next/.test(ua))
            {
                this.browser.channel = 'Next';
            }

            if (this.device.type === TYPE_MOBILE)
            {
                this.browser.name = 'Opera Mobile';
            }
        }

        if (/Opera/i.test(ua))
        {
            this.browser.stock = false;
            this.browser.name = 'Opera';

            match = /Opera[\/| ]([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            match = /Version\/([0-9.]*)/.exec(ua);
            if (match)
            {
                if (parseFloat(match[1]) >= 10)
                {
                    this.browser.version = new Version({ 'value': match[1] });
                }
                else
                {
                    this.browser.version = null;
                }
            }

            if (!!this.browser.version && /Edition Labs/.test(ua))
            {
                this.browser.channel = 'Labs';
            }

            if (!!this.browser.version && /Edition Next/.test(ua))
            {
                this.browser.channel = 'Next';
            }

            if (/Opera Tablet/.test(ua))
            {
                this.browser.name = 'Opera Mobile';
                this.device.type = TYPE_TABLET;
            }

            if (/Opera Mobi/.test(ua))
            {
                this.browser.name = 'Opera Mobile';
                this.device.type = TYPE_MOBILE;
            }

            if (/Opera Mini;/.test(ua))
            {
                this.browser.name = 'Opera Mini';
                this.browser.version = null;
                this.browser.mode = 'proxy';
                this.device.type = TYPE_MOBILE;
            }

            match = /Opera Mini\/(?:att\/)?([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.name = 'Opera Mini';
                this.browser.version = new Version({ 'value': match[1], 'details': ( parseInt(match[1].substr(match[1].lastIndexOf('.')), 10) > 99 ? -1 : null )});
                this.browser.mode = 'proxy';
                this.device.type = TYPE_MOBILE;
            }

            if (this.browser.name === 'Opera' && this.device.type === TYPE_MOBILE)
            {
                this.browser.name = 'Opera Mobile';

                if (/BER/.test(ua))
                {
                    this.browser.name = 'Opera Mini';
                    this.browser.version = null;
                }
            }

            if (/InettvBrowser/.test(ua))
            {
                this.device.type = TYPE_TELEVISION;
            }

            if (/Opera[ \-]TV/.test(ua))
            {
                this.browser.name = 'Opera';
                this.device.type = TYPE_TELEVISION;
            }

            if (/Linux zbov/.test(ua))
            {
                this.browser.name = 'Opera Mobile';
                this.browser.mode = 'desktop';

                this.device.type = TYPE_MOBILE;

                this.os.name = null;
                this.os.version = null;
            }

            if (/Linux zvav/.test(ua))
            {
                this.browser.name = 'Opera Mini';
                this.browser.version = null;
                this.browser.mode = 'desktop';

                this.device.type = TYPE_MOBILE;

                this.os.name = null;
                this.os.version = null;
            }

            if (this.device.type === '')
            {
                this.device.type = TYPE_DESKTOP;
            }
        }

        match = /Coast\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'Coast by Opera';
            this.browser.version = new Version({ 'value': match[1], 'details': 3  });
        }

        /****************************************************
         *        wOSBrowser
         */

        if (/wOSBrowser/.test(ua))
        {
            this.browser.name = 'webOS Browser';

            if (this.os.name !== 'webOS')
            {
                this.os.name = 'webOS';
            }
        }

        /****************************************************
         *        Sailfish Browser
         */

        if (/Sailfish ?Browser/.test(ua))
        {
            this.browser.name = 'Sailfish Browser';
            this.browser.stock = true;

            match = /Sailfish ?Browser\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1], 'details': 2 });
            }
        }

        /****************************************************
         *        BrowserNG
         */

        if (/BrowserNG/.test(ua))
        {
            this.browser.name = 'Nokia Browser';

            match = /BrowserNG\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1], 'details': 3, 'builds': false });
            }
        }

        /****************************************************
         *        Nokia Browser
         */

        if (/NokiaBrowser/.test(ua))
        {
            this.browser.name = 'Nokia Browser';
            this.browser.channel = null;

            match = /NokiaBrowser\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1], 'details': 3 });
            }
        }

        /****************************************************
         *        Nokia Xpress
         *
         *        Mozilla/5.0 (X11; Linux x86_64; rv:5.0.1) Gecko/20120822 OSRE/1.0.7f
         */

        if (/OSRE/.test(ua))
        {
            this.browser.name = 'Nokia Xpress';
            this.browser.mode = 'proxy';
            this.device.type = TYPE_MOBILE;

            this.os.name = null;
            this.os.version = null;
        }

        if (/S40OviBrowser/.test(ua))
        {
            this.browser.name = 'Nokia Xpress';
            this.browser.mode = 'proxy';

            match = /S40OviBrowser\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1], 'details': 3 });
            }

            match = /Nokia([^\/]+)\//.exec(ua);
            if (match)
            {
                this.device.manufacturer = 'Nokia';
                this.device.model = match[1];
                this.device.identified |= ID_PATTERN;

                if (!!this.device.model)
                {
                    device = DeviceModels.identify('s40', this.device.model);
                    if (device.identified)
                    {
                        device.identified |= this.device.identified;
                        this.device = device;
                    }
                }

                if (!!this.device.model)
                {
                    device = DeviceModels.identify('asha', this.device.model);
                    if (device.identified)
                    {
                        device.identified |= this.device.identified;
                        this.os.name = 'Nokia Asha Platform';
                        this.device = device;
                    }
                }
            }

            match = /NOKIALumia([0-9]+)/.exec(ua);
            if (match)
            {
                this.device.manufacturer = 'Nokia';
                this.device.model = match[1];
                this.device.identified |= ID_PATTERN;

                device = DeviceModels.identify('wp', this.device.model);
                if (device.identified)
                {
                    device.identified |= this.device.identified;
                    this.device = device;
                    this.os.name = 'Windows Phone';
                }
            }
        }


        /****************************************************
         *        MicroB
         */

        if (/Maemo[ |_]Browser/.test(ua))
        {
            this.browser.name = 'MicroB';

            match = /Maemo[ |_]Browser[ |_]([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1], 'details': 3 });
            }
        }


        /****************************************************
         *        Silk
         */

        if (/Silk/.test(ua))
        {
            if (/Silk-Accelerated/.test(ua))
            {
                this.browser.name = 'Silk';

                match = /Silk\/([0-9.]*)/.exec(ua);
                if (match)
                {
                    this.browser.version = new Version({ 'value': match[1], 'details': 2 });
                }

                match = /; ([^;]*[^;\s])\s+Build/.exec(ua);
                if (match)
                {
                    this.device = DeviceModels.identify('android', match[1]);
                }

                if (!this.device.identified)
                {
                    this.device.manufacturer = 'Amazon';
                    this.device.model = 'Kindle Fire';
                    this.device.type = TYPE_TABLET;
                    this.device.identified |= ID_INFER;
                }

                if (this.os.name !== 'Android')
                {
                    this.os.name = 'Android';
                    this.os.version = null;
                }
            }
        }

        /****************************************************
         *        Dolfin
         */

        if (/Dolfin/.test(ua) || /Jasmine/.test(ua))
        {
            this.browser.name = 'Dolfin';

            match = /Dolfin\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            match = /Browser\/Dolfin([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            match = /Jasmine\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }
        }

        /****************************************************
         *        Iris
         */

        if (/Iris/.test(ua))
        {
            this.browser.name = 'Iris';

            this.device.type = TYPE_MOBILE;
            this.device.manufacturer = null;
            this.device.model = null;

            this.os.name = 'Windows Mobile';
            this.os.version = null;

            match = /Iris\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            match = / WM([0-9]) /.exec(ua);
            if (match)
            {
                this.os.version = new Version({ 'value': match[1] + '.0' });
            } else {
                this.browser.mode = 'desktop';
            }
        }

        /****************************************************
         *        Boxee
         */

        if (/Boxee/.test(ua))
        {
            this.browser.name = 'Boxee';
            this.device.type = TYPE_TELEVISION;

            match = /Boxee\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }
        }

        /****************************************************
         *        LG Browser
         */

        match = /LG Browser\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'LG Browser';
            this.browser.version = new Version({ 'value': match[1], 'details': 2 });
            this.device.type = TYPE_TELEVISION;
        }

        /****************************************************
         *        Espial
         */

        if (/Espial/.test(ua))
        {
            this.browser.name = 'Espial';

            this.os.name = '';
            this.os.version = null;

            if (this.device.type !== TYPE_TELEVISION)
            {
                this.device.type = TYPE_TELEVISION;
                this.device.manufacturer = null;
                this.device.model = null;
            }

            match = /Espial\/([0-9.]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            if (/;L7200/.test(ua))
            {
                this.device.manufacturer = 'Toshiba';
                this.device.model = 'L7200 Smart TV';
                this.device.identified |= ID_MATCH_UA;
            }
        }

        /****************************************************
         *        ANT Galio
         */

        match = /ANTGalio\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'ANT Galio';
            this.browser.version = new Version({ 'value': match[1], 'details': 3 });
            this.device.type = TYPE_TELEVISION;
        }

        /****************************************************
         *        NetFront
         */

        if (/Net[fF]ront/.test(ua))
        {
            this.browser.name = 'NetFront';
            this.device.type = TYPE_MOBILE;

            match = /NetFront\/?([0-9.]*)/i.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            if (/InettvBrowser/.test(ua))
            {
                this.device.type = TYPE_TELEVISION;
            }
        }

        match = /Browser\/NF([0-9.]*)/i.exec(ua);
        if (match)
        {
            this.browser.name = 'NetFront';
            this.browser.version = new Version({ 'value': match[1] });
            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        NetFront NX
         */

        match = /NX\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'NetFront NX';
            this.browser.version = new Version({ 'value': match[1], 'details': 2 });

            if (!this.device.type || !this.device.type)
            {
                if (/DTV/i.test(ua))
                {
                    this.device.type = TYPE_TELEVISION;
                } else if (/mobile/i.test(ua)) {
                    this.device.type = TYPE_MOBILE;
                } else {
                    this.device.type = TYPE_DESKTOP;
                }
            }

            this.os.name = '';
            this.os.version = null;
        }

        /****************************************************
         *        Obigo
         */

        if (/(?:Obigo|Teleca)/i.test(ua))
        {
            this.browser.name = 'Obigo';

            match = /Obigo\/([0-9.]*)/i.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1] });
            }

            match = /Obigo(?:InternetBrowser)?\/([A-Z])([0-9.]*)/i.exec(ua);
            if (match)
            {
                this.browser.name = 'Obigo ' + match[1];
                this.browser.version = new Version({ 'value': match[2] });
            }

            match = /(?:Obigo|Teleca)[\- ]([A-Z])([0-9.]*)[\/;]/i.exec(ua);
            if (match)
            {
                this.browser.name = 'Obigo ' + match[1];
                this.browser.version = new Version({ 'value': match[2] });
            }

            match = /Browser\/(?:Obigo|Teleca)[_\-](?:Browser\/)?([A-Z])([0-9.]*)/i.exec(ua);
            if (match)
            {
                this.browser.name = 'Obigo ' + match[1];
                this.browser.version = new Version({ 'value': match[2] });
            }
        }

        /****************************************************
         *        UC Web
         */

        if (/UCWEB/.test(ua))
        {
            this.browser.stock = false;
            this.browser.name = 'UC Browser';

            delete this.browser.channel;

            match = /UCWEB\/?([0-9]*[.][0-9]*)/.exec(ua);
            if (match)
            {
                this.browser.version = new Version({ 'value': match[1], 'details': 3 });
            }

            if (!this.device.type)
            {
                this.device.type = TYPE_MOBILE;
            }

            if (!!this.os.name && this.os.name === 'Linux')
            {
                this.os.name = '';
            }

            match = /^IUC ?\(U; ?iOS ([0-9\._]+);/.exec(ua);
            if (match)
            {
                this.os.name = 'iOS';
                this.os.version = new Version({ 'value': match[1].replace(/_/g, '.') });
            }

            match = /^JUC ?\(Linux; ?U; ?([0-9\.]+)[^;]*; ?[^;]+; ?([^;]*[^\s])\s*; ?[0-9]+\*[0-9]+\)/.exec(ua);
            if (match)
            {
                this.os.name = 'Android';
                this.os.version = new Version({ 'value': match[1] });

                this.device = DeviceModels.identify('android', match[2]);
            }

            match = /; Adr ([0-9\.]+); [^;]+; ([^;]*[^\s])\)/.exec(ua);
            if (match)
            {
                this.os.name = 'Android';
                this.os.version = new Version({ 'value': match[1] });

                this.device = DeviceModels.identify('android', match[2]);
            }

            if (/\(iOS;/.test(ua))
            {
                this.os.name = 'iOS';
                this.os.version = new Version({ 'value': '1.0' });

                match = /OS ([0-9_]*);/.exec(ua);
                if (match)
                {
                    this.os.version = new Version({ 'value': match[1].replace(/_/g, '.') });
                }
            }

            if (/\(Windows;/.test(ua))
            {
                this.os.name = 'Windows Phone';
                this.os.version = null;

                match = /wds ([0-9]\.[0-9])/.exec(ua);
                if (match)
                {
                    switch (match[1])
                    {
                        case '7.0':
                            this.os.version = new Version({ 'value': '7.0' });
                            break;
                        case '7.1':
                            this.os.version = new Version({ 'value': '7.5' });
                            break;
                        case '8.0':
                            this.os.version = new Version({ 'value': '8.0' });
                            break;
                    }
                }

                match = /; ([^;]+); ([^;]+)\)/.exec(ua);
                if (match)
                {
                    this.device.manufacturer = match[1];
                    this.device.model = match[2];
                    this.device.identified |= ID_PATTERN;

                    device = DeviceModels.identify('wp', match[2]);

                    if (device.identified)
                    {
                        device.identified |= this.device.identified;
                        this.device = device;
                    }
                }
            }
        }

        if (/ucweb-squid/.test(ua))
        {
            this.browser.stock = false;
            this.browser.name = 'UC Browser';

            delete this.browser.channel;
        }

        if (/\) UC /.test(ua))
        {
            this.browser.stock = false;
            this.browser.name = 'UC Browser';

            delete this.browser.version;
            delete this.browser.channel;
            delete this.browser.mode;

            if (!this.device.type)
            {
                this.device.type = TYPE_MOBILE;
            }

            if (this.device.type === TYPE_DESKTOP)
            {
                this.device.type = TYPE_MOBILE;
                this.browser.mode = 'desktop';
            }
        }

        match = /UC ?Browser\/?([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.stock = false;
            this.browser.name = 'UC Browser';
            this.browser.version = new Version({ 'value': match[1], 'details': 2 });

            delete this.browser.channel;

            if (!this.device.type)
            {
                this.device.type = TYPE_MOBILE;
            }
        }

        /* U2 is the Proxy service used by UC Browser on low-end phones */
        if (/U2\//.test(ua))
        {
            this.engine.name = 'Gecko';
            this.browser.mode = 'proxy';

            /* UC Browser running on Windows 8 is identifing itself as U2, but instead its a Trident Webview */
            if (!!this.os.name && !!this.os.version)
            {
                if (this.os.name === 'Windows Phone' && this.os.version.toFloat() >= 8)
                {
                    this.engine.name = 'Trident';
                    this.browser.mode = '';
                }
            }
        }

        /* U3 is the Webkit based Webview used on Android phones */
        if (/U3\//.test(ua))
        {
            this.engine.name = 'Webkit';
        }


        /****************************************************
         *        NineSky
         */

        match = /Ninesky(?:-android-mobile(?:-cn)?)?\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'NineSky';
            this.browser.version = new Version({ 'value': match[1] });

            if (this.os.name !== 'Android')
            {
                this.os.name = 'Android';
                this.os.version = null;

                this.device.manufacturer = null;
                this.device.model = null;
            }
        }

        /****************************************************
         *        Skyfire
         */

        match = /Skyfire\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'Skyfire';
            this.browser.version = new Version({ 'value': match[1] });

            this.device.type = TYPE_MOBILE;

            this.os.name = 'Android';
            this.os.version = null;
        }

        /****************************************************
         *        Dolphin HD
         */

        match = /DolphinHDCN\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'Dolphin';
            this.browser.version = new Version({ 'value': match[1] });

            this.device.type = TYPE_MOBILE;

            if (this.os.name !== 'Android')
            {
                this.os.name = 'Android';
                this.os.version = null;
            }
        }

        match = /Dolphin\/(?:INT|CN)/.exec(ua);
        if (match)
        {
            this.browser.name = 'Dolphin';
            this.device.type = TYPE_MOBILE;
        }

        /****************************************************
         *        QQ Browser
         */

        match = /(M?QQBrowser)\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'QQ Browser';

            version = match[2];
            if (/^[0-9][0-9]$/.test(version))
            {
                version = version[0] + '.' + version[1];
            }

            this.browser.version = new Version({ 'value': version, 'details': 2 });
            this.browser.channel = '';

            if (!this.os.name && match[1] === 'QQBrowser')
            {
                this.os.name = 'Windows';
            }
        }

        /****************************************************
         *        iBrowser
         */

        match = /(iBrowser)\/([0-9.]*)/.exec(ua);
        if (match && !/OviBrowser/.test(ua))
        {
            this.browser.name = 'iBrowser';

            version = match[2];
            if (/^[0-9][0-9]$/.test(version))
            {
                version = version[0] + '.' + version[1];
            }

            this.browser.version = new Version({ 'value': version, 'details': 2 });
            this.browser.channel = '';
        }

        /****************************************************
         *        Puffin
         */

        match = /Puffin\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'Puffin';
            this.browser.version = new Version({ 'value': match[1], 'details': 2 });
            this.browser.mode = 'proxy';
            this.browser.channel = '';

            this.device.type = TYPE_MOBILE;

            if (this.os.name === 'Linux')
            {
                this.os.name = null;
                this.os.version = null;
            }
        }

        /****************************************************
         *        Midori
         */

        match = /Midori\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'Midori';
            this.browser.version = new Version({ 'value': match[1] });

            this.device.manufacturer = null;
            this.device.model = null;
            this.device.type = TYPE_DESKTOP;

            if (this.os.name === 'Mac OS X' || this.os.name === 'OS X')
            {
                this.os.name = null;
                this.os.version = null;
            }
        }

        if (/midori$/.test(ua))
        {
            this.browser.name = 'Midori';
        }


        /****************************************************
         *        MiniBrowser Mobile
         */

        match = /MiniBr?owserM(?:obile)?\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.browser.name = 'MiniBrowser';
            this.browser.version = new Version({ 'value': match[1] });

            this.os.name = 'Series60';
            this.os.version = null;
        }

        /****************************************************
         *        Maxthon
         */

        match = /Maxthon[\/' ]\(?([0-9.]*)\)?/.exec(ua);
        if (match)
        {
            this.browser.name = 'Maxthon';
            this.browser.version = new Version({ 'value': match[1], 'details': 3 });
            this.browser.channel = '';

            if (this.os.name === 'Windows' && this.browser.version.toFloat() < 4)
            {
                this.browser.version.details = 1;
            }
        }

        /****************************************************
         *        Others
         */
        var browsers = [
            { name: 'AdobeAIR',                 regexp: /AdobeAIR\/([0-9.]*)/ },
            { name: 'Awesomium',                regexp: /Awesomium\/([0-9.]*)/ },
            { name: 'Bsalsa Embedded',          regexp: /EmbeddedWB ([0-9.]*)/ },
            { name: 'Bsalsa Embedded',          regexp: /Embedded Web Browser/ },
            { name: 'Canvace',                  regexp: /Canvace Standalone\/([0-9.]*)/ },
            { name: 'Ekioh',                    regexp: /Ekioh\/([0-9.]*)/ },
            { name: 'JavaFX',                   regexp: /JavaFX\/([0-9.]*)/ },
            { name: 'GFXe',                     regexp: /GFXe\/([0-9.]*)/ },
            { name: 'LuaKit',                   regexp: /luakit/ },
            { name: 'Titanium',                 regexp: /Titanium\/([0-9.]*)/ },
            { name: 'OpenWebKitSharp',          regexp: /OpenWebKitSharp/ },
            { name: 'Prism',                    regexp: /Prism\/([0-9.]*)/ },
            { name: 'Qt',                       regexp: /Qt\/([0-9.]*)/ },
            { name: 'QtEmbedded',               regexp: /QtEmbedded/ },
            { name: 'QtEmbedded',               regexp: /QtEmbedded.*Qt\/([0-9.]*)/ },
            { name: 'RhoSimulator',             regexp: /RhoSimulator/ },
            { name: 'UWebKit',                  regexp: /UWebKit\/([0-9.]*)/ },
            { name: 'Node-WebKit',              regexp: /nw-tests\/([0-9.]*)/ },
            { name: 'WebKit2.NET',              regexp: /WebKit2.NET/ },

            { name: 'PhantomJS',                regexp: /PhantomJS\/([0-9.]*)/ },

            { name: 'Google Earth',             regexp: /Google Earth\/([0-9.]*)/ },
            { name: 'EA Origin',                regexp: /Origin\/([0-9.]*)/ },
            { name: 'SecondLife',               regexp: /SecondLife\/([0-9.]*)/ },
            { name: 'Valve Steam',              regexp: /Valve Steam/ },

            { name: 'Bluefish',                 regexp: /bluefish ([0-9.]*)/ },
            { name: 'Songbird',                 regexp: /Songbird\/([0-9.]*)/ },
            { name: 'Thunderbird',              regexp: /Thunderbird[\/ ]([0-9.]*)/, type: TYPE_DESKTOP },
            { name: 'Microsoft FrontPage',      regexp: /MS FrontPage ([0-9.]*)/, details: 2, type: TYPE_DESKTOP },
            { name: 'Microsoft Outlook',        regexp: /Microsoft Outlook IMO, Build ([0-9.]*)/, details: 2, type: TYPE_DESKTOP },

            { name: '1Browser',                 regexp: /1Password\/([0-9.]*)/ },
            { name: '360 Extreme Explorer',     regexp: /QIHU 360EE/, type: TYPE_DESKTOP },
            { name: '360 Safe Explorer',        regexp: /QIHU 360SE/, type: TYPE_DESKTOP },
            { name: '360 Phone Browser',        regexp: /360 Android Phone Browser \(V([0-9.]*)\)/ },
            { name: '360 Phone Browser',        regexp: /360 Aphone Browser \(Version ([0-9.]*)\)/ },
            { name: 'ABrowse',                  regexp: /A[Bb]rowse ([0-9.]*)/ },
            { name: 'Abrowser',                 regexp: /Abrowser\/([0-9.]*)/ },
            { name: 'AltiBrowser',              regexp: /AltiBrowser\/([0-9.]*)/i },
            { name: 'AOL Desktop',              regexp: /AOL ([0-9.]*); AOLBuild/i },
            { name: 'AOL Browser',              regexp: /America Online Browser (?:[0-9.]*); rev([0-9.]*);/i },
            { name: 'Arachne',                  regexp: /Arachne\/([0-9.]*)/, type: TYPE_DESKTOP },
            { name: 'Arora',                    regexp: /[Aa]rora\/([0-9.]*)/ },                            // see: www.arora-browser.org
            { name: 'Avant Browser',            regexp: /Avant Browser/ },
            { name: 'Avant Browser',            regexp: /Avant TriCore/ },
            { name: 'Baidu Browser',            regexp: /M?BaiduBrowser\/([0-9.]*)/i },
            { name: 'Baidu Browser',            regexp: /BdMobile\/([0-9.]*)/i },
            { name: 'Baidu Browser',            regexp: /FlyFlow\/([0-9.]*)/, details: 2 },
            { name: 'Baidu Browser',            regexp: /BIDUBrowser[ \/]([0-9.]*)/ },
            { name: 'Baidu Browser',            regexp: /BaiduHD\/([0-9.]*)/, details: 2 },
            { name: 'Baidu Spark',              regexp: /BDSpark\/([0-9.]*)/, details: 2 },
            { name: 'Black Wren',               regexp: /BlackWren\/([0-9.]*)/, details: 2 },
            { name: 'BrightSign',               regexp: /BrightSign\/([0-9.]*)/, type: TYPE_SIGNAGE },
            { name: 'Byffox',                   regexp: /Byffox\/([0-9.]*)/, type: TYPE_DESKTOP },
            { name: 'Camino',                   regexp: /Camino\/([0-9.]*)/, type: TYPE_DESKTOP },
            { name: 'Canure',                   regexp: /Canure\/([0-9.]*)/, details: 3 },
            { name: 'CometBird',                regexp: /CometBird\/([0-9.]*)/ },
            { name: 'Comodo Dragon',            regexp: /Comodo_Dragon\/([0-9.]*)/, details: 2 },
            { name: 'Conkeror',                 regexp: /[Cc]onkeror\/([0-9.]*)/ },
            { name: 'CoolNovo',                 regexp: /(?:CoolNovo|CoolNovoChromePlus)\/([0-9.]*)/, details: 3, type: TYPE_DESKTOP },
            { name: 'ChromePlus',               regexp: /ChromePlus(?:\/([0-9.]*))?$/, details: 3, type: TYPE_DESKTOP },
            { name: 'Cunaguaro',                regexp: /Cunaguaro\/([0-9.]*)/, details: 3, type: TYPE_DESKTOP },
            { name: 'Daedalus',                 regexp: /Daedalus ([0-9.]*)/, details: 2 },
            { name: 'Demobrowser',              regexp: /demobrowser\/([0-9.]*)/ },
            { name: 'Doga Rhodonit',            regexp: /DogaRhodonit/ },
            { name: 'Dooble',                   regexp: /Dooble(?:\/([0-9.]*))?/ },
            { name: 'Dorothy',                  regexp: /Dorothy$/ },
            { name: 'DWB',                      regexp: /dwb(?:-hg)?(?:\/([0-9.]*))?/ },
            { name: 'GNOME Web',                regexp: /Epiphany\/([0-9.]*)/, type: TYPE_DESKTOP },
            { name: 'EVM Browser',              regexp: /EVMBrowser\/([0-9.]*)/ },
            { name: 'FireWeb',                  regexp: /FireWeb\/([0-9.]*)/ },
            { name: 'Flock',                    regexp: /Flock\/([0-9.]*)/, details: 3, type: TYPE_DESKTOP },
            { name: 'Galeon',                   regexp: /Galeon\/([0-9.]*)/, details: 3 },
            { name: 'Helium',                   regexp: /HeliumMobileBrowser\/([0-9.]*)/ },
            { name: 'Hive Explorer',            regexp: /HiveE/ },
            { name: 'IBrowse',                  regexp: /IBrowse\/([0-9.]*)/, type: TYPE_DESKTOP },
            { name: 'iCab',                     regexp: /iCab\/([0-9.]*)/ },
            { name: 'Iceape',                   regexp: /Iceape\/([0-9.]*)/ },
            { name: 'IceCat',                   regexp: /IceCat[ \/]([0-9.]*)/, type: TYPE_DESKTOP },
            { name: 'Comodo IceDragon',         regexp: /IceDragon\/([0-9.]*)/, details: 2, type: TYPE_DESKTOP },
            { name: 'Iceweasel',                regexp: /Iceweasel\/([0-9.]*)/, type: TYPE_DESKTOP },
            { name: 'InternetSurfboard',        regexp: /InternetSurfboard\/([0-9.]*)/ },
            { name: 'Iron',                     regexp: /Iron\/([0-9.]*)/, details: 2 },
            { name: 'Isis',                     regexp: /BrowserServer/ },
            { name: 'Isis',                     regexp: /ISIS\/([0-9.]*)/, details: 2 },
            { name: 'Jumanji',                  regexp: /jumanji/ },
            { name: 'Kazehakase',               regexp: /Kazehakase\/([0-9.]*)/ },
            { name: 'KChrome',                  regexp: /KChrome\/([0-9.]*)/, details: 3 },
            { name: 'Kiosk',                    regexp: /Kiosk\/([0-9.]*)/ },
            { name: 'K-Meleon',                 regexp: /K-Meleon\/([0-9.]*)/, type: TYPE_DESKTOP },
            { name: 'Lbbrowser',                regexp: /LBBROWSER/ },
            { name: 'Leechcraft',               regexp: /Leechcraft(?:\/([0-9.]*))?/, details: 2 },
            { name: 'Lightning',                regexp: /Lightning\/([0-9.]*)/ },
            { name: 'Lobo',                     regexp: /Lobo\/([0-9.]*)/, type: TYPE_DESKTOP },
            { name: 'Lotus Expeditor',          regexp: /Gecko Expeditor ([0-9.]*)/, details: 3 },
            { name: 'Lunascape',                regexp: /Lunascape[\/| ]([0-9.]*)/, details: 3 },
            { name: 'Lynx',                     regexp: /Lynx\/([0-9.]*)/ },
            { name: 'iLunascape',               regexp: /iLunascape\/([0-9.]*)/, details: 3 },
            { name: 'Intermec Browser',         regexp: /Intermec\/([0-9.]*)/, details: 2 },
            { name: 'MaCross Mobile',           regexp: /MaCross\/([0-9.]*)/ },
            { name: 'Mammoth',                  regexp: /Mammoth\/([0-9.]*)/ },                                        // see: https://itunes.apple.com/cn/app/meng-ma-liu-lan-qi/id403760998?mt=8
            { name: 'Mercury Browser',          regexp: /Mercury\/([0-9.]*)/ },
            { name: 'MixShark',                 regexp: /MixShark\/([0-9.]*)/ },
            { name: 'mlbrowser',                regexp: /mlbrowser/ },
            { name: 'Motorola WebKit',          regexp: /MotorolaWebKit(?:\/([0-9.]*))?/, details: 3 },
            { name: 'NetFront LifeBrowser',     regexp: /NetFrontLifeBrowser\/([0-9.]*)/ },
            { name: 'NetPositive',              regexp: /NetPositive\/([0-9.]*)/ },
            { name: 'Netscape Navigator',       regexp: /Navigator\/([0-9.]*)/, details: 3 },
            { name: 'Odyssey',                  regexp: /OWB\/([0-9.]*)/ },
            { name: 'OmniWeb',                  regexp: /OmniWeb/, type: TYPE_DESKTOP },
            { name: 'OneBrowser',               regexp: /OneBrowser\/([0-9.]*)/ },
            { name: 'Openwave',                 regexp: /Openwave\/([0-9.]*)/, details: 2 },
            { name: 'Orca',                     regexp: /Orca\/([0-9.]*)/ },
            { name: 'Origyn',                   regexp: /Origyn Web Browser/ },
            { name: 'Otter',                    regexp: /Otter Browser\/([0-9.]*)/ },
            { name: 'Palemoon',                 regexp: /Pale[mM]oon\/([0-9.]*)/ },
            { name: 'Phantom',                  regexp: /Phantom\/V([0-9.]*)/ },
            { name: 'Polaris',                  regexp: '/Polaris[\/ ]v?([0-9.]*)/i', details: 2 },
            { name: 'Qihoo 360',                regexp: /QIHU THEWORLD/ },
            { name: 'QtCreator',                regexp: /QtCreator\/([0-9.]*)/ },
            { name: 'QtQmlViewer',              regexp: /QtQmlViewer/ },
            { name: 'QtTestBrowser',            regexp: /QtTestBrowser\/([0-9.]*)/ },
            { name: 'QtWeb',                    regexp: /QtWeb Internet Browser\/([0-9.]*)/ },
            { name: 'QupZilla',                 regexp: /QupZilla\/([0-9.]*)/, type: TYPE_DESKTOP },
            { name: 'Ryouko',                   regexp: /Ryouko\/([0-9.]*)/, type: TYPE_DESKTOP },                        // see: https://github.com/foxhead128/ryouko
            { name: 'Roccat',                   regexp: /Roccat\/([0-9]\.[0-9.]*)/ },
            { name: 'Raven for Mac',            regexp: /Raven for Mac\/([0-9.]*)/ },
            { name: 'rekonq',                   regexp: /rekonq(?:\/([0-9.]*))?/, type: TYPE_DESKTOP },
            { name: 'RockMelt',                 regexp: /RockMelt\/([0-9.]*)/, details: 2 },
            { name: 'SaaYaa Explorer',          regexp: /SaaYaa/, type: TYPE_DESKTOP },
            { name: 'Sleipnir',                 regexp: /Sleipnir\/([0-9.]*)/, details: 3 },
            { name: 'SlimBoat',                 regexp: /SlimBoat\/([0-9.]*)/ },
            { name: 'SMBrowser',                regexp: /SMBrowser/ },
            { name: 'Sogou Explorer',           regexp: /SE 2.X MetaSr/, type: TYPE_DESKTOP },
            { name: 'Sogou Mobile',             regexp: /SogouMobileBrowser\/([0-9.]*)/, details: 2 },
            { name: 'Snowshoe',                 regexp: /Snowshoe\/([0-9.]*)/, details: 2 },
            { name: 'Sputnik',                  regexp: '/Sputnik\/([0-9.]*)/i', details: 3 },
            { name: 'Stainless',                regexp: /Stainless\/([0-9.]*)/ },
            { name: 'SunChrome',                regexp: /SunChrome\/([0-9.]*)/ },
            { name: 'Surf',                     regexp: /Surf\/([0-9.]*)/ },
            { name: 'The World',                regexp: /TheWorld ([0-9.]*)/ },
            { name: 'TaoBrowser',               regexp: /TaoBrowser\/([0-9.]*)/, details: 2 },
            { name: 'TaomeeBrowser',            regexp: /TaomeeBrowser\/([0-9.]*)/, details: 2 },
            { name: 'TazWeb',                   regexp: /TazWeb/ },
            { name: 'Tencent Traveler',         regexp: /TencentTraveler ([0-9.]*)/, details: 2 },
            { name: 'UP.Browser',               regexp: /UP\.Browser\/([a-z0-9.]*)/, details: 2 },
            { name: 'Uzbl',                     regexp: /^Uzbl/ },
            { name: 'Viera',                    regexp: /Viera\/([0-9.]*)/ },
            { name: 'Villanova',                regexp: /Villanova\/([0-9.]*)/, details: 3 },
            { name: 'Waterfox',                 regexp: /Waterfox\/([0-9.]*)/, details: 2, type: TYPE_DESKTOP },
            { name: 'Wavelink Velocity',        regexp: /Wavelink Velocity Browser\/([0-9.]*)/, details: 2 },
            { name: 'WebLite',                  regexp: /WebLite\/([0-9.]*)/, type: TYPE_MOBILE },
            { name: 'WebPositive',              regexp: /WebPositive/ },
            { name: 'WebRender',                regexp: /WebRender/ },
            { name: 'Webster',                  regexp: /Webster ([0-9.]*)/ },
            { name: 'Wyzo',                     regexp: /Wyzo\/([0-9.]*)/, details: 3 },
            { name: 'Miui Browser',             regexp: /XiaoMi\/MiuiBrowser\/([0-9.]*)/ },
            { name: 'Yandex Browser',           regexp: /YaBrowser\/([0-9.]*)/, details: 2 },
            { name: 'Yelang',                   regexp: /Yelang\/([0-9.]*)/, details: 3 },                            // see: wellgo.org
            { name: 'YRC Weblink',              regexp: /YRCWeblink\/([0-9.]*)/ },
            { name: 'Zetakey',                  regexp: /Zetakey Webkit\/([0-9.]*)/ },
            { name: 'Zetakey',                  regexp: /Zetakey\/([0-9.]*)/ },

            { name: 'Nimbus',                   regexp: /Nimbus\/([0-9.]*)/ },

            { name: 'McAfee Web Gateway',       regexp: /Webwasher\/([0-9.]*)/ },

            { name: 'Open Sankoré',             regexp: /Open-Sankore\/([0-9.]*)/, type: TYPE_WHITEBOARD },
            { name: 'Coship MMCP',              regexp: /Coship_MMCP_([0-9.]*)/, type: TYPE_SIGNAGE },

            { name: '80legs',                   regexp: /008\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'Ask Jeeves',               regexp: /Ask Jeeves\/Teoma/, type: TYPE_BOT },
            { name: 'Baiduspider',              regexp: /Baiduspider[\+ ]\([\+ ]/, type: TYPE_BOT },
            { name: 'Baiduspider',              regexp: /Baiduspider\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'Bing',                     regexp: /bingbot\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'Bing',                     regexp: /msnbot\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'Bing Preview',             regexp: /BingPreview\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'Bloglines',                regexp: /Bloglines\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'Googlebot',                regexp: /Google[Bb]ot\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'Google App Engine',        regexp: /AppEngine-Google/, type: TYPE_BOT },
            { name: 'Google Web Preview',       regexp: /Google Web Preview/, type: TYPE_BOT },
            { name: 'Google Page Speed',        regexp: /Google Page Speed Insights/, type: TYPE_BOT },
            { name: 'Google Feed Fetcher',      regexp: /FeedFetcher-Google/, type: TYPE_BOT },
            { name: 'Google Font Analysis',     regexp: /Google-FontAnalysis\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'Grub',                     regexp: /grub-client-([0-9.]*)/, type: TYPE_BOT },
            { name: 'HeartRails Capture',       regexp: /HeartRails_Capture\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'CiteSeerX',                regexp: /heritrix\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'Sogou Web Spider',         regexp: /Sogou web spider\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'Yahoo Slurp',              regexp: /Yahoo! Slurp\/([0-9.]*)/, type: TYPE_BOT },
            { name: 'Wget',                     regexp: /Wget\/([0-9.]*)/, type: TYPE_BOT }
        ];

        for (var b = 0; b < browsers.length; b += 1)
        {
            match = (new RegExp(browsers[b].regexp)).exec(ua);
            if (match)
            {
                this.browser.name = browsers[b].name;
                this.browser.channel = '';
                this.browser.hidden = false;
                this.browser.stock = false;

                if (!!match[1] && match[1])
                {
                    this.browser.version = new Version({ 'value': match[1], details: browsers[b].details || null });
                } else {
                    this.browser.version = null;
                }

                if (!!browsers[b].type)
                {
                    this.device.type = browsers[b].type;
                }
            }
        }


        /****************************************************
         *        WebKit
         */

        match = /WebKit\/([0-9.]*)/i.exec(ua);
        if (match)
        {
            this.engine.name = 'Webkit';
            this.engine.version = new Version({ 'value': match[1] });

            match = /(?:Chrome|Chromium)\/([0-9]*)/.exec(ua);
            if (match)
            {
                if (parseInt(match[1], 10) >= 27)
                {
                    this.engine.name = 'Blink';
                }
            }
        }

        match = /Browser\/AppleWebKit([0-9.]*)/i.exec(ua);
        if (match)
        {
            this.engine.name = 'Webkit';
            this.engine.version = new Version({ 'value': match[1] });
        }

        match = /AppleWebkit\(like Gecko\)/i.exec(ua);
        if (match)
        {
            this.engine.name = 'Webkit';
        }


        /****************************************************
         *        KHTML
         */

        match = /KHTML\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.engine.name = 'KHTML';
            this.engine.version = new Version({ 'value': match[1] });
        }

        /****************************************************
         *        Gecko
         */

        if (/Gecko/.test(ua) && !/like Gecko/.test(ua))
        {
            this.engine.name = 'Gecko';

            match = /; rv:([^\)]+)\)/.exec(ua);
            if (match)
            {
                this.engine.version = new Version({ 'value': match[1] });
            }
        }

        /****************************************************
         *        Presto
         */

        match = /Presto\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.engine.name = 'Presto';
            this.engine.version = new Version({ 'value': match[1] });
        }

        /****************************************************
         *        Trident
         */

        match = /Trident\/([0-9.]*)/.exec(ua);
        if (match)
        {
            this.engine.name = 'Trident';
            this.engine.version = new Version({ 'value': match[1] });


            if (this.browser.name === 'Internet Explorer')
            {
                if (this.engine.version.toNumber() === 7 && this.browser.version.toFloat() < 11)
                {
                    this.browser.version = new Version({ 'value': '11.0' });
                    this.browser.mode = 'compat';
                }

                if (this.engine.version.toNumber() === 6 && this.browser.version.toFloat() < 10)
                {
                    this.browser.version = new Version({ 'value': '10.0' });
                    this.browser.mode = 'compat';
                }

                if (this.engine.version.toNumber() === 5 && this.browser.version.toFloat() < 9)
                {
                    this.browser.version = new Version({ 'value': '9.0' });
                    this.browser.mode = 'compat';
                }

                if (this.engine.version.toNumber() === 4 && this.browser.version.toFloat() < 8)
                {
                    this.browser.version = new Version({ 'value': '8.0' });
                    this.browser.mode = 'compat';
                }
            }

            if (this.os.name === 'Windows Phone')
            {
                if (this.engine.version.toNumber() === 6 && this.browser.version.toFloat() < 8)
                {
                    this.os.version = new Version({ 'value': '8.0' });
                }

                if (this.engine.version.toNumber() === 5 && this.browser.version.toFloat() < 7.5)
                {
                    this.os.version = new Version({ 'value': '7.5' });
                }
            }
        }


        /****************************************************
         *        Corrections
         */

        if (!!this.os.name)
        {
            if (this.os.name === 'Android' && this.browser.stock)
            {
                this.browser.hidden = true;
            }

            if (this.os.name === 'Aliyun OS' && this.browser.stock)
            {
                this.browser.hidden = true;
            }
        }

        if (!!this.os.name && !!this.browser.name)
        {
            if (this.os.name === 'iOS' && this.browser.name === 'Opera Mini')
            {
                this.os.version = null;
            }

            if (this.os.name === 'Series80' && this.browser.name === 'Internet Explorer')
            {
                this.browser.name = null;
                this.browser.version = null;
            }
        }

        if (!!this.browser.name && !!this.engine.name)
        {
            if (this.browser.name === 'Midori' && this.engine.name !== 'Webkit')
            {
                this.engine.name = 'Webkit';
                this.engine.version = null;
            }
        }


        if (!!this.browser.name && this.browser.name === 'Firefox Mobile' && !this.os.name)
        {
            this.os.name = 'Firefox OS';
        }


        if (!!this.browser.name && this.browser.name === 'Opera' && this.device.type === TYPE_TELEVISION)
        {
            this.browser.name = 'Opera Devices';

            match = /Presto\/([0-9]+\.[0-9]+)/.exec(ua);
            if (match)
            {
                switch (match[1])
                {
                    case '2.12':
                        this.browser.version = new Version({ value: '3.4' });
                        break;
                    case '2.11':
                        this.browser.version = new Version({ value: '3.3' });
                        break;
                    case '2.10':
                        this.browser.version = new Version({ value: '3.2' });
                        break;
                    case '2.9':
                        this.browser.version = new Version({ value: '3.1' });
                        break;
                    case '2.8':
                        this.browser.version = new Version({ value: '3.0' });
                        break;
                    case '2.7':
                        this.browser.version = new Version({ value: '2.9' });
                        break;
                    case '2.6':
                        this.browser.version = new Version({ value: '2.8' });
                        break;
                    case '2.4':
                        this.browser.version = new Version({ value: '10.3' });
                        break;
                    case '2.3':
                        this.browser.version = new Version({ value: '10' });
                        break;
                    case '2.2':
                        this.browser.version = new Version({ value: '9.7' });
                        break;
                    case '2.1':
                        this.browser.version = new Version({ value: '9.6' });
                        break;
                    default:
                        delete this.browser.version;
                }
            }

            delete this.os.name;
            delete this.os.version;
        }

        if (!!this.browser.name)
        {
            if (this.browser.name === 'UC Browser')
            {
                if (this.device.type === 'desktop' || (!!this.os.name && (this.os.name === 'Windows' || this.os.name === 'Mac OS X')))
                {
                    this.device.type = TYPE_MOBILE;

                    this.browser.mode = 'desktop';

                    delete this.engine.name;
                    delete this.engine.version;
                    delete this.os.name;
                    delete this.os.version;
                }

                else if (!this.os.name || (this.os.name !== 'iOS' && this.os.name !== 'Windows Phone' && this.os.name !== 'Android' && this.os.name !== 'Aliyun OS'))
                {
                    this.engine.name = 'Gecko';
                    delete this.engine.version;
                    this.browser.mode = 'proxy';
                }

                if (!!this.engine.name && this.engine.name === 'Presto')
                {
                    this.engine.name = 'Webkit';
                    delete this.engine.version;
                }
            }
        }

        if (!!this.device.flag && this.device.flag === FLAG_GOOGLETV)
        {
            this.os.name = 'Google TV';

            delete this.os.version;
            delete this.device.flag;
        }

        if (!!this.device.flag && this.device.flag === FLAG_GOOGLEGLASS)
        {
            delete this.os.name;
            delete this.os.version;
            delete this.device.flag;
        }


        if (this.device.type === TYPE_BOT)
        {
            this.device.identified = false;
            delete this.os.name;
            delete this.os.version;
            delete this.device.manufacturer;
            delete this.device.model;
        }

        if (!this.device.identified && !!this.device.model)
        {
            if (/^[a-z][a-z]-[a-z][a-z]$/.test(this.device.model))
            {
                this.device.model = null;
            }
        }


        if (!!this.os.name && this.os.name === 'Android')
        {
            match = /Build\/([^\);]+)/.exec(ua);
            if (match)
            {
                version = BuildIds.identify('android', match[1]);

                if (version)
                {
                    if (!this.os.version || this.os.version === null || this.os.version.value === null || version.toFloat() < this.os.version.toFloat())
                    {
                        this.os.version = version;
                    }
                }

                this.os.build = match[1];
            }
        }

    };


WhichBrowser.prototype.detectCamouflage = function () {

    var match, webkitMatch, safariMatch;

    if (!!this.options.useragent && this.options.useragent !== '')
    {
        if (this.options.useragent === 'Mozilla/5.0 (X11; U; Linux i686; zh-CN; rv:1.2.3.4) Gecko/')
        {

            if (this.browser.name !== 'UC Browser')
            {
                this.browser.name = 'UC Browser';
                this.browser.version = null;
                this.browser.stock = false;
            }

            if (this.os.name === 'Windows')
            {
                this.os.name = '';
                this.os.version = null;
            }

            this.engine.name = 'Gecko';
            this.engine.version = null;

            this.device.type = 'mobile';
        }


        match = /Mac OS X 10_6_3; ([^;]+); [a-z]{2}-(?:[a-z]{2})?\)/.exec(this.options.useragent);
        if(match)
        {
            this.browser.name = '';
            this.browser.version = null;
            this.browser.mode = 'desktop';

            this.os.name = 'Android';
            this.os.version = null;

            this.engine.name = 'Webkit';
            this.engine.version = null;

            this.features.push('foundDevice');
        }

        match = /Linux Ventana; [a-z]{2}-[a-z]{2}; (.+) Build/.exec(this.options.useragent);
        if(match)
        {
            this.browser.name = '';
            this.browser.version = null;
            this.browser.mode = 'desktop';

            this.os.name = 'Android';
            this.os.version = null;

            this.engine.name = 'Webkit';
            this.engine.version = null;

            this.features.push('foundDevice');
        }

        if (this.browser.name === 'Safari')
        {
            webkitMatch = /AppleWebKit\/([0-9]+.[0-9]+)/i.exec(this.options.useragent);
            safariMatch = /Safari\/([0-9]+.[0-9]+)/i.exec(this.options.useragent);

            if (this.os.name !== 'iOS' && webkitMatch[1] !== safariMatch[1])
            {
                this.features.push('safariMismatch');
                this.camouflage = true;
            }

            if (this.os.name === 'iOS' && !/^Mozilla/.test(this.options.useragent))
            {
                this.features.push('noMozillaPrefix');
                this.camouflage = true;
            }

            if (!/Version\/[0-9\.]+/.test(this.options.useragent))
            {
                this.features.push('noVersion');
                this.camouflage = true;
            }
        }

        if (this.browser.name === 'Chrome')
        {
            if (!/(?:Chrome|CrMo|CriOS)\/([0-9]{1,2}\.[0-9]\.[0-9]{3,4}\.[0-9]+)/.test(this.options.useragent))
            {
                this.features.push('wrongVersion');
                this.camouflage = true;
            }
        }
    }

    if (!!this.options.engine)
    {
        if (!!this.engine.name && this.browser.mode !== 'proxy')
        {
            /* If it claims not to be Trident, but it is probably Trident running camouflage mode */
            if (this.options.engine & ENGINE_TRIDENT)
            {
                this.features.push('trident');

                if (this.engine.name && this.engine.name !== 'Trident')
                {
                    this.camouflage = !this.browser.name || (this.browser.name !== 'Maxthon' && this.browser.name !== 'Motorola WebKit');
                }
            }

            /* If it claims not to be Opera, but it is probably Opera running camouflage mode */
            if (this.options.engine & ENGINE_PRESTO)
            {
                this.features.push('presto');

                if (this.engine.name && this.engine.name !== 'Presto')
                {
                    this.camouflage = true;
                }

                if (!!this.browser.name && this.browser.name === 'Internet Explorer')
                {
                    this.camouflage = true;
                }
            }

            /* If it claims not to be Gecko, but it is probably Gecko running camouflage mode */
            if (this.options.engine & ENGINE_GECKO)
            {
                this.features.push('gecko');

                if (this.engine.name && this.engine.name !== 'Gecko')
                {
                    this.camouflage = true;
                }

                if (!!this.browser.name && this.browser.name === 'Internet Explorer')
                {
                    this.camouflage = true;
                }
            }

            /* If it claims not to be Webkit, but it is probably Webkit running camouflage mode */
            if (this.options.engine & ENGINE_WEBKIT)
            {
                this.features.push('webkit');

                if (this.engine.name && (this.engine.name !== 'Blink' && this.engine.name !== 'Webkit'))
                {
                    this.camouflage = true;
                }

                if (!!this.browser.name && this.browser.name === 'Internet Explorer')
                {
                    this.camouflage = true;
                }
            }

            if (this.options.engine & ENGINE_CHROMIUM)
            {
                this.features.push('chrome');

                if (this.engine.name && (this.engine.name !== 'Blink' && this.engine.name !== 'Webkit'))
                {
                    this.camouflage = true;
                }
            }

            /* If it claims to be Safari and uses V8, it is probably an Android device running camouflage mode */
            if (this.engine.name === 'Webkit' && this.options.engine & ENGINE_V8)
            {
                this.features.push('v8');

                if (!!this.browser.name && this.browser.name === 'Safari')
                {
                    this.camouflage = true;
                }
            }

        }
    }

    if (!!this.options.width && !!this.options.height)
    {
        if (!!this.device.model)
        {
            /* If we have an iPad that is not 768 x 1024, we have an imposter */
            if (this.device.model === 'iPad')
            {
                if ((this.options.width !== 0 && this.options.height !== 0) &&
                    (this.options.width !== 768 && this.options.height !== 1024) &&
                    (this.options.width !== 1024 && this.options.height !== 768))
                {
                    this.features.push('sizeMismatch');
                    this.camouflage = true;
                }
            }

            /* If we have an iPhone or iPod that is not 320 x 480, we have an imposter */
            if (this.device.model === 'iPhone' || this.device.model === 'iPod')
            {
                if ((this.options.width !== 0 && this.options.height !== 0) &&
                    (this.options.width !== 320 && this.options.height !== 480) &&
                    (this.options.width !== 480 && this.options.height !== 320))
                {
                    this.features.push('sizeMismatch');
                    this.camouflage = true;
                }
            }
        }
    }

    if (!!this.options.features)
    {
        if (!!this.browser.name && !!this.os.name)
        {

            if (this.os.name === 'iOS' &&
                this.browser.name !== 'Opera Mini' &&
                this.browser.name !== 'UC Browser' &&
                !!this.os.version)
            {

                if (this.os.version.toFloat() < 4.0 && this.options.features & FEATURE_SANDBOX)
                {
                    this.features.push('foundSandbox');
                    this.camouflage = true;
                }

                if (this.os.version.toFloat() < 4.2 && this.options.features & FEATURE_WEBSOCKET)
                {
                    this.features.push('foundSockets');
                    this.camouflage = true;
                }

                if (this.os.version.toFloat() < 5.0 && this.options.features & FEATURE_WORKER)
                {
                    this.features.push('foundWorker');
                    this.camouflage = true;
                }

                if (this.os.version.toFloat() > 2.1 && !this.options.features & FEATURE_APPCACHE)
                {
                    this.features.push('noAppCache');
                    this.camouflage = true;
                }
            }

            if (this.os.name !== 'iOS' && this.browser.name === 'Safari' && !!this.browser.version)
            {

                if (this.browser.version.toFloat() < 4.0 && this.options.features & FEATURE_APPCACHE)
                {
                    this.features.push('foundAppCache');
                    this.camouflage = true;
                }

                if (this.browser.version.toFloat() < 4.1 && this.options.features & FEATURE_HISTORY)
                {
                    this.features.push('foundHistory');
                    this.camouflage = true;
                }

                if (this.browser.version.toFloat() < 5.1 && this.options.features & FEATURE_FULLSCREEN)
                {
                    this.features.push('foundFullscreen');
                    this.camouflage = true;
                }

                if (this.browser.version.toFloat() < 5.2 && this.options.features & FEATURE_FILEREADER)
                {
                    this.features.push('foundFileReader');
                    this.camouflage = true;
                }
            }
        }
    }
};


WhichBrowser.prototype.analyseWapProfile = function (url) {
    url = url.trim();

    if (url[0] === '"')
    {
        url = url.split(",");
        url = url[0].replace(/(^a)/, '').replace(/c$/, '');
    }

    var result = DeviceProfiles.identify(url);

    if (result)
    {
        if (result[0] && result[1])
        {
            this.device.manufacturer = result[0];
            this.device.model = result[1];
            this.device.identified |= ID_MATCH_PROF;
        }

        if (result[2] && (!this.os.name || this.os.name !== result[2]))
        {
            this.os.name = result[2];
            this.os.version = null;

            this.engine.name = null;
            this.engine.version = null;
        }

        if (result[3])
        {
            this.device.type = result[3];
        }
    }
};


WhichBrowser.prototype.analyseBrowserId = function (id) {

    var browser = BrowserIds.identify('android', id);

    if (browser)
    {
        if (!this.browser.name || this.browser.name !== browser)
        {
            this.browser.name = browser;

            if (this.browser.name.substr(0, browser.length) !== browser)
            {
                this.browser.version = null;
                this.browser.stock = false;
            }
        }
    }

    if (this.os.name !== 'Android' && this.os.name !== 'Aliyun OS')
    {
        this.os.name = 'Android';
        this.os.version = null;

        this.device.manufacturer = null;
        this.device.model = null;
        this.device.identified = ID_NONE;

        if (this.device.type !== TYPE_MOBILE && this.device.type !== TYPE_TABLET)
        {
            this.device.type = TYPE_MOBILE;
        }
    }

    if (this.engine.name !== 'Webkit')
    {
        this.engine.name = 'Webkit';
        this.engine.version = null;
    }
};


WhichBrowser.prototype.analyseAlternativeUserAgent = function (ua) {

    var extra = new WhichBrowser({headers: { "User-Agent": ua} });

    if (extra.device.type !== TYPE_DESKTOP)
    {
        if (!!extra.os.name)
        {
            this.os = extra.os;
        }
        if (extra.device.identified)
        {
            this.device = extra.device;
        }
    }

};


WhichBrowser.prototype.analyseBaiduHeader = function (/*ua*/) {
    if (this.browser.name !== 'Baidu Browser')
    {
        this.browser.name = 'Baidu Browser';
        this.browser.version = null;
        this.browser.stock = false;
    }
};


WhichBrowser.prototype.analyseOldUCUserAgent = function (ua) {

    if (this.device.type === TYPE_DESKTOP)
    {
        this.device.type = TYPE_MOBILE;

        this.os.name = null;
        this.os.version = null;
    }

    if (this.browser.name !== 'UC Browser')
    {
        this.browser.name = 'UC Browser';
        this.browser.version = null;
    }

    var extra = new WhichBrowser({headers: {"User-Agent": ua}});

    if (extra.device.type !== TYPE_DESKTOP)
    {
        if (!!extra.os.version)
        {
            this.os = extra.os;
        }
        if (extra.device.identified)
        {
            this.device = extra.device;
        }
    }
};


WhichBrowser.prototype.analyseNewUCUserAgent = function (ua) {

    var match, device;

    match = /pr\(UCBrowser\/([0-9\.]+)/.exec(ua);
    if(match)
    {
        this.browser.name = 'UC Browser';
        this.browser.version = new Version({ value: match[1], details: 2 });
        this.browser.stock = false;
    }

    /* Find os */
    match = /ov\(Android ([0-9\.]+)/.exec(ua);
    if (/pf\(Linux\)/.test(ua) && match)
    {
        this.os.name = 'Android';
        this.os.version = new Version({ value: match[1] });
    }


    if (/pf\(Symbian\)/.test(ua) && /ov\(S60V5/.test(ua))
    {
        if (!this.os.name || this.os.name !== 'Series60')
        {
            this.os.name = 'Series60';
            this.os.version = new Version({ value: 5 });
        }
    }

    match = /ov\(wds ([0-9\.]+)/.exec(ua);
    if (/pf\(Windows\)/.test(ua) && match)
    {
        if (!this.os.name || this.os.name !== 'Windows Phone')
        {
            this.os.name = 'Windows Phone';

            switch(match[1])
            {
                case '7.0':
                    this.os.version = new Version({ value: '7.0' });
                    break;
                case '7.1':
                    this.os.version = new Version({ value: '7.5' });
                    break;
                case '8.0':
                    this.os.version = new Version({ value: '8.0' });
                    break;
            }
        }
    }

    match = /ov\((?:iPh OS )?(?:iOS )?([0-9_]+)/.exec(ua);
    if (/pf\((?:42|44)\)/.test(ua) && match)
    {
        if (!this.os.name || this.os.name !== 'iOS')
        {
            this.os.name = 'iOS';
            this.os.version = new Version({ value: match[1].replace(/_/g, '.') });
        }
    }

    /* Find engine */
    match = /re\(AppleWebKit\/([0-9\.]+)/.exec(ua);
    if(match)
    {
        this.engine.name = 'Webkit';
        this.engine.version = new Version({ value: match[1] });
    }

    /* Find device */
    if (!!this.os.name && this.os.name === 'Android')
    {
        match = /dv\((.*)\s+Build/.exec(ua);
        if(match)
        {
            device = DeviceModels.identify('android', match[1]);

            if (device)
            {
                this.device = device;
            }
        }
    }

    if (!!this.os.name && this.os.name === 'Series60')
    {
        match = /dv\((?:Nokia)?([^\)]*)\)/.exec(ua);
        if(match)
        {
            device = DeviceModels.identify('s60', match[1]);

            if (device)
            {
                this.device = device;
            }
        }
    }

    if (!!this.os.name && this.os.name === 'Windows Phone')
    {
        match = /dv\(([^\)]*)\)/.exec(ua);
        if(match)
        {
            device = DeviceModels.identify('wp', match[1].substr(match[1].indexOf(' ') + 1));

            if (device)
            {
                this.device = device;
            }
        }
    }

    if (!!this.os.name && this.os.name === 'iOS')
    {
        match = /dv\(([^\)]*)\)/.exec(ua);
        if(match)
        {
            device = DeviceModels.identify('ios', match[1]);

            if (device)
            {
                this.device = device;
            }
        }
    }
};


WhichBrowser.prototype.analysePuffinUserAgent = function (ua) {
    var parts = ua.split('/');
    var device;

    if (this.browser.name !== 'Puffin')
    {
        this.browser.name = 'Puffin';
        this.browser.version = null;
        this.browser.stock = false;
    }

    this.device.type = 'mobile';

    if (parts.length > 1 && parts[0] === 'Android')
    {
        if (!this.os.name || this.os.name !== 'Android')
        {
            this.os.name = 'Android';
            this.os.version = null;
        }

        device = DeviceModels.identify('android', parts[1]);
        if (device.identified)
        {
            device.identified |= this.device.identified;
            this.device = device;
        }
    }

    if (parts.length > 1 && parts[0] === 'iPhone OS')
    {
        if (!this.os.name || this.os.name !== 'iOS')
        {
            this.os.name = 'iOS';
            this.os.version = null;
        }

        device = DeviceModels.identify('ios', parts[1]);

        if (device.identified)
        {
            device.identified |= this.device.identified;
            this.device = device;
        }
    }
};



//    function toJavaScript()
//    {
//        if (!!this.browser)
//        {
//            echo "this.browser = new Browser({ ";
//            echo this.toJavaScriptObject(this.browser);
//            echo " });\n";
//        }
//
//        if (!!this.engine)
//        {
//            echo "this.engine = new Engine({ ";
//            echo this.toJavaScriptObject(this.engine);
//            echo " });\n";
//        }
//
//        if (!!this.os)
//        {
//            echo "this.os = new Os({ ";
//            echo this.toJavaScriptObject(this.os);
//            echo " });\n";
//        }
//
//        if (!!this.device)
//        {
//            echo "this.device = new Device({ ";
//            echo this.toJavaScriptObject(this.device);
//            echo " });\n";
//        }
//
//        echo "this.camouflage = " + (this.camouflage ? 'true' : 'false') + ";\n";
//        echo "this.features = " + json_encode(this.features) + ";\n";
//    }
//
//    function toJavaScriptObject($object) {
//        $lines = [];
//
//        foreach ((array)$object as $key: $value) {
//            if (!is_null($value)) {
//                $line = $key + ": ";
//
//                if ($key === 'version') {
//                    $line .= 'new Version({ ' + this.toJavaScriptObject($value) + ' })';
//                } else {
//                    switch (gettype($value))
//                    {
//                        case 'boolean':
//                            $line .= $value ? 'true' : 'false';
//                            break;
//                        case 'string':
//                            $line .= '"' + addslashes($value) + '"';
//                            break;
//                        case 'integer':
//                            $line .= $value;
//                            break;
//                    }
//                }
//
//                $lines[] = $line;
//            }
//        }
//
//        return $lines.join(", ");
//    }
//}














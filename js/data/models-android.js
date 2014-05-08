    var ANDROID_MODELS = {

    /* Generic identifiers */
    'Android': [ null, null ],
    'google sdk': [ null, null, TYPE_EMULATOR ],
    'sdk': [ null, null, TYPE_EMULATOR ],
    'generic': [ null, null ],
    'generic x86': [ null, null ],
    'VirtualBox!': [ null, null, TYPE_EMULATOR ],

    /* Development boards and kits */
    'amd brazos': [ 'AMD', 'Fusion based device' ],
    'Amlogic M1 reference board': [ 'Amlogic', 'M1 reference board' ],
    'AML8726M': [ 'Amlogic', 'AML8726-M based device' ],
    'vexpress a9': [ 'ARM', 'Versatile Express development platform' ],
    'sama5d3': [ 'Atmel', 'SAMA5D3 based device' ],
    'BEAGLEBONE': [ 'BeagleBoard', 'BeagleBone' ],
    'NITROGEN6X': [ 'Boundary Devices', 'Nitrogen6X' ],
    'bcm7231': [ 'Broadcom', 'BCM7231 based device', TYPE_TELEVISION ],
    'bcm7425': [ 'Broadcom', 'BCM7425 based device', TYPE_TELEVISION ],
    'bcm7429': [ 'Broadcom', 'BCM7429 based device', TYPE_TELEVISION ],
    'bcm7435': [ 'Broadcom', 'BCM7435 based device', TYPE_TELEVISION ],
    'bcm7445': [ 'Broadcom', 'BCM7445 based device', TYPE_TELEVISION ],
    'BCM21664!': [ 'Broadcom', 'BCM21664 based device' ],
    'BCM23550!': [ 'Broadcom', 'BCM23550 based device' ],
    'BCM28145!': [ 'Broadcom', 'BCM28145 based device' ],
    'BCM28155!': [ 'Broadcom', 'BCM28155 based device' ],
    'imx50!': [ 'Freescale', 'i.MX50 based device' ],
    'imx51!': [ 'Freescale', 'i.MX51 based device' ],
    'imx53!': [ 'Freescale', 'i.MX53 based device' ],
    'imx6q!': [ 'Freescale', 'i.MX6Q based device' ],
    'SABRESD-MX6DQ': [ 'Freescale', 'i.MX6DQ based device' ],
    'ODROID-A': [ 'Hardkernel', 'ODROID-A developer tablet', TYPE_TABLET ],
    'ODROID-U2': [ 'Hardkernel', 'ODROID-U2 developer board' ],
    'ODROID-XU': [ 'Hardkernel', 'ODROID-XU developer board' ],
    'cedartrail': [ 'Intel', 'Cedar Trail based device' ],
    'mfld (dv10|dv20|lw00|pr2|pr3)!': [ 'Intel', 'Medfield based device' ],
    'redhookbay': [ 'Intel', 'Merrifield based device' ],
    'Shark Bay Client platform': [ 'Intel', 'Haswell based device' ],
    'BP710A': [ 'Intel', 'Yukka Beach based device' ],
    'berlin bg2!': [ 'Marvell', 'Armada based device', TYPE_TELEVISION ],
    'berlin generic!': [ 'Marvell', 'Armada based device', TYPE_TELEVISION ],
    'bg2 !': [ 'Marvell', 'Armada based device', TYPE_TELEVISION ],
    'bg2ct !': [ 'Marvell', 'Armada based device', TYPE_TELEVISION ],
    'MStar Amber3': [ 'MStar', 'Amber3 based device' ],
    'Konka Amber3': [ 'MStar', 'Amber3 based device' ],
    'mt5396': [ 'Mediatek', 'MT5396 based device', TYPE_TELEVISION ],
    'baoxue': [ 'Mediatek', 'MT6573 based device' ],
    'bird75v2': [ 'Mediatek', 'MT6575 based device' ],
    'eagle75v1 2': [ 'Mediatek', 'MT6575 based device' ],
    'mt6575!': [ 'Mediatek', 'MT6575 based device' ],
    'mt6582!': [ 'Mediatek', 'MT6582 based device' ],
    'mt6589!': [ 'Mediatek', 'MT6589 based device' ],
    'MTK--8312': [ 'Mediatek', 'MT8312 based device' ],
    'mt8658': [ 'Mediatek', 'MT8658 based device' ],
    'MBX DVBT reference board (c03ref)': [ 'MXB', 'DVBT reference board', TYPE_TELEVISION ],
    'NS115': [ 'Nufront', 'NuSmart 115 based device' ],
    'NS2816': [ 'Nufront', 'NuSmart 2816 based device' ],
    'Ventana': [ 'Nvidia', 'Tegra Ventana development kit' ],
    'Cardhu': [ 'Nvidia', 'Tegra 3 based device' ],
    'Panda(Board)?!': [ 'Pandaboard', 'Development Kit' ],
    'Omap5panda': [ 'Pandaboard', 'Development Kit' ],
    'MSM': [ 'Qualcomm', 'Snapdragon based device' ],
    'msm(7227|7627)!': [ 'Qualcomm', 'Snapdragon S1 based device' ],
    'msm7630!': [ 'Qualcomm', 'Snapdragon S2 based device' ],
    'msm8660!': [ 'Qualcomm', 'Snapdragon S3 based device' ],
    'msm(8x25|8625|8960)!': [ 'Qualcomm', 'Snapdragon S4 based device' ],
    'msm8610': [ 'Qualcomm', 'Snapdragon 200 based device' ],
    'msm8226': [ 'Qualcomm', 'Snapdragon 400 based device' ],
    'msm8974!': [ 'Qualcomm', 'Snapdragon 800 based device' ],
    'rk2808(sdk)?!': [ 'Rockchip', 'RK2808 based device' ],
    'rk2818(sdk)?!': [ 'Rockchip', 'RK2818 based device' ],
    'Android-for-Rockchip-2818': [ 'Rockchip', 'RK2818 based device' ],
    'RK2906': [ 'Rockchip', 'RK2906 based device' ],
    'rk2928sdk': [ 'Rockchip', 'RK2928 based device' ],
    'rk29sdk': [ 'Rockchip', 'RK29 based device' ],
    'rk30sdk': [ 'Rockchip', 'RK30 based device' ],
    'rk31sdk': [ 'Rockchip', 'RK31 based device' ],
    's3c6410': [ 'Samsung', 'S3C6410 based device' ],
    'smdk6410': [ 'Samsung', 'S3C6410 based device' ],
    'SMDKC110': [ 'Samsung', 'Exynos 3110 based device' ],
    'SMDKV210': [ 'Samsung', 'Exynos 4210 based device' ],
    'S5PV210': [ 'Samsung', 'Exynos 4210 based device' ],
    'sec smdkc210': [ 'Samsung', 'Exynos 4210 based device' ],
    'SMDK4x12': [ 'Samsung', 'Exynos 4212 or 4412 based device' ],
    'SMDK5250': [ 'Samsung', 'Exynos 5250 based device' ],
    'smp86xx': [ 'Sigma', 'SMP86xx based device', TYPE_TELEVISION ],
    'sv8860': [ 'Skyviia', 'SV8860 based device', TYPE_TELEVISION ],
    'ste u8500': [ 'ST Ericsson', 'Novathor U8500 based device' ],
    'Telechips M801 Evaluation Board': [ 'Telechips', 'M801 based device', TYPE_TELEVISION ],
    'Telechips TCC8900 Evaluation Board': [ 'Telechips', 'TCC8900 based device', TYPE_TELEVISION ],
    'TCC8920 STB!': [ 'Telechips', 'TCC8920 based device', TYPE_TELEVISION ],
    'TCC8935 HDMI!': [ 'Telechips', 'TCC8935 based device', TYPE_TELEVISION ],
    'OMAP': [ 'Texas Instruments', 'OMAP based device' ],
    'OMAP SS': [ 'Texas Instruments', 'OMAP based device' ],
    'LogicPD Zoom2': [ 'Texas Instruments', 'OMAP based device' ],
    'omap3evm': [ 'Texas Instruments', 'OMAP3 based device' ],
    'OMAP3ETPP': [ 'Texas Instruments', 'OMAP3 based device' ],
    'Omap5sevm': [ 'Texas Instruments', 'OMAP5 based device' ],
    'AM335XEVM': [ 'Texas Instruments', 'Sitara AM335 based device' ],
    'AM335XEVM SK': [ 'Texas Instruments', 'Sitara AM335 based device' ],
    'Colibri-T20': [ 'Toradex', 'Colibri T20' ],
    'pnx8473 kiryung': [ 'Trident', 'PNX8473 based device', TYPE_TELEVISION ],

    /* Official Google development devices */
    'Bravo': [ 'HTC', 'Desire' ],
    'Dream': [ 'HTC', 'Dream' ],
    'Vogue': [ 'HTC', 'Touch' ],
    'Vendor Optimus': [ 'LG', 'Optimus' ],
    'Stingray': [ 'Motorola', 'XOOM', TYPE_TABLET ],
    'Wingray': [ 'Motorola', 'XOOM', TYPE_TABLET ],
    'Blaze': [ 'Texas Instruments', 'Blaze Tablet', TYPE_TABLET ],
    'Blaze Tablet': [ 'Texas Instruments', 'Blaze Tablet', TYPE_TABLET ],
    'Google Ion': [ 'Google', 'Ion' ],


    /* Nexus Devices (without official model no. */
    'Passion': [ 'HTC', 'Nexus One' ],
    '(HTC )?Nexus ?One!': [ 'HTC', 'Nexus One' ],
    'Crespo!': [ 'Samsung', 'Nexus S' ],
    '(Google )?Nexus S!': [ 'Samsung', 'Nexus S' ],
    'Dooderbutt!': [ 'Samsung', 'Nexus S' ],
    'Maguro': [ 'Samsung', 'Galaxy Nexus' ],
    'Toro-VZW': [ 'Samsung', 'Galaxy Nexus' ],
    'Galaxy Nexus!': [ 'Samsung', 'Galaxy Nexus' ],
    'Grouper': [ 'Asus', 'Nexus 7', TYPE_TABLET ],
    'Tilapia': [ 'Asus', 'Nexus 7', TYPE_TABLET ],
    '(Google )?Nexus 7!': [ 'Asus', 'Nexus 7', TYPE_TABLET ],
    'Flo': [ 'Asus', 'Nexus 7 (2013)', TYPE_TABLET ],
    '(Google )?Nexus 4!': [ 'LG', 'Nexus 4' ],
    'Mako': [ 'LG', 'Nexus 4' ],
    'Nexus 5': [ 'LG', 'Nexus 5' ],
    'manta': [ 'Samsung', 'Nexus 10', TYPE_TABLET ],
    'Nexus 10': [ 'Samsung', 'Nexus 10', TYPE_TABLET ],

    'HTC One': [ 'HTC', 'One (Google Edition)' ],
    'Moto G': [ 'Motorola', 'Moto G (Google Edition)' ],
    'GT-I9505G': [ 'Samsung', 'Galaxy S4 (Google Edition)' ],
    'Galaxy S4 Google Editon': [ 'Samsung', 'Galaxy S4 (Google Edition)' ],
    'Xperia Z Ultra': [ 'Sony', 'Xperia Z Ultra (Google Edition)' ],


    'i-mobile i691': [ 'i-Mobile', 'i691' ],
    'i-mobile i695': [ 'i-Mobile', 'i695' ],
    'i-mobile i858': [ 'i-Mobile', 'i858' ],
    'i-mobile 3G 8500': [ 'i-Mobile', '3G 8500' ],
    'i-mobile IQ 1': [ 'i-Mobile', 'iQ 1' ],
    'i-mobile IQ 2': [ 'i-Mobile', 'iQ 2' ],
    'i-mobile IQ 2A': [ 'i-Mobile', 'iQ 2A' ],
    'i-mobile IQ 3': [ 'i-Mobile', 'iQ 3' ],
    'i-mobile IQ 5': [ 'i-Mobile', 'iQ 5' ],
    'i-mobile IQ 5.1': [ 'i-Mobile', 'iQ 5.1' ],
    'i-mobile IQ 5.1A': [ 'i-Mobile', 'iQ 5.1A' ],
    'i-mobile IQ 5.3': [ 'i-Mobile', 'iQ 5.3' ],
    'i-mobile IQ 5.5': [ 'i-Mobile', 'iQ 5.5' ],
    'i-mobile IQ 5.7': [ 'i-Mobile', 'iQ 5.7' ],
    'i-mobile IQ 6': [ 'i-Mobile', 'iQ 6' ],
    'i-mobile IQ 6A': [ 'i-Mobile', 'iQ 6A' ],
    'i-mobile IQ X': [ 'i-Mobile', 'iQ X' ],
    'i-mobile IQ XA': [ 'i-Mobile', 'iQ XA' ],
    'i-mobile IQ X2': [ 'i-Mobile', 'iQ X2' ],
    'i-mobile IQ X3': [ 'i-Mobile', 'iQ X3' ],
    'i-STYLE 1': [ 'i-Mobile', 'i-Style 1' ],
    'i-mobile i-STYLE 2': [ 'i-Mobile', 'i-Style 2' ],
    'i-mobile i-STYLE 2.4': [ 'i-Mobile', 'i-Style 2.4' ],
    'i-mobile i-style 3': [ 'i-Mobile', 'i-Style 3' ],
    'i-mobile i-STYLE 4': [ 'i-Mobile', 'i-Style 4' ],
    'i-MOBILE i-STYLE 5': [ 'i-Mobile', 'i-Style 5' ],
    'i-mobile i-STYLE 7': [ 'i-Mobile', 'i-Style 7' ],
    'i-mobile i-style 7.1': [ 'i-Mobile', 'i-Style 7.1' ],
    'i-mobile i-style 8': [ 'i-Mobile', 'i-Style 8' ],
    'i-mobile i-style Q1': [ 'i-Mobile', 'i-Style Q1' ],
    'i-mobile i-STYLE Q2': [ 'i-Mobile', 'i-Style Q2' ],
    'i-mobile i-STYLE Q2 DUO': [ 'i-Mobile', 'i-Style Q2 Duo' ],
    'i-STYLE Q2 DUO': [ 'i-Mobile', 'i-Style Q2 Duo' ],
    'i-mobile i-style Q3': [ 'i-Mobile', 'i-Style Q3' ],
    'i-mobile i-style Q3i': [ 'i-Mobile', 'i-Style Q3i' ],
    'i-STYLE Q4': [ 'i-Mobile', 'i-Style Q4' ],
    'i-mobile i-STYLE Q 5A': [ 'i-Mobile', 'i-Style Q5A' ],
    'i-mobile i-STYLE Q6': [ 'i-Mobile', 'i-Style Q6' ],
    'i-mobile I-Note': [ 'i-Mobile', 'i-Note', TYPE_TABLET ],
    'i-mobile i-note 3': [ 'i-Mobile', 'i-Note 3', TYPE_TABLET ],
    'i-mobile i-note WiFi 7': [ 'i-Mobile', 'i-Note 7', TYPE_TABLET ],
    'i-mobile i-note WiFi 9': [ 'i-Mobile', 'i-Note 9', TYPE_TABLET ],

    'KPN Smart 300': [ 'KPN', 'Smart 300' ],

    'MT7A': [ 'MegaFon', 'Login', TYPE_TABLET ],

    'Movistar Motion': [ 'Movistar', 'Motion' ],

    'MTC 916': [ 'MTC', '916' ],
    'MTC 950': [ 'MTC', '950' ],
    'MTC 955': [ 'MTC', '955' ],
    'MTC 960': [ 'MTC', '960' ],
    'MTC-962': [ 'MTC', '962' ],
    'MTC 970!': [ 'MTC', '970' ],
    'MTC 972': [ 'MTC', '972' ],
    'MTC975': [ 'MTC', '975' ],
    'MTC980': [ 'MTC', '980' ],
    'MTC 982O': [ 'MTC', '982O' ],
    'MTC Evo': [ 'MTC', 'Evo' ],
    'MTC Fit': [ 'MTC', 'Fit' ],
    'MTC Neo': [ 'MTC', 'Neo' ],
    'MTC Mini': [ 'MTC', 'Mini' ],
    'MTC Viva': [ 'MTC', 'Viva' ],

    'HB-1000': [ 'NTT', 'Hikari Box Plus', TYPE_TELEVISION ],

    'Optimus Boston': [ 'Optimus', 'Boston' ],                            /* Gigabyte GSmart G1305 */
    'Boston 4G': [ 'Optimus', 'Boston 4G' ],
    'Optimus San Francisco': [ 'Optimus', 'San Francisco' ],                        /* ZTE Blade */
    'Optimus Monte Carlo': [ 'Optimus', 'Monte Carlo' ],                        /* ZTE Skate */

    'Orange Boston': [ 'Orange', 'Boston' ],                                /* Gigabyte GSmart G1305 */
    'Orange Covo': [ 'Orange', 'Covo' ],
    'Orange Daytona': [ 'Orange', 'Daytona' ],
    'Orange Dublin': [ 'Orange', 'Dublin' ],
    'Orange Hiro': [ 'Orange', 'Hiro' ],
    'Orange infinity 996': [ 'Orange', 'Infinity' ],
    'Orange Infinity 8008X': [ 'Orange', 'Infinity' ],
    'Orange Kivo': [ 'Orange', 'Kivo' ],
    'Orange Monte Carlo': [ 'Orange', 'Monte Carlo' ],                        /* ZTE Skate */
    '6034R ORANGE Niva': [ 'Orange', 'Nivo' ],
    'Orange Reyo': [ 'Orange', 'Reyo' ],
    'San Francisco': [ 'Orange', 'San Francisco' ],                        /* ZTE Blade */
    'San Francisco for Orange': [ 'Orange', 'San Francisco' ],                        /* ZTE Blade */
    'Orange San Francisco': [ 'Orange', 'San Francisco' ],                        /* ZTE Blade */
    'Orange Yumo': [ 'Orange', 'Yumo' ],
    'Orange Zali': [ 'Orange', 'Zali' ],

    'QMobile A2 Lite': [ 'Q-Mobile', 'Bolt A2 Lite' ],
    'QMobile A7': [ 'Q-Mobile', 'Noir A7' ],
    'QMobile A8': [ 'Q-Mobile', 'Noir A8' ],
    'QMobile A10 Noir': [ 'Q-Mobile', 'Noir A10' ],
    'QMobile Noir A10': [ 'Q-Mobile', 'Noir A10' ],
    'QMobile A11Note': [ 'Q-Mobile', 'Noir A11' ],
    'QMobile A12': [ 'Q-Mobile', 'Noir A12' ],
    'QMobile A20': [ 'Q-Mobile', 'Noir A20' ],
    'QMobile A30': [ 'Q-Mobile', 'Noir A30' ],
    'QMobile A34': [ 'Q-Mobile', 'Noir A34' ],
    'QMobile A35': [ 'Q-Mobile', 'Noir A35' ],
    'QMobile A65': [ 'Q-Mobile', 'Noir A65' ],
    'QMobile A300': [ 'Q-Mobile', 'Noir A300' ],
    'Qmobile A900': [ 'Q-Mobile', 'Noir A900' ],
    'Z4 mini': [ 'Q-Mobile', 'Noir Quatro Z4 mini' ],
    'Q-Smart S1': [ 'Q-Mobile', 'Q-Smart S1' ],
    'Q-Smart model S6': [ 'Q-Mobile', 'Q-Smart S6' ],
    'Qmobile-S11': [ 'Q-Mobile', 'S11' ],
    'Qmobile S13': [ 'Q-Mobile', 'S13' ],
    'Q-Smart S16': [ 'Q-Mobile', 'Q-Smart S16' ],
    'Q-Smart S18': [ 'Q-Mobile', 'Q-Smart S18' ],
    'Q-Smart S19': [ 'Q-Mobile', 'Q-Smart S19' ],
    'Q-Smart S20': [ 'Q-Mobile', 'Q-Smart S20' ],
    'Q-Smart S21': [ 'Q-Mobile', 'Q-Smart S21' ],

    'MOVE': [ 'T-Mobile', 'MOVE' ],                                /* Alcatel One Touch 908 */
    'T-Mobile G1': [ 'T-Mobile', 'G1' ],                                /* HTC Dream */
    'T-Mobile G2': [ 'T-Mobile', 'G2' ],                                /* HTC Desire Z */
    'T-Mobile G2 Touch': [ 'T-Mobile', 'G2' ],                                /* HTC Desire Z */
    'LG-P999': [ 'T-Mobile', 'G2x' ],                                /* LG Optimus 2X */
    'LG-E739': [ 'T-Mobile', 'myTouch' ],                            /* LG E739 */
    'T-Mobile myTouch': [ 'T-Mobile', 'myTouch' ],                            /* LG E739 */
    'T-Mobile myTouch 3G': [ 'T-Mobile', 'myTouch 3G'],                        /* HTC Magic */
    'T-Mobile myTouch 3G Slide': [ 'T-Mobile', 'myTouch 3G Slide' ],                    /* HTC Espresso */
    'T-mobile my touch 3g slide': [ 'T-Mobile', 'myTouch 3G Slide' ],                    /* HTC Espresso */
    'HTC T-Mobile myTouch 3G Slide': [ 'T-Mobile', 'myTouch 3G Slide' ],                    /* HTC Espresso */
    'T-Mobile Espresso': [ 'T-Mobile', 'myTouch 3G Slide' ],                    /* HTC Espresso */
    'HTC my ?Touch 3G Slide!': [ 'T-Mobile', 'myTouch 3G Slide' ],                    /* HTC Espresso */
    'T-Mobile myTouch 4G': [ 'T-Mobile', 'myTouch 4G' ],                        /* HTC Glacier */
    'HTC Glacier': [ 'T-Mobile', 'myTouch 4G' ],                        /* HTC Glacier */
    'HTC Panache': [ 'T-Mobile', 'myTouch 4G' ],                        /* HTC Glacier */
    'My ?Touch ?4G$!': [ 'T-Mobile', 'myTouch 4G' ],                        /* HTC Glacier */
    'HTC My ?Touch ?4G$!': [ 'T-Mobile', 'myTouch 4G' ],                        /* HTC Glacier */
    'HTC myTouch 4G Slide': [ 'T-Mobile', 'myTouch 4G Slide' ],                    /* HTC Doubleshot */
    'myTouch 4G Slide': [ 'T-Mobile', 'myTouch 4G Slide' ],                    /* HTC Doubleshot */
    'T-Mobile myTouch Q': [ 'T-Mobile', 'myTouch Q' ],                        /* Huawei U8730 */
    'LG-C800': [ 'T-Mobile', 'myTouch Q' ],
    'U8220': [ 'T-Mobile', 'Pulse' ],
    'Pulse': [ 'T-Mobile', 'Pulse' ],
    'Pulse Mini': [ 'T-Mobile', 'Pulse Mini' ],                        /* Huawei U8110 */
    'T-Mobile Vivacity': [ 'T-Mobile', 'Vivacity' ],

    'Telenor OneTouch': [ 'Telenor', 'One Touch' ],
    'Telenor One Touch C': [ 'Telenor', 'One Touch C' ],
    'Telenor One Touch S': [ 'Telenor', 'One Touch S' ],
    'Telenor Touch Plus': [ 'Telenor', 'Touch Plus' ],
    'Telenor Smart Pro': [ 'Telenor', 'Smart Pro' ],

    'tmn smart a7': [ 'TMN', 'Smart A7' ],
    'tmn smart a15': [ 'TMN', 'Smart A15' ],
    'tmn smart a18': [ 'TMN', 'Smart A18' ],
    'tmn smart a60': [ 'TMN', 'Smart A60' ],

    'TRUE BEYOND 3G': [ 'True', 'Beyond' ],

    'Turkcell Maxi Plus 5': [ 'Turkcell', 'Maxi Plus 5' ],
    'TURKCELL MaxiPRO5': [ 'Turkcell', 'Maxi Pro 5' ],
    'Turkcell T10': [ 'Turkcell', 'T10' ],
    'Turkcell T11': [ 'Turkcell', 'T11' ],
    'Turkcell T20': [ 'Turkcell', 'T20' ],
    'TURKCELL T40': [ 'Turkcell', 'T40' ],

    'Viettel V8502': [ 'Viettel', 'V8502' ],
    'V8503': [ 'Viettel', 'V8503' ],

    'Vodafone 845': [ 'Vodafone', '845 Nova' ],                            /* Huawei U8100 */
    'Vodafone 858': [ 'Vodafone', '858 Smart' ],                        /* Huawei U8160 */
    'Vodafone 861': [ 'Vodafone', '861 Smart' ],
    'Vodafone 875': [ 'Vodafone', '875' ],
    'Vodafone 945': [ 'Vodafone', '945' ],                                /* ZTE Joe */
    'Vodafone 958': [ 'Vodafone', '958' ],
    'Vodafone 975!': [ 'Vodafone', '975' ],
    'Vodafone 980': [ 'Vodafone', '980' ],
    'Vodafone Smart ll': [ 'Vodafone', 'Smart II' ],
    'Vodafone Smart II!': [ 'Vodafone', 'Smart II' ],
    'Vodafone Smart 4G': [ 'Vodafone', 'Smart 4G' ],
    'VodafoneSmartChat!': [ 'Vodafone', 'Smart Chat' ],
    'SmartTabII7': [ 'Vodafone', 'Smart Tab II 7', TYPE_TABLET ],        /* Lenovo */
    'Vodafone Smart Tab III 7': [ 'Vodafone', 'Smart Tab III 7', TYPE_TABLET ],
    'Vodafone Smart Tab III 10': [ 'Vodafone', 'Smart Tab III 10', TYPE_TABLET ],
    'Vodafone Smart Tab 4': [ 'Vodafone', 'Smart Tab 4', TYPE_TABLET ],
    'SmartTab10': [ 'Vodafone', 'Smart Tab 10', TYPE_TABLET ]            /* ZTE Web Tab 10 */

};

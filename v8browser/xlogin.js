
            !function() {
                window.onerror = function(n, e, o) {
                    var t = document.createElement("img")
                      , _ = encodeURIComponent(n + "|_|" + e + "|_|" + o + "|_|" + window.navigator.userAgent);
                    t.src = "//ui.ptlogin2.qq.com/cgi-bin/report?id=195279&msg=" + _ + "&v=" + Math.random()
                }
            }();
            var g_cdn_js_fail = !1
              , pt = {};
            pt.str = {
                no_uin: "你还没有输入帐号！",
                no_pwd: "你还没有输入密码！",
                no_vcode: "你还没有输入验证码！",
                inv_uin: "请输入正确的帐号！",
                inv_vcode: "请输入完整的验证码！",
                qlogin_expire: "你所选择号码对应的QQ已经失效，请检查该号码对应的QQ是否已经被关闭。",
                other_login: "帐号登录",
                h_pt_login: "帐号密码登录",
                otherqq_login: "QQ帐号密码登录",
                onekey_return: "返回扫码登录"
            },
            pt.ptui = {
                s_url: "https\x3A\x2F\x2Fcas.bugly.qq.com\x2Fcas\x2FloginBack\x3Ftype\x3D9",
                proxy_url: "",
                jumpname: encodeURIComponent(""),
                mibao_css: encodeURIComponent(""),
                defaultUin: "",
                lockuin: parseInt("0"),
                href: "https\x3A\x2F\x2Fxui.ptlogin2.qq.com\x2Fcgi-bin\x2Fxlogin\x3Fhide_border\x3D1\x26hide_close_icon\x3D1\x26low_login\x3D0\x26appid\x3D603049403\x26daid\x3D276\x26s_url\x3Dhttps\x253A\x252F\x252Fcas.bugly.qq.com\x252Fcas\x252FloginBack\x253Ftype\x253D9",
                login_sig: "",
                clientip: "",
                serverip: "",
                version: "201203081004",
                ptui_version: encodeURIComponent("10270"),
                isHttps: !1,
                cssPath: "https://ui.ptlogin2.qq.com/style.ssl/40",
                domain: encodeURIComponent("qq.com"),
                fromStyle: parseInt(""),
                pt_3rd_aid: encodeURIComponent("0"),
                appid: encodeURIComponent("603049403"),
                lang: encodeURIComponent("2052"),
                style: encodeURIComponent("40"),
                low_login: encodeURIComponent("0"),
                daid: encodeURIComponent("276"),
                regmaster: encodeURIComponent(""),
                enable_qlogin: "1",
                noAuth: "0",
                target: isNaN(parseInt("1")) ? {
                    _top: 1,
                    _self: 0,
                    _parent: 2
                }["1"] : parseInt("1"),
                csimc: encodeURIComponent("0"),
                csnum: encodeURIComponent("0"),
                authid: encodeURIComponent("0"),
                auth_mode: encodeURIComponent("0"),
                pt_qzone_sig: "0",
                pt_light: "0",
                pt_vcode_v1: "1",
                pt_ver_md5: "000E0124AB133764EAC4C5C8227953C62D5F2459E23B4CD8CB0C5220DD",
                gzipEnable: "1"
            };

function pluginBegin() {
    if (!$.sso_loadComplete)
        try {
            $.checkNPPlugin()
        } catch (t) {}
    $.sso_loadComplete = !0,
    $.report.setSpeedPoint($.plugin_isd_flag, 1, (new Date).getTime()),
    window.setTimeout(function(t) {
        $.report.isdSpeed($.plugin_isd_flag, .05)
    }, 2e3)
}
function ptui_qlogin_CB(t, e, i) {
    switch (window.clearTimeout(pt.qlogin.__getstClock),
    ptui_qlogin_CB.called = !0,
    t) {
    case "0":
        var n = function() {
            pt.plogin.redirect(pt.ptui.target, e)
        };
        return void ("0" != pt.ptui.pt_3rd_aid ? pt.qlogin.reportPCMgr(pt.plogin.at_account, 0, 0, n) : n());
    case "10006":
        pt.plogin.force_qrlogin(),
        pt.plogin.show_err(i, !0);
        break;
    default:
        pt.plogin.switchpage(pt.LoginState.PLogin),
        pt.plogin.show_err(i, !0)
    }
    "0" != pt.ptui.pt_3rd_aid && pt.qlogin.reportPCMgr(pt.plogin.at_account, 0, 1)
}
function ptui_fetch_dev_uin_CB(t) {
    if (t && 22028 == t.errcode) {
        for (var e = t.data, i = [], n = 0; n < e.length; n++) {
            var o = e[n];
            i.push({
                uin: o,
                name: $.str.utf8ToUincode($.cookie.get("ptnick_" + o)) || o,
                uinString: o,
                type: 0,
                nick: $.str.utf8ToUincode($.cookie.get("ptnick_" + o)) || o,
                flag: 0,
                loginType: pt.qlogin.OneKeyPush
            })
        }
        pt.qlogin.setOneKeyList(i),
        pt.qlogin.buildUnifiedQloginList(),
        e.length && pt.plogin.isMailLogin && pt.plogin.switchpage(pt.LoginState.QLogin)
    }
}
function ptui_getuins_CB(t) {
    if (ptui_getuins_CB.called = !0,
    t) {
        pt.plogin.hide_err();
        for (var e = [], i = 0; i < t.length; i++) {
            var n = t[i];
            e.push({
                uin: n.uin,
                name: n.account,
                uinString: n.uin,
                type: 0,
                face: n.face_index,
                nick: n.nickname,
                flag: n.uin_flag,
                loginType: pt.qlogin.PCSvrQlogin
            })
        }
        pt.qlogin.setPCSvrQloginList(e),
        pt.qlogin.buildUnifiedQloginList(),
        t.length && pt.plogin.isMailLogin && pt.plogin.switchpage(pt.LoginState.QLogin),
        $.report.monitor(508158, 1),
        navigator.userAgent.match(/\bmac\b/i) && $.report.monitor(2423545, 1),
        __pt_ieZeroLogin && $.report.monitor(2129653, 1),
        __pt_webkitZeroLogin && $.report.monitor(2129655, 1),
        window.localStorage && localStorage.setItem("newQQ", !0)
    }
}
function ptui_getst_CB(t) {
    if (ptui_getst_CB.called = !0,
    t) {
        if (pt.plogin.hideLoading(),
        ptui_getst_CB.submitUrl) {
            var e = ptui_getst_CB.submitUrl.replace("{{hash_clientkey}}", $.str.hash33($.cookie.get("clientkey")));
            t.keyindex && (e = e.replace(/keyindex=\d+/, "keyindex=" + t.keyindex),
            $.report.monitor(2423538, 1)),
            pt.qlogin.reportPCMgr(t.uin, 2),
            $.http.loadScript(e)
        }
        $.report.monitor(508159, 1)
    }
}
function ptui_qrcode_CB(t) {
    switch (pt.plogin.hideLoading(),
    clearTimeout(pt.qlogin.__onekeyClock),
    t && parseInt(t.ec)) {
    case 0:
        pt.plogin.go_onekey_step(2),
        pt.plogin.cancle_qrlogin(),
        pt.qlogin.__onekeyFirst || pt.plogin.show_err(t.em),
        pt.plogin.qrlogin_clock = window.setInterval("pt.plogin.qrlogin_submit();", 3e3);
        break;
    case 313:
        pt.plogin.go_onekey_step(1),
        t && pt.plogin.show_err(t.em),
        pt.qlogin.fetchOnekeyList();
        break;
    default:
        t && pt.plogin.show_err(t.em)
    }
}
function pt_request_guid_callback(t) {
    if (pt_request_guid_callback.called = !0,
    !(t && t.hasOwnProperty("ret") && 1 == t.ret && t.hasOwnProperty("data") && t.data.hasOwnProperty("serverdata") && t.data.serverdata.hasOwnProperty("status") && t.hasOwnProperty("session")))
        return pt.qlogin.fetchOnekeyListByGUID(),
        $.report.nlog("pt_request_guid_callback result:" + $.str.json2str(t), 2732842),
        0;
    switch (parseInt(t.data.serverdata.status)) {
    case 1:
        t.data.serverdata.hasOwnProperty("guidsig") ? (pt.qlogin.fetchOnekeyListByGUID(t.data.serverdata.guidsig),
        pt.qlogin.QQProtectGUID = t.data.serverdata.guidsig,
        $.report.monitor(2732843)) : ($.report.nlog("pt_request_guid_callback result:" + $.str.json2str(t), 2732842),
        pt.qlogin.fetchOnekeyListByGUID());
        break;
    case 2:
        pt.qlogin.QQProtectSession = t.session,
        pt.qlogin.callQQProtect({
            service: 103,
            action: 2,
            callbackName: "pt_request_guid_callback",
            timeoutCallback: function() {
                pt.qlogin.fetchOnekeyListByGUID(),
                $.report.monitor(2751524)
            }
        });
        break;
    default:
        pt.qlogin.fetchOnekeyListByGUID(),
        $.report.nlog("pt_request_guid_callback result:" + $.str.json2str(t), 2732842)
    }
}
function ptui_pc_querystatus_CB(t) {
    ptui_pc_querystatus_CB.called = !0,
    t && (pt.qlogin.PCMgrSession = t.actionString,
    pt.qlogin.processPCMgrStatus(t.qqpcstatus, t.wording, t.bautoCheck))
}
function ptui_qqprotect_querystatus_CB(t) {
    ptui_qqprotect_querystatus_CB.called = !0,
    t && t.hasOwnProperty("ret") && 1 == t.ret && t.hasOwnProperty("data") && (pt.qlogin.PCMgrSession || (pt.qlogin.PCMgrSession2 = t.data.actionstring,
    pt.qlogin.processPCMgrStatus(t.data.qqpcstatus, t.data.wording, t.data.bautoCheck)))
}
function ptui_qqprotect_result_CB() {
    ptui_qqprotect_result_CB.called = !0
}
function ptui_action_result_CB() {
    ptui_action_result_CB.called = !0
}
function pt_qqprotect_version(t) {
    pt_qqprotect_version.called = !0,
    pt.qlogin.callQQProtect({
        service: 103,
        action: 1,
        callbackName: "pt_request_guid_callback",
        timeoutCallback: function() {
            pt.qlogin.fetchOnekeyListByGUID(),
            $.report.monitor(2751523)
        }
    })
}
function ptuiCB(t, e, i, n, o, p) {
    function r() {
        pt.plogin.is_mibao(i) && (i += "&style=" + pt.ptui.style + "&proxy_url=" + encodeURIComponent(pt.ptui.proxy_url),
        i += "#login_href=" + encodeURIComponent(pt.ptui.href)),
        pt.plogin.redirect(n, i)
    }
    var s = $("p")
      , a = !(!pt.plogin.at_account || !s.value && !pt.plogin.armSafeEdit.safepwd);
    clearTimeout(pt.plogin.loginClock),
    a && (pt.plogin.lastCheckAccount = ""),
    pt.plogin.hasSubmit = !0;
    var l = !1;
    switch (t) {
    case "0":
        var c = function() {
            a || pt.plogin.is_mibao(i) ? r() : (window.clearInterval(pt.plogin.qrlogin_clock),
            r())
        };
        return void ("0" != pt.ptui.pt_3rd_aid ? pt.qlogin.reportPCMgr(pt.plogin.at_account, 0, 0, c) : c());
    case "3":
        $("p").value = "",
        pt.plogin.domFocus($("p")),
        pt.plogin.passwordErrorNum++,
        "101" != e && "102" != e && "103" != e || pt.plogin.showVC(),
        pt.plogin.check();
        break;
    case "4":
        pt.plogin.check();
        break;
    case "12":
    case "51":
        pt.plogin.check(),
        l = !0;
        break;
    case "65":
        return void (0 != pt.plogin.onekeyVerifyClock ? pt.plogin.onekeyVerify("invalid") : pt.plogin.set_qrlogin_invalid());
    case "66":
        return;
    case "67":
        return void pt.plogin.go_qrlogin_step(2);
    case "22005":
    case "68":
        pt.plogin.onekeyVerify("hide");
        break;
    case "10005":
    case "10006":
    case "22009":
        pt.plogin.force_qrlogin(),
        pt.plogin.isNewStyle && pt.qlogin.buildUnifiedQloginList(10006 == t ? 2 : 1),
        pt.plogin.check();
        break;
    case "10008":
        return void pt.plogin.onekeyVerify("normal", e, o);
    default:
        pt.plogin.needVc && !pt.plogin.needShowNewVc ? pt.plogin.changeVC() : pt.plogin.check()
    }
    if (0 != t && a && pt.plogin.show_err(o, l),
    !pt.plogin.hasCheck() && a && "1" != pt.ptui.pt_vcode_v1 && (pt.plogin.showVC(),
    $("verifycode").focus(),
    $("verifycode").select()),
    Math.random() < .2) {
        pt.plogin.isdTime["7808-7-2-1"] = (new Date).getTime();
        var u = 1;
        pt.ptui.isHttps && (u = 2);
        var g = "flag1=7808&flag2=7&flag3=2&" + u + "=" + (pt.plogin.isdTime["7808-7-2-1"] - pt.plogin.isdTime["7808-7-2-0"]);
        $.report.simpleIsdSpeed(g)
    }
    "0" != pt.ptui.pt_3rd_aid && pt.qlogin.reportPCMgr(pt.plogin.at_account, 0, 1)
}
function ptui_checkVC(t, e, i, n, o) {
    switch (clearTimeout(pt.plogin.checkClock),
    pt.plogin.isRandSalt = o,
    pt.plogin.salt = i,
    pt.plogin.checkRet = t,
    pt.plogin.lastCheckAccount = pt.plogin.account,
    "2" == t ? pt.plogin.loginState == pt.LoginState.PLogin && pt.plogin.show_err(pt.str.inv_uin) : "3" == t || pt.plogin.hasSubmit,
    t + "") {
    case "0":
    case "2":
    case "3":
        pt.plogin.hideVC(),
        "1" == pt.ptui.pt_vcode_v1 && (pt.plogin.needShowNewVc = !1),
        $("verifycode").value = e || "abcd",
        pt.plogin.needVc = !1,
        $.report.monitor("330321", .05),
        e || $.report.nlog("check no code return,ret=" + t + ",code=" + e + ",uin=" + $.str.bin2String(i));
        break;
    case "1":
        pt.plogin.cap_cd = e,
        "1" == pt.ptui.pt_vcode_v1 ? pt.plogin.needShowNewVc = !0 : (pt.plogin.showVC(),
        $.css.show($("vc_tips"))),
        pt.plogin.needVc = !0,
        $.report.monitor("330320", .05)
    }
    1 == pt.ptui.pt_vcode_v1 && 1 == t || (pt.plogin.pt_verifysession = n),
    pt.plogin.hasCheck(!0),
    pt.plogin.checkTime = (new Date).getTime(),
    pt.plogin.check.cb && pt.plogin.check.cb()
}
function ptui_auth_CB(t, e) {
    switch (t = parseInt(t),
    2 === t && "0" != pt.ptui.pt_3rd_aid && (t = 0),
    t) {
    case 0:
        pt.plogin.authUin = $.cookie.get("superuin").replace(/^o0*/, ""),
        pt.plogin.authSubmitUrl = e,
        pt.qlogin.buildUnifiedQloginList(),
        pt.plogin.isMailLogin && pt.plogin.switchpage(pt.LoginState.QLogin);
        break;
    case 1:
        break;
    case 2:
        var i = e + "&regmaster=" + pt.ptui.regmaster + "&aid=" + pt.ptui.appid + "&s_url=" + encodeURIComponent(pt.ptui.s_url);
        "1" == pt.ptui.pt_light && (i += "&pt_light=1"),
        pt.plogin.redirect(pt.ptui.target, i);
        break;
    default:
        pt.preload.init()
    }
}
var window = {};
var document = {};
var pt = {};

window.$pt = window.$pt || {};
$pt = {};
window.setTimeout = function(t){}
setTimeout = function(t){}
document.cookie = "";
navigator = {}
!window.console && (window.console = {
    log: function() {},
    warn: function() {},
    error: function() {}
});
var $ = window.Simple = function(t) {
    return "string" == typeof t ? document.getElementById(t) : t
}
;
$.cookie = {
    get: function(t) {
        var e;
        return function(t) {
            if (!t)
                return t;
            for (; t != unescape(t); )
                t = unescape(t);
            for (var e = ["<", ">", "'", '"', "%3c", "%3e", "%27", "%22", "%253c", "%253e", "%2527", "%2522"], i = ["&#x3c;", "&#x3e;", "&#x27;", "&#x22;", "%26%23x3c%3B", "%26%23x3e%3B", "%26%23x27%3B", "%26%23x22%3B", "%2526%2523x3c%253B", "%2526%2523x3e%253B", "%2526%2523x27%253B", "%2526%2523x22%253B"], n = 0; n < e.length; n++)
                t = t.replace(new RegExp(e[n],"gi"), i[n]);
            return t
        }((e = document.cookie.match(RegExp("(^|;\\s*)" + t + "=([^;]*)(;|$)"))) ? unescape(e[2]) : "")
    },
    set: function(t, e, i, n, o) {
        var p = new Date;
        o ? (p.setTime(p.getTime() + 36e5 * o),
        document.cookie = t + "=" + e + "; expires=" + p.toGMTString() + "; path=" + (n || "/") + "; " + (i ? "domain=" + i + ";" : "")) : document.cookie = t + "=" + e + "; path=" + (n || "/") + "; " + (i ? "domain=" + i + ";" : "")
    },
    del: function(t, e, i) {
        document.cookie = t + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (i || "/") + "; " + (e ? "domain=" + e + ";" : "")
    },
    uin: function() {
        var t = $.cookie.get("uin");
        return t ? parseInt(t.substring(1, t.length), 10) : null
    }
},
$.http = {
    getXHR: function() {
        return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest
    },
    ajax: function(url, para, cb, method, type) {
        var xhr = $.http.getXHR();
        return xhr.open(method, url),
        xhr.onreadystatechange = function() {
            4 == xhr.readyState && (xhr.status >= 200 && xhr.status < 300 || 304 === xhr.status || 1223 === xhr.status || 0 === xhr.status ? void 0 === type && xhr.responseText ? cb(eval("(" + xhr.responseText + ")")) : (cb(xhr.responseText),
            !xhr.responseText && $.badjs._smid && $.badjs("HTTP Empty[xhr.status]:" + xhr.status, url, 0, $.badjs._smid)) : $.badjs._smid && $.badjs("HTTP Error[xhr.status]:" + xhr.status, url, 0, $.badjs._smid),
            xhr = null)
        }
        ,
        xhr.send(para),
        xhr
    },
    post: function(t, e, i, n) {
        var o = "";
        for (var p in e)
            o += "&" + p + "=" + e[p];
        return $.http.ajax(t, o, i, "POST", n)
    },
    get: function(t, e, i, n) {
        var o = [];
        for (var p in e)
            o.push(p + "=" + e[p]);
        return -1 == t.indexOf("?") && (t += "?"),
        t += o.join("&"),
        $.http.ajax(t, null, i, "GET", n)
    },
    jsonp: function(t) {
        var e = document.createElement("script");
        e.src = t,
        document.getElementsByTagName("head")[0].appendChild(e)
    },
    loadScript: function(t, e, i) {
        var n = document.createElement("script");
        n.onload = n.onreadystatechange = function() {
            this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || ("function" == typeof e && e(),
            n.onload = n.onreadystatechange = null,
            n.parentNode && n.parentNode.removeChild(n))
        }
        ,
        n.src = t,
        document.getElementsByTagName("head")[0].appendChild(n)
    },
    preload: function(t) {
        var e = document.createElement("img");
        e.src = t,
        e = null
    }
},
$.get = $.http.get,
$.post = $.http.post,
$.jsonp = $.http.jsonp,
$.browser = function(t) {
    if (void 0 === $.browser.info) {
        var e = {
            type: ""
        }
          , i = navigator.userAgent.toLowerCase();
        /webkit/.test(i) ? e = {
            type: "webkit",
            version: /webkit[\/ ]([\w.]+)/
        } : /opera/.test(i) ? e = {
            type: "opera",
            version: /version/.test(i) ? /version[\/ ]([\w.]+)/ : /opera[\/ ]([\w.]+)/
        } : /msie/.test(i) ? e = {
            type: "msie",
            version: /msie ([\w.]+)/
        } : /mozilla/.test(i) && !/compatible/.test(i) && (e = {
            type: "ff",
            version: /rv:([\w.]+)/
        }),
        e.version = (e.version && e.version.exec(i) || [0, "0"])[1],
        $.browser.info = e
    }
    return $.browser.info[t]
}
,
$.e = {
    _counter: 0,
    _uid: function() {
        return "h" + $.e._counter++
    },
    add: function(t, e, i) {
        if ("object" != typeof t && (t = $(t)),
        document.addEventListener)
            t.addEventListener(e, i, !1);
        else if (document.attachEvent) {
            if (-1 != $.e._find(t, e, i))
                return;
            var n = function(e) {
                e || (e = window.event);
                var n = {
                    _event: e,
                    type: e.type,
                    target: e.srcElement,
                    currentTarget: t,
                    relatedTarget: e.fromElement ? e.fromElement : e.toElement,
                    eventPhase: e.srcElement == t ? 2 : 3,
                    clientX: e.clientX,
                    clientY: e.clientY,
                    screenX: e.screenX,
                    screenY: e.screenY,
                    altKey: e.altKey,
                    ctrlKey: e.ctrlKey,
                    shiftKey: e.shiftKey,
                    keyCode: e.keyCode,
                    data: e.data,
                    origin: e.origin,
                    stopPropagation: function() {
                        this._event.cancelBubble = !0
                    },
                    preventDefault: function() {
                        this._event.returnValue = !1
                    }
                };
                Function.prototype.call ? i.call(t, n) : (t._currentHandler = i,
                t._currentHandler(n),
                t._currentHandler = null)
            };
            t.attachEvent("on" + e, n);
            var o = {
                element: t,
                eventType: e,
                handler: i,
                wrappedHandler: n
            }
              , p = t.document || t
              , r = p.parentWindow
              , s = $.e._uid();
            r._allHandlers || (r._allHandlers = {}),
            r._allHandlers[s] = o,
            t._handlers || (t._handlers = []),
            t._handlers.push(s),
            r._onunloadHandlerRegistered || (r._onunloadHandlerRegistered = !0,
            r.attachEvent("onunload", $.e._removeAllHandlers))
        }
    },
    remove: function(t, e, i) {
        if (document.addEventListener)
            t.removeEventListener(e, i, !1);
        else if (document.attachEvent) {
            var n = $.e._find(t, e, i);
            if (-1 == n)
                return;
            var o = t.document || t
              , p = o.parentWindow
              , r = t._handlers[n]
              , s = p._allHandlers[r];
            t.detachEvent("on" + e, s.wrappedHandler),
            t._handlers.splice(n, 1),
            delete p._allHandlers[r]
        }
    },
    _find: function(t, e, i) {
        var n = t._handlers;
        if (!n)
            return -1;
        for (var o = t.document || t, p = o.parentWindow, r = n.length - 1; r >= 0; r--) {
            var s = n[r]
              , a = p._allHandlers[s];
            if (a.eventType == e && a.handler == i)
                return r
        }
        return -1
    },
    _removeAllHandlers: function() {
        var t = this;
        for (id in t._allHandlers) {
            var e = t._allHandlers[id];
            e.element.detachEvent("on" + e.eventType, e.wrappedHandler),
            delete t._allHandlers[id]
        }
    },
    src: function(t) {
        return t ? t.target : event.srcElement
    },
    stopPropagation: function(t) {
        t ? t.stopPropagation() : event.cancelBubble = !0
    },
    trigger: function(t, e) {
        var i = {
            HTMLEvents: "abort,blur,change,error,focus,load,reset,resize,scroll,select,submit,unload",
            UIEevents: "keydown,keypress,keyup",
            MouseEvents: "click,mousedown,mousemove,mouseout,mouseover,mouseup"
        };
        if (document.createEvent) {
            var n = "";
            "mouseleave" == e && (e = "mouseout"),
            "mouseenter" == e && (e = "mouseover");
            for (var o in i)
                if (i[o].indexOf(e)) {
                    n = o;
                    break
                }
            var p = document.createEvent(n);
            p.initEvent(e, !0, !1),
            t.dispatchEvent(p)
        } else
            document.createEventObject && t.fireEvent("on" + e)
    }
},
$.bom = {
    query: function(t) {
        var e = window.location.search.match(new RegExp("(\\?|&)" + t + "=([^&]*)(&|$)"));
        return e ? decodeURIComponent(e[2]) : ""
    },
    getHash: function(t) {
        var e = window.location.hash.match(new RegExp("(#|&)" + t + "=([^&]*)(&|$)"));
        return e ? decodeURIComponent(e[2]) : ""
    }
},
$.winName = {
    set: function(t, e) {
        var i = window.name || "";
        i.match(new RegExp(";" + t + "=([^;]*)(;|$)")) ? window.name = i.replace(new RegExp(";" + t + "=([^;]*)"), ";" + t + "=" + e) : window.name = i + ";" + t + "=" + e
    },
    get: function(t) {
        var e = window.name || ""
          , i = e.match(new RegExp(";" + t + "=([^;]*)(;|$)"));
        return i ? i[1] : ""
    },
    clear: function(t) {
        var e = window.name || "";
        window.name = e.replace(new RegExp(";" + t + "=([^;]*)"), "")
    }
},
$.localData = function() {
    function t() {
        var t = document.createElement("link");
        return t.style.display = "none",
        t.id = o,
        document.getElementsByTagName("head")[0].appendChild(t),
        t.addBehavior("#default#userdata"),
        t
    }
    function e() {
        if (void 0 === n)
            if (window.localStorage)
                n = localStorage;
            else
                try {
                    n = t(),
                    n.load(o)
                } catch (t) {
                    return n = !1,
                    !1
                }
        return !0
    }
    function i(t) {
        return "string" == typeof t && p.test(t)
    }
    var n, o = "ptlogin2.qq.com", p = /^[0-9A-Za-z_-]*$/;
    return {
        set: function(t, p) {
            var r = !1;
            if (i(t) && e())
                try {
                    p += "",
                    window.localStorage ? (n.setItem(t, p),
                    r = !0) : (n.setAttribute(t, p),
                    n.save(o),
                    r = n.getAttribute(t) === p)
                } catch (t) {}
            return r
        },
        get: function(t) {
            if (i(t) && e())
                try {
                    return window.localStorage ? n.getItem(t) : n.getAttribute(t)
                } catch (t) {}
            return null
        },
        remove: function(t) {
            if (i(t) && e())
                try {
                    return window.localStorage ? n.removeItem(t) : n.removeAttribute(t),
                    !0
                } catch (t) {}
            return !1
        }
    }
}(),
$.str = function() {
    var htmlDecodeDict = {
        quot: '"',
        lt: "<",
        gt: ">",
        amp: "&",
        nbsp: " ",
        "#34": '"',
        "#60": "<",
        "#62": ">",
        "#38": "&",
        "#160": " "
    }
      , htmlEncodeDict = {
        '"': "#34",
        "<": "#60",
        ">": "#62",
        "&": "#38",
        " ": "#160"
    };
    return {
        decodeHtml: function(t) {
            return t += "",
            t.replace(/&(quot|lt|gt|amp|nbsp);/gi, function(t, e) {
                return htmlDecodeDict[e]
            }).replace(/&#u([a-f\d]{4});/gi, function(t, e) {
                return String.fromCharCode(parseInt("0x" + e))
            }).replace(/&#(\d+);/gi, function(t, e) {
                return String.fromCharCode(+e)
            })
        },
        encodeHtml: function(t) {
            return t += "",
            t.replace(/["<>& ]/g, function(t) {
                return "&" + htmlEncodeDict[t] + ";"
            })
        },
        trim: function(t) {
            t += "";
            for (var t = t.replace(/^\s+/, ""), e = /\s/, i = t.length; e.test(t.charAt(--i)); )
                ;
            return t.slice(0, i + 1)
        },
        uin2hex: function(str) {
            var maxLength = 16;
            str = parseInt(str);
            for (var hex = str.toString(16), len = hex.length, i = len; i < maxLength; i++)
                hex = "0" + hex;
            for (var arr = [], j = 0; j < maxLength; j += 2)
                arr.push("\\x" + hex.substr(j, 2));
            var result = arr.join("");
            return eval('result="' + result + '"'),
            result
        },
        bin2String: function(t) {
            for (var e = [], i = 0, n = t.length; i < n; i++) {
                var o = t.charCodeAt(i).toString(16);
                1 == o.length && (o = "0" + o),
                e.push(o)
            }
            return e = "0x" + e.join(""),
            e = parseInt(e, 16)
        },
        str2bin: function(str) {
            for (var arr = [], i = 0; i < str.length; i += 2)
                arr.push(eval("'\\x" + str.charAt(i) + str.charAt(i + 1) + "'"));
            return arr.join("")
        },
        utf8ToUincode: function(t) {
            var e = "";
            try {
                var n = t.length
                  , o = [];
                for (i = 0; i < n; i += 2)
                    o.push("%" + t.substr(i, 2));
                e = decodeURIComponent(o.join("")),
                e = $.str.decodeHtml(e)
            } catch (t) {
                e = ""
            }
            return e
        },
        json2str: function(t) {
            var e = "";
            if ("undefined" != typeof JSON)
                e = JSON.stringify(t);
            else {
                var i = [];
                for (var n in t)
                    i.push('"' + n + '":"' + t[n] + '"');
                e = "{" + i.join(",") + "}"
            }
            return e
        },
        time33: function(t) {
            for (var e = 0, i = 0, n = t.length; i < n; i++)
                e = (33 * e + t.charCodeAt(i)) % 4294967296;
            return e
        },
        hash33: function(t) {
            for (var e = 0, i = 0, n = t.length; i < n; ++i)
                e += (e << 5) + t.charCodeAt(i);
            return 2147483647 & e
        }
    }
}(),
$.css = function() {
    var t = document.documentElement;
    return {
        getComputedStyle: function(t) {
            return window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle
        },
        getCurrentPixelStyle: function(t, e) {
            if (window.getComputedStyle)
                var i = parseInt(window.getComputedStyle(t)[e]);
            else {
                var i = t.currentStyle[e] || 0;
                if ("auto" === i)
                    switch (e || "") {
                    case "width":
                    case "height":
                        return t.offsetHeight
                    }
                var n = t.style.left
                  , o = t.runtimeStyle.left;
                t.runtimeStyle.left = t.currentStyle.left,
                t.style.left = "fontSize" === e ? "1em" : i,
                i = t.style.pixelLeft + "px",
                t.style.left = n,
                t.runtimeStyle.left = o
            }
            return parseInt(i)
        },
        getPageScrollTop: function() {
            return window.pageYOffset || t.scrollTop || document.body.scrollTop || 0
        },
        getPageScrollLeft: function() {
            return window.pageXOffset || t.scrollLeft || document.body.scrollLeft || 0
        },
        getOffsetPosition: function(e) {
            e = $(e);
            var i = 0
              , n = 0;
            if (t.getBoundingClientRect && e.getBoundingClientRect) {
                var o = e.getBoundingClientRect()
                  , p = t.clientTop || document.body.clientTop || 0
                  , r = t.clientLeft || document.body.clientLeft || 0;
                i = o.top + this.getPageScrollTop() - p,
                n = o.left + this.getPageScrollLeft() - r
            } else
                do {
                    i += e.offsetTop || 0,
                    n += e.offsetLeft || 0,
                    e = e.offsetParent
                } while (e);return {
                left: n,
                top: i
            }
        },
        getWidth: function(t) {
            return $(t).offsetWidth
        },
        getHeight: function(t) {
            return $(t).offsetHeight
        },
        show: function(t) {
            t.style.display = "block"
        },
        hide: function(t) {
            t.style.display = "none"
        },
        hasClass: function(t, e) {
            if (!t.className)
                return !1;
            for (var i = t.className.split(" "), n = 0, o = i.length; n < o; n++)
                if (e == i[n])
                    return !0;
            return !1
        },
        addClass: function(t, e) {
            $.css.updateClass(t, e, !1)
        },
        removeClass: function(t, e) {
            $.css.updateClass(t, !1, e)
        },
        updateClass: function(t, e, i) {
            for (var n = t.className.split(" "), o = {}, p = 0, r = n.length; p < r; p++)
                n[p] && (o[n[p]] = !0);
            if (e) {
                var s = e.split(" ");
                for (p = 0,
                r = s.length; p < r; p++)
                    s[p] && (o[s[p]] = !0)
            }
            if (i) {
                var a = i.split(" ");
                for (p = 0,
                r = a.length; p < r; p++)
                    a[p] && delete o[a[p]]
            }
            var l = [];
            for (var c in o)
                l.push(c);
            t.className = l.join(" ")
        },
        setClass: function(t, e) {
            t.className = e
        }
    }
}(),
$.animate = {
    fade: function(t, e, i, n, o) {
        if (t = $(t)) {
            t.effect || (t.effect = {});
            var p = Object.prototype.toString.call(e)
              , r = 100;
            isNaN(e) ? "[object Object]" == p && e && e.to && (isNaN(e.to) || (r = e.to),
            isNaN(e.from) || (t.style.opacity = e.from / 100,
            t.style.filter = "alpha(opacity=" + e.from + ")")) : r = e,
            void 0 === t.effect.fade && (t.effect.fade = 0),
            window.clearInterval(t.effect.fade);
            var i = i || 1
              , n = n || 20
              , s = window.navigator.userAgent.toLowerCase()
              , a = function(t) {
                var e;
                if (-1 != s.indexOf("msie")) {
                    var i = (t.currentStyle || {}).filter || "";
                    e = i.indexOf("opacity") >= 0 ? parseFloat(i.match(/opacity=([^)]*)/)[1]) + "" : "100"
                } else {
                    var n = t.ownerDocument.defaultView;
                    n = n && n.getComputedStyle,
                    e = 100 * (n && n(t, null).opacity || 1)
                }
                return parseFloat(e)
            }(t)
              , l = a < r ? 1 : -1;
            -1 != s.indexOf("msie") && n < 15 && (i = Math.floor(15 * i / n),
            n = 15);
            var c = function() {
                a += i * l,
                (Math.round(a) - r) * l >= 0 ? (t.style.opacity = r / 100,
                t.style.filter = "alpha(opacity=" + r + ")",
                window.clearInterval(t.effect.fade),
                "function" == typeof o && o(t)) : (t.style.opacity = a / 100,
                t.style.filter = "alpha(opacity=" + a + ")")
            };
            t.effect.fade = window.setInterval(c, n)
        }
    },
    animate: function(t, e, i, n, o) {
        if (t = $(t)) {
            t.effect || (t.effect = {}),
            void 0 === t.effect.animate && (t.effect.animate = 0);
            for (var p in e)
                e[p] = parseInt(e[p]) || 0;
            window.clearInterval(t.effect.animate);
            var i = i || 10
              , n = n || 20
              , r = function(t) {
                return {
                    left: t.offsetLeft,
                    top: t.offsetTop
                }
            }(t)
              , s = {
                width: t.clientWidth,
                height: t.clientHeight,
                left: r.left,
                top: r.top
            }
              , a = [];
            if (-1 == window.navigator.userAgent.toLowerCase().indexOf("msie") || "BackCompat" != document.compatMode) {
                var l = document.defaultView ? document.defaultView.getComputedStyle(t, null) : t.currentStyle
                  , c = e.width || 0 == e.width ? parseInt(e.width) : null
                  , u = e.height || 0 == e.height ? parseInt(e.height) : null;
                "number" == typeof c && (a.push("width"),
                e.width = c - l.paddingLeft.replace(/\D/g, "") - l.paddingRight.replace(/\D/g, "")),
                "number" == typeof u && (a.push("height"),
                e.height = u - l.paddingTop.replace(/\D/g, "") - l.paddingBottom.replace(/\D/g, "")),
                n < 15 && (i = Math.floor(15 * i / n),
                n = 15)
            }
            var g = e.left || 0 == e.left ? parseInt(e.left) : null
              , d = e.top || 0 == e.top ? parseInt(e.top) : null;
            "number" == typeof g && (a.push("left"),
            t.style.position = "absolute"),
            "number" == typeof d && (a.push("top"),
            t.style.position = "absolute");
            for (var h = [], f = a.length, p = 0; p < f; p++)
                h[a[p]] = s[a[p]] < e[a[p]] ? 1 : -1;
            var _ = t.style
              , m = function() {
                for (var n = !0, p = 0; p < f; p++)
                    s[a[p]] = s[a[p]] + h[a[p]] * Math.abs(e[a[p]] - s[a[p]]) * i / 100,
                    (Math.round(s[a[p]]) - e[a[p]]) * h[a[p]] >= 0 ? (n = n && !0,
                    _[a[p]] = e[a[p]] + "px") : (n = n && !1,
                    _[a[p]] = s[a[p]] + "px");
                n && (window.clearInterval(t.effect.animate),
                "function" == typeof o && o(t))
            };
            t.effect.animate = window.setInterval(m, n)
        }
    },
    animate2: function(t, e, i, n, o) {
        var p = i || 1
          , r = n || 20
          , s = $(t)
          , a = $.css.getComputedStyle(s)
          , l = {}
          , c = {};
        for (var u in e)
            l[u] = a[u].replace(/[-\d\s]/g, "") || e[u].replace(/[-\d\s]/g, "") || "",
            e[u] = parseFloat(e[u]),
            c[u] = parseFloat(a[u]);
        var g = 100 / p
          , d = 0
          , h = setInterval(function() {
            if (d++ >= g)
                return void clearInterval(h);
            for (var t in e)
                s.style[t] = (e[t] - c[t]) * d / g + c[t] + l[t]
        }, r)
    }
},
$.check = {
    isHttps: function() {
        return "https:" == document.location.protocol
    },
    isSsl: function() {
        return /^ssl./i.test(document.location.host)
    },
    isIpad: function() {
        return /ipad/i.test(navigator.userAgent.toLowerCase())
    },
    isQQ: function(t) {
        return /^[1-9]{1}\d{4,9}$/.test(t)
    },
    isQQMail: function(t) {
        return /^[1-9]{1}\d{4,9}@qq\.com$/.test(t)
    },
    isNullQQ: function(t) {
        return /^\d{1,4}$/.test(t)
    },
    isNick: function(t) {
        return /^[a-zA-Z]{1}([a-zA-Z0-9]|[-_]){0,19}$/.test(t)
    },
    isName: function(t) {
        return "<请输入帐号>" != t && /[\u4E00-\u9FA5]{1,8}/.test(t)
    },
    isPhone: function(t) {
        return /^(?:86|886|)1\d{10}\s*$/.test(t)
    },
    isSeaPhone: function(t) {
        return /^(00)?(?:852|853|886(0)?\d{1})\d{8}$/.test(t)
    },
    isMail: function(t) {
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(t)
    },
    isQiyeQQ800: function(t) {
        return /^(800)\d{7}$/.test(t)
    },
    isPassword: function(t) {
        return t && t.length >= 16
    },
    isForeignPhone: function(t) {
        return /^00\d{7,}/.test(t)
    },
    needVip: function(t) {
        for (var e = ["21001601", "21000110", "21000121", "46000101", "716027609", "716027610", "549000912", "637009801"], i = !0, n = 0, o = e.length; n < o; n++)
            if (e[n] == t) {
                i = !1;
                break
            }
        return i
    },
    isPaipai: function() {
        return /paipai.com$/.test(window.location.hostname)
    },
    is_weibo_appid: function(t) {
        return 46000101 == t || 607000101 == t || 558032501 == t || 682023901 == t
    }
},
$.report = {
    monitor: function(t, e) {
        if (!(Math.random() > (e || 1)))
            try {
                var i = location.protocol + "//ui.ptlogin2.qq.com/cgi-bin/report?id=" + t;
                $.http.preload(i)
            } catch (t) {}
    },
    nlog: function(t, e, i, n) {
        if (!(Math.random() >= (i || 1)))
            try {
                var o = "//ui.ptlogin2.qq.com/cgi-bin/report?"
                  , p = encodeURIComponent(t + "|_|" + location.href + "|_|" + window.navigator.userAgent);
                e = e || 0,
                n && (o += "u=" + n + "&"),
                o += "id=" + e + "&msg=" + p + "&v=" + Math.random(),
                $.http.preload(o)
            } catch (t) {}
    },
    simpleIsdSpeed: function(t, e) {
        if (Math.random() < (e || 1)) {
            var i = "http://isdspeed.qq.com/cgi-bin/r.cgi?";
            $.check.isHttps() && (i = "https://huatuospeed.weiyun.com/cgi-bin/r.cgi?"),
            i += t,
            $.http.preload(i)
        }
    },
    isdSpeed: function(t, e) {
        var i = !1
          , n = "http://isdspeed.qq.com/cgi-bin/r.cgi?";
        if ($.check.isHttps() && (n = "https://huatuospeed.weiyun.com/cgi-bin/r.cgi?"),
        n += t,
        Math.random() < (e || 1)) {
            var o = $.report.getSpeedPoints(t);
            for (var p in o)
                o[p] && o[p] < 3e4 && (n += "&" + p + "=" + o[p],
                i = !0);
            n += "&v=" + Math.random(),
            i && $.http.preload(n)
        }
        $.report.setSpeedPoint(t)
    },
    speedPoints: {},
    basePoint: {},
    setBasePoint: function(t, e) {
        $.report.basePoint[t] = e
    },
    setSpeedPoint: function(t, e, i) {
        e ? ($.report.speedPoints[t] || ($.report.speedPoints[t] = {}),
        $.report.speedPoints[t][e] = i - $.report.basePoint[t]) : $.report.speedPoints[t] = {}
    },
    setSpeedPoints: function(t, e) {
        $.report.speedPoints[t] = e
    },
    getSpeedPoints: function(t) {
        return $.report.speedPoints[t]
    }
},
$.sso_ver = 0,
$.sso_state = 0,
$.plugin_isd_flag = "",
$.nptxsso = null,
$.activetxsso = null,
$.sso_loadComplete = !0,
$.np_clock = 0,
$.loginQQnum = 0,
$.suportActive = function() {
    var t = !0;
    try {
        window.ActiveXObject || window.ActiveXObject.prototype ? (t = !0,
        window.ActiveXObject.prototype && !window.ActiveXObject && $.report.nlog("activeobject 判断有问题")) : t = !1
    } catch (e) {
        t = !1
    }
    return t
}
,
$.getLoginQQNum = function() {
    try {
        var t = 0;
        if ($.suportActive()) {
            $.plugin_isd_flag = "flag1=7808&flag2=1&flag3=20",
            $.report.setBasePoint($.plugin_isd_flag, new Date);
            var e = new ActiveXObject("SSOAxCtrlForPTLogin.SSOForPTLogin2");
            $.activetxsso = e;
            var i = e.CreateTXSSOData();
            e.InitSSOFPTCtrl(0, i);
            t = e.DoOperation(2, i).GetArray("PTALIST").GetSize();
            try {
                var n = e.QuerySSOInfo(1);
                $.sso_ver = n.GetInt("nSSOVersion")
            } catch (t) {
                $.sso_ver = 0
            }
        } else if (navigator.mimeTypes["application/nptxsso"])
            if ($.plugin_isd_flag = "flag1=7808&flag2=1&flag3=21",
            $.report.setBasePoint($.plugin_isd_flag, (new Date).getTime()),
            $.nptxsso || ($.nptxsso = document.createElement("embed"),
            $.nptxsso.type = "application/nptxsso",
            $.nptxsso.style.width = "0px",
            $.nptxsso.style.height = "0px",
            document.body.appendChild($.nptxsso)),
            "function" != typeof $.nptxsso.InitPVANoST)
                $.sso_loadComplete = !1,
                $.report.nlog("没有找到插件的InitPVANoST方法", 269929);
            else {
                var o = $.nptxsso.InitPVANoST();
                o && (t = $.nptxsso.GetPVACount(),
                $.sso_loadComplete = !0);
                try {
                    $.sso_ver = $.nptxsso.GetSSOVersion()
                } catch (t) {
                    $.sso_ver = 0
                }
            }
        else
            $.report.nlog("插件没有注册成功", 263744),
            $.sso_state = 2
    } catch (t) {
        var p = null;
        try {
            p = $.http.getXHR()
        } catch (t) {
            return 0
        }
        var r = t.message || t;
        return /^pt_windows_sso/.test(r) ? (/^pt_windows_sso_\d+_3/.test(r) ? $.report.nlog("QQ插件不支持该url" + t.message, 326044) : $.report.nlog("QQ插件抛出内部错误" + t.message, 325361),
        $.sso_state = 1) : p && "msie" == $.browser("type") ? "Win64" != window.navigator.platform ? ($.report.nlog("可能没有安装QQ" + t.message, 322340),
        $.sso_state = 2) : $.report.nlog("使用64位IE" + t.message, 343958) : ($.report.nlog("获取登录QQ号码出错" + t.message, 263745),
        window.ActiveXObject && "Win32" == window.navigator.platform && ($.sso_state = 1)),
        0
    }
    return $.loginQQnum = t,
    t
}
,
$.checkNPPlugin = function() {
    var t = 10;
    window.clearInterval($.np_clock),
    $.np_clock = window.setInterval(function() {
        "function" == typeof $.nptxsso.InitPVANoST || 0 == t ? (window.clearInterval($.np_clock),
        "function" == typeof $.nptxsso.InitPVANoST && pt.plogin.auth()) : t--
    }, 200)
}
,
$.guanjiaPlugin = null,
$.initGuanjiaPlugin = function() {
    try {
        window.ActiveXObject ? $.guanjiaPlugin = new ActiveXObject("npQMExtensionsIE.Basic") : navigator.mimeTypes["application/qqpcmgr-extensions-mozilla"] && ($.guanjiaPlugin = document.createElement("embed"),
        $.guanjiaPlugin.type = "application/qqpcmgr-extensions-mozilla",
        $.guanjiaPlugin.style.width = "0px",
        $.guanjiaPlugin.style.height = "0px",
        document.body.appendChild($.guanjiaPlugin));
        var t = $.guanjiaPlugin.QMGetVersion().split(".");
        4 == t.length && t[2] >= 9319 || ($.guanjiaPlugin = null)
    } catch (t) {
        $.guanjiaPlugin = null
    }
}
,
function() {
    "" != $.cookie.get("nohost_guid") && $.http.loadScript("/nohost_htdocs/js/SwitchHost.js", function() {
        var t = window.SwitchHost && window.SwitchHost.init;
        t && t()
    })
}(),

document.getElementsByClassName || (document.getElementsByClassName = function(t) {
    for (var e = [], i = new RegExp("(^| )" + t + "( |$)"), n = document.getElementsByTagName("*"), o = 0, p = n.length; o < p; o++)
        i.test(n[o].className) && e.push(n[o]);
    return e
}
),
$ = window.$ || {},
$pt = window.$pt || {},
window.RSA = function() {
    function t(t, e) {
        return new r(t,e)
    }
    function e(t, e) {
        if (e < t.length + 11)
            return uv_alert("Message too long for RSA"),
            null;
        for (var i = new Array, n = t.length - 1; n >= 0 && e > 0; ) {
            var o = t.charCodeAt(n--);
            i[--e] = o
        }
        i[--e] = 0;
        for (var p = new Y, s = new Array; e > 2; ) {
            for (s[0] = 0; 0 == s[0]; )
                p.nextBytes(s);
            i[--e] = s[0]
        }
        return i[--e] = 2,
        i[--e] = 0,
        new r(i)
    }
    function i() {
        this.n = null,
        this.e = 0,
        this.d = null,
        this.p = null,
        this.q = null,
        this.dmp1 = null,
        this.dmq1 = null,
        this.coeff = null
    }
    function n(e, i) {
        null != e && null != i && e.length > 0 && i.length > 0 ? (this.n = t(e, 16),
        this.e = parseInt(i, 16)) : uv_alert("Invalid RSA public key")
    }
    function o(t) {
        return t.modPowInt(this.e, this.n)
    }
    function p(t) {
        var i = e(t, this.n.bitLength() + 7 >> 3);
        if (null == i)
            return null;
        var n = this.doPublic(i);
        if (null == n)
            return null;
        var o = n.toString(16);
        return 0 == (1 & o.length) ? o : "0" + o
    }
    function r(t, e, i) {
        null != t && ("number" == typeof t ? this.fromNumber(t, e, i) : null == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
    }
    function s() {
        return new r(null)
    }
    function a(t, e, i, n, o, p) {
        for (; --p >= 0; ) {
            var r = e * this[t++] + i[n] + o;
            o = Math.floor(r / 67108864),
            i[n++] = 67108863 & r
        }
        return o
    }
    function l(t, e, i, n, o, p) {
        for (var r = 32767 & e, s = e >> 15; --p >= 0; ) {
            var a = 32767 & this[t]
              , l = this[t++] >> 15
              , c = s * a + l * r;
            a = r * a + ((32767 & c) << 15) + i[n] + (1073741823 & o),
            o = (a >>> 30) + (c >>> 15) + s * l + (o >>> 30),
            i[n++] = 1073741823 & a
        }
        return o
    }
    function c(t, e, i, n, o, p) {
        for (var r = 16383 & e, s = e >> 14; --p >= 0; ) {
            var a = 16383 & this[t]
              , l = this[t++] >> 14
              , c = s * a + l * r;
            a = r * a + ((16383 & c) << 14) + i[n] + o,
            o = (a >> 28) + (c >> 14) + s * l,
            i[n++] = 268435455 & a
        }
        return o
    }
    function u(t) {
        return at.charAt(t)
    }
    function g(t, e) {
        var i = lt[t.charCodeAt(e)];
        return null == i ? -1 : i
    }
    function d(t) {
        for (var e = this.t - 1; e >= 0; --e)
            t[e] = this[e];
        t.t = this.t,
        t.s = this.s
    }
    function h(t) {
        this.t = 1,
        this.s = t < 0 ? -1 : 0,
        t > 0 ? this[0] = t : t < -1 ? this[0] = t + DV : this.t = 0
    }
    function f(t) {
        var e = s();
        return e.fromInt(t),
        e
    }
    function _(t, e) {
        var i;
        if (16 == e)
            i = 4;
        else if (8 == e)
            i = 3;
        else if (256 == e)
            i = 8;
        else if (2 == e)
            i = 1;
        else if (32 == e)
            i = 5;
        else {
            if (4 != e)
                return void this.fromRadix(t, e);
            i = 2
        }
        this.t = 0,
        this.s = 0;
        for (var n = t.length, o = !1, p = 0; --n >= 0; ) {
            var s = 8 == i ? 255 & t[n] : g(t, n);
            s < 0 ? "-" == t.charAt(n) && (o = !0) : (o = !1,
            0 == p ? this[this.t++] = s : p + i > this.DB ? (this[this.t - 1] |= (s & (1 << this.DB - p) - 1) << p,
            this[this.t++] = s >> this.DB - p) : this[this.t - 1] |= s << p,
            (p += i) >= this.DB && (p -= this.DB))
        }
        8 == i && 0 != (128 & t[0]) && (this.s = -1,
        p > 0 && (this[this.t - 1] |= (1 << this.DB - p) - 1 << p)),
        this.clamp(),
        o && r.ZERO.subTo(this, this)
    }
    function m() {
        for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t; )
            --this.t
    }
    function $(t) {
        if (this.s < 0)
            return "-" + this.negate().toString(t);
        var e;
        if (16 == t)
            e = 4;
        else if (8 == t)
            e = 3;
        else if (2 == t)
            e = 1;
        else if (32 == t)
            e = 5;
        else {
            if (4 != t)
                return this.toRadix(t);
            e = 2
        }
        var i, n = (1 << e) - 1, o = !1, p = "", r = this.t, s = this.DB - r * this.DB % e;
        if (r-- > 0)
            for (s < this.DB && (i = this[r] >> s) > 0 && (o = !0,
            p = u(i)); r >= 0; )
                s < e ? (i = (this[r] & (1 << s) - 1) << e - s,
                i |= this[--r] >> (s += this.DB - e)) : (i = this[r] >> (s -= e) & n,
                s <= 0 && (s += this.DB,
                --r)),
                i > 0 && (o = !0),
                o && (p += u(i));
        return o ? p : "0"
    }
    function v() {
        var t = s();
        return r.ZERO.subTo(this, t),
        t
    }
    function y() {
        return this.s < 0 ? this.negate() : this
    }
    function w(t) {
        var e = this.s - t.s;
        if (0 != e)
            return e;
        var i = this.t;
        if (0 != (e = i - t.t))
            return e;
        for (; --i >= 0; )
            if (0 != (e = this[i] - t[i]))
                return e;
        return 0
    }
    function k(t) {
        var e, i = 1;
        return 0 != (e = t >>> 16) && (t = e,
        i += 16),
        0 != (e = t >> 8) && (t = e,
        i += 8),
        0 != (e = t >> 4) && (t = e,
        i += 4),
        0 != (e = t >> 2) && (t = e,
        i += 2),
        0 != (e = t >> 1) && (t = e,
        i += 1),
        i
    }
    function b() {
        return this.t <= 0 ? 0 : this.DB * (this.t - 1) + k(this[this.t - 1] ^ this.s & this.DM)
    }
    function q(t, e) {
        var i;
        for (i = this.t - 1; i >= 0; --i)
            e[i + t] = this[i];
        for (i = t - 1; i >= 0; --i)
            e[i] = 0;
        e.t = this.t + t,
        e.s = this.s
    }
    function S(t, e) {
        for (var i = t; i < this.t; ++i)
            e[i - t] = this[i];
        e.t = Math.max(this.t - t, 0),
        e.s = this.s
    }
    function C(t, e) {
        var i, n = t % this.DB, o = this.DB - n, p = (1 << o) - 1, r = Math.floor(t / this.DB), s = this.s << n & this.DM;
        for (i = this.t - 1; i >= 0; --i)
            e[i + r + 1] = this[i] >> o | s,
            s = (this[i] & p) << n;
        for (i = r - 1; i >= 0; --i)
            e[i] = 0;
        e[r] = s,
        e.t = this.t + r + 1,
        e.s = this.s,
        e.clamp()
    }
    function T(t, e) {
        e.s = this.s;
        var i = Math.floor(t / this.DB);
        if (i >= this.t)
            return void (e.t = 0);
        var n = t % this.DB
          , o = this.DB - n
          , p = (1 << n) - 1;
        e[0] = this[i] >> n;
        for (var r = i + 1; r < this.t; ++r)
            e[r - i - 1] |= (this[r] & p) << o,
            e[r - i] = this[r] >> n;
        n > 0 && (e[this.t - i - 1] |= (this.s & p) << o),
        e.t = this.t - i,
        e.clamp()
    }
    function x(t, e) {
        for (var i = 0, n = 0, o = Math.min(t.t, this.t); i < o; )
            n += this[i] - t[i],
            e[i++] = n & this.DM,
            n >>= this.DB;
        if (t.t < this.t) {
            for (n -= t.s; i < this.t; )
                n += this[i],
                e[i++] = n & this.DM,
                n >>= this.DB;
            n += this.s
        } else {
            for (n += this.s; i < t.t; )
                n -= t[i],
                e[i++] = n & this.DM,
                n >>= this.DB;
            n -= t.s
        }
        e.s = n < 0 ? -1 : 0,
        n < -1 ? e[i++] = this.DV + n : n > 0 && (e[i++] = n),
        e.t = i,
        e.clamp()
    }
    function L(t, e) {
        var i = this.abs()
          , n = t.abs()
          , o = i.t;
        for (e.t = o + n.t; --o >= 0; )
            e[o] = 0;
        for (o = 0; o < n.t; ++o)
            e[o + i.t] = i.am(0, n[o], e, o, 0, i.t);
        e.s = 0,
        e.clamp(),
        this.s != t.s && r.ZERO.subTo(e, e)
    }
    function N(t) {
        for (var e = this.abs(), i = t.t = 2 * e.t; --i >= 0; )
            t[i] = 0;
        for (i = 0; i < e.t - 1; ++i) {
            var n = e.am(i, e[i], t, 2 * i, 0, 1);
            (t[i + e.t] += e.am(i + 1, 2 * e[i], t, 2 * i + 1, n, e.t - i - 1)) >= e.DV && (t[i + e.t] -= e.DV,
            t[i + e.t + 1] = 1)
        }
        t.t > 0 && (t[t.t - 1] += e.am(i, e[i], t, 2 * i, 0, 1)),
        t.s = 0,
        t.clamp()
    }
    function E(t, e, i) {
        var n = t.abs();
        if (!(n.t <= 0)) {
            var o = this.abs();
            if (o.t < n.t)
                return null != e && e.fromInt(0),
                void (null != i && this.copyTo(i));
            null == i && (i = s());
            var p = s()
              , a = this.s
              , l = t.s
              , c = this.DB - k(n[n.t - 1]);
            c > 0 ? (n.lShiftTo(c, p),
            o.lShiftTo(c, i)) : (n.copyTo(p),
            o.copyTo(i));
            var u = p.t
              , g = p[u - 1];
            if (0 != g) {
                var d = g * (1 << this.F1) + (u > 1 ? p[u - 2] >> this.F2 : 0)
                  , h = this.FV / d
                  , f = (1 << this.F1) / d
                  , _ = 1 << this.F2
                  , m = i.t
                  , $ = m - u
                  , v = null == e ? s() : e;
                for (p.dlShiftTo($, v),
                i.compareTo(v) >= 0 && (i[i.t++] = 1,
                i.subTo(v, i)),
                r.ONE.dlShiftTo(u, v),
                v.subTo(p, p); p.t < u; )
                    p[p.t++] = 0;
                for (; --$ >= 0; ) {
                    var y = i[--m] == g ? this.DM : Math.floor(i[m] * h + (i[m - 1] + _) * f);
                    if ((i[m] += p.am(0, y, i, $, 0, u)) < y)
                        for (p.dlShiftTo($, v),
                        i.subTo(v, i); i[m] < --y; )
                            i.subTo(v, i)
                }
                null != e && (i.drShiftTo(u, e),
                a != l && r.ZERO.subTo(e, e)),
                i.t = u,
                i.clamp(),
                c > 0 && i.rShiftTo(c, i),
                a < 0 && r.ZERO.subTo(i, i)
            }
        }
    }
    function P(t) {
        var e = s();
        return this.abs().divRemTo(t, null, e),
        this.s < 0 && e.compareTo(r.ZERO) > 0 && t.subTo(e, e),
        e
    }
    function A(t) {
        this.m = t
    }
    function I(t) {
        return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t
    }
    function Q(t) {
        return t
    }
    function M(t) {
        t.divRemTo(this.m, null, t)
    }
    function D(t, e, i) {
        t.multiplyTo(e, i),
        this.reduce(i)
    }
    function B(t, e) {
        t.squareTo(e),
        this.reduce(e)
    }
    function H() {
        if (this.t < 1)
            return 0;
        var t = this[0];
        if (0 == (1 & t))
            return 0;
        var e = 3 & t;
        return e = e * (2 - (15 & t) * e) & 15,
        e = e * (2 - (255 & t) * e) & 255,
        e = e * (2 - ((65535 & t) * e & 65535)) & 65535,
        e = e * (2 - t * e % this.DV) % this.DV,
        e > 0 ? this.DV - e : -e
    }
    function U(t) {
        this.m = t,
        this.mp = t.invDigit(),
        this.mpl = 32767 & this.mp,
        this.mph = this.mp >> 15,
        this.um = (1 << t.DB - 15) - 1,
        this.mt2 = 2 * t.t
    }
    function O(t) {
        var e = s();
        return t.abs().dlShiftTo(this.m.t, e),
        e.divRemTo(this.m, null, e),
        t.s < 0 && e.compareTo(r.ZERO) > 0 && this.m.subTo(e, e),
        e
    }
    function j(t) {
        var e = s();
        return t.copyTo(e),
        this.reduce(e),
        e
    }
    function V(t) {
        for (; t.t <= this.mt2; )
            t[t.t++] = 0;
        for (var e = 0; e < this.m.t; ++e) {
            var i = 32767 & t[e]
              , n = i * this.mpl + ((i * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
            for (i = e + this.m.t,
            t[i] += this.m.am(0, n, t, e, 0, this.m.t); t[i] >= t.DV; )
                t[i] -= t.DV,
                t[++i]++
        }
        t.clamp(),
        t.drShiftTo(this.m.t, t),
        t.compareTo(this.m) >= 0 && t.subTo(this.m, t)
    }
    function R(t, e) {
        t.squareTo(e),
        this.reduce(e)
    }
    function F(t, e, i) {
        t.multiplyTo(e, i),
        this.reduce(i)
    }
    function G() {
        return 0 == (this.t > 0 ? 1 & this[0] : this.s)
    }
    function z(t, e) {
        if (t > 4294967295 || t < 1)
            return r.ONE;
        var i = s()
          , n = s()
          , o = e.convert(this)
          , p = k(t) - 1;
        for (o.copyTo(i); --p >= 0; )
            if (e.sqrTo(i, n),
            (t & 1 << p) > 0)
                e.mulTo(n, o, i);
            else {
                var a = i;
                i = n,
                n = a
            }
        return e.revert(i)
    }
    function W(t, e) {
        var i;
        return i = t < 256 || e.isEven() ? new A(e) : new U(e),
        this.exp(t, i)
    }
    function X(t) {
        ut[gt++] ^= 255 & t,
        ut[gt++] ^= t >> 8 & 255,
        ut[gt++] ^= t >> 16 & 255,
        ut[gt++] ^= t >> 24 & 255,
        gt >= ft && (gt -= ft)
    }
    function Z() {
        X((new Date).getTime())
    }
    function K() {
        if (null == ct) {
            for (Z(),
            ct = nt(),
            ct.init(ut),
            gt = 0; gt < ut.length; ++gt)
                ut[gt] = 0;
            gt = 0
        }
        return ct.next()
    }
    function J(t) {
        var e;
        for (e = 0; e < t.length; ++e)
            t[e] = K()
    }
    function Y() {}
    function tt() {
        this.i = 0,
        this.j = 0,
        this.S = new Array
    }
    function et(t) {
        var e, i, n;
        for (e = 0; e < 256; ++e)
            this.S[e] = e;
        for (i = 0,
        e = 0; e < 256; ++e)
            i = i + this.S[e] + t[e % t.length] & 255,
            n = this.S[e],
            this.S[e] = this.S[i],
            this.S[i] = n;
        this.i = 0,
        this.j = 0
    }
    function it() {
        var t;
        return this.i = this.i + 1 & 255,
        this.j = this.j + this.S[this.i] & 255,
        t = this.S[this.i],
        this.S[this.i] = this.S[this.j],
        this.S[this.j] = t,
        this.S[t + this.S[this.i] & 255]
    }
    function nt() {
        return new tt
    }
    function ot(t, e, n) {
        e = "e9a815ab9d6e86abbf33a4ac64e9196d5be44a09bd0ed6ae052914e1a865ac8331fed863de8ea697e9a7f63329e5e23cda09c72570f46775b7e39ea9670086f847d3c9c51963b131409b1e04265d9747419c635404ca651bbcbc87f99b8008f7f5824653e3658be4ba73e4480156b390bb73bc1f8b33578e7a4e12440e9396f2552c1aff1c92e797ebacdc37c109ab7bce2367a19c56a033ee04534723cc2558cb27368f5b9d32c04d12dbd86bbd68b1d99b7c349a8453ea75d1b2e94491ab30acf6c46a36a75b721b312bedf4e7aad21e54e9bcbcf8144c79b6e3c05eb4a1547750d224c0085d80e6da3907c3d945051c13c7c1dcefd6520ee8379c4f5231ed",
        n = "10001";
        var o = new i;
        return o.setPublic(e, n),
        o.encrypt(t)
    }
    i.prototype.doPublic = o,
    i.prototype.setPublic = n,
    i.prototype.encrypt = p;
    var pt;
    "Microsoft Internet Explorer" == navigator.appName ? (r.prototype.am = l,
    pt = 30) : "Netscape" != navigator.appName ? (r.prototype.am = a,
    pt = 26) : (r.prototype.am = c,
    pt = 28),
    r.prototype.DB = pt,
    r.prototype.DM = (1 << pt) - 1,
    r.prototype.DV = 1 << pt;
    r.prototype.FV = Math.pow(2, 52),
    r.prototype.F1 = 52 - pt,
    r.prototype.F2 = 2 * pt - 52;
    var rt, st, at = "0123456789abcdefghijklmnopqrstuvwxyz", lt = new Array;
    for (rt = "0".charCodeAt(0),
    st = 0; st <= 9; ++st)
        lt[rt++] = st;
    for (rt = "a".charCodeAt(0),
    st = 10; st < 36; ++st)
        lt[rt++] = st;
    for (rt = "A".charCodeAt(0),
    st = 10; st < 36; ++st)
        lt[rt++] = st;
    A.prototype.convert = I,
    A.prototype.revert = Q,
    A.prototype.reduce = M,
    A.prototype.mulTo = D,
    A.prototype.sqrTo = B,
    U.prototype.convert = O,
    U.prototype.revert = j,
    U.prototype.reduce = V,
    U.prototype.mulTo = F,
    U.prototype.sqrTo = R,
    r.prototype.copyTo = d,
    r.prototype.fromInt = h,
    r.prototype.fromString = _,
    r.prototype.clamp = m,
    r.prototype.dlShiftTo = q,
    r.prototype.drShiftTo = S,
    r.prototype.lShiftTo = C,
    r.prototype.rShiftTo = T,
    r.prototype.subTo = x,
    r.prototype.multiplyTo = L,
    r.prototype.squareTo = N,
    r.prototype.divRemTo = E,
    r.prototype.invDigit = H,
    r.prototype.isEven = G,
    r.prototype.exp = z,
    r.prototype.toString = $,
    r.prototype.negate = v,
    r.prototype.abs = y,
    r.prototype.compareTo = w,
    r.prototype.bitLength = b,
    r.prototype.mod = P,
    r.prototype.modPowInt = W,
    r.ZERO = f(0),
    r.ONE = f(1);
    var ct, ut, gt;
    if (null == ut) {
        ut = new Array,
        gt = 0;
        var dt;
        if ("Netscape" == navigator.appName && navigator.appVersion < "5" && window.crypto && window.crypto.random) {
            var ht = window.crypto.random(32);
            for (dt = 0; dt < ht.length; ++dt)
                ut[gt++] = 255 & ht.charCodeAt(dt)
        }
        for (; gt < ft; )
            dt = Math.floor(65536 * Math.random()),
            ut[gt++] = dt >>> 8,
            ut[gt++] = 255 & dt;
        gt = 0,
        Z()
    }
    Y.prototype.nextBytes = J,
    tt.prototype.init = et,
    tt.prototype.next = it;
    var ft = 256;
    return {
        rsa_encrypt: ot
    }
}(),
function(t) {
    function e() {
        return Math.round(4294967295 * Math.random())
    }
    function i(t, e, i) {
        (!i || i > 4) && (i = 4);
        for (var n = 0, o = e; o < e + i; o++)
            n <<= 8,
            n |= t[o];
        return (4294967295 & n) >>> 0
    }
    function n(t, e, i) {
        t[e + 3] = i >> 0 & 255,
        t[e + 2] = i >> 8 & 255,
        t[e + 1] = i >> 16 & 255,
        t[e + 0] = i >> 24 & 255
    }
    function o(t) {
        if (!t)
            return "";
        for (var e = "", i = 0; i < t.length; i++) {
            var n = Number(t[i]).toString(16);
            1 == n.length && (n = "0" + n),
            e += n
        }
        return e
    }
    function p(t) {
        for (var e = "", i = 0; i < t.length; i += 2)
            e += String.fromCharCode(parseInt(t.substr(i, 2), 16));
        return e
    }
    function r(t, e) {
        if (!t)
            return "";
        e && (t = s(t));
        for (var i = [], n = 0; n < t.length; n++)
            i[n] = t.charCodeAt(n);
        return o(i)
    }
    function s(t) {
        var e, i, n = [], o = t.length;
        for (e = 0; e < o; e++)
            i = t.charCodeAt(e),
            i > 0 && i <= 127 ? n.push(t.charAt(e)) : i >= 128 && i <= 2047 ? n.push(String.fromCharCode(192 | i >> 6 & 31), String.fromCharCode(128 | 63 & i)) : i >= 2048 && i <= 65535 && n.push(String.fromCharCode(224 | i >> 12 & 15), String.fromCharCode(128 | i >> 6 & 63), String.fromCharCode(128 | 63 & i));
        return n.join("")
    }
    function a(t) {
        m = new Array(8),
        $ = new Array(8),
        v = y = 0,
        b = !0,
        _ = 0;
        var i = t.length
          , n = 0;
        _ = (i + 10) % 8,
        0 != _ && (_ = 8 - _),
        w = new Array(i + _ + 10),
        m[0] = 255 & (248 & e() | _);
        for (var o = 1; o <= _; o++)
            m[o] = 255 & e();
        _++;
        for (var o = 0; o < 8; o++)
            $[o] = 0;
        for (n = 1; n <= 2; )
            _ < 8 && (m[_++] = 255 & e(),
            n++),
            8 == _ && c();
        for (var o = 0; i > 0; )
            _ < 8 && (m[_++] = t[o++],
            i--),
            8 == _ && c();
        for (n = 1; n <= 7; )
            _ < 8 && (m[_++] = 0,
            n++),
            8 == _ && c();
        return w
    }
    function l(t) {
        var e = 0
          , i = new Array(8)
          , n = t.length;
        if (k = t,
        n % 8 != 0 || n < 16)
            return null;
        if ($ = g(t),
        _ = 7 & $[0],
        (e = n - _ - 10) < 0)
            return null;
        for (var o = 0; o < i.length; o++)
            i[o] = 0;
        w = new Array(e),
        y = 0,
        v = 8,
        _++;
        for (var p = 1; p <= 2; )
            if (_ < 8 && (_++,
            p++),
            8 == _ && (i = t,
            !d()))
                return null;
        for (var o = 0; 0 != e; )
            if (_ < 8 && (w[o] = 255 & (i[y + _] ^ $[_]),
            o++,
            e--,
            _++),
            8 == _ && (i = t,
            y = v - 8,
            !d()))
                return null;
        for (p = 1; p < 8; p++) {
            if (_ < 8) {
                if (0 != (i[y + _] ^ $[_]))
                    return null;
                _++
            }
            if (8 == _ && (i = t,
            y = v,
            !d()))
                return null
        }
        return w
    }
    function c() {
        for (var t = 0; t < 8; t++)
            m[t] ^= b ? $[t] : w[y + t];
        for (var e = u(m), t = 0; t < 8; t++)
            w[v + t] = e[t] ^ $[t],
            $[t] = m[t];
        y = v,
        v += 8,
        _ = 0,
        b = !1
    }
    function u(t) {
        for (var e = 16, o = i(t, 0, 4), p = i(t, 4, 4), r = i(f, 0, 4), s = i(f, 4, 4), a = i(f, 8, 4), l = i(f, 12, 4), c = 0; e-- > 0; )
            c += 2654435769,
            c = (4294967295 & c) >>> 0,
            o += (p << 4) + r ^ p + c ^ (p >>> 5) + s,
            o = (4294967295 & o) >>> 0,
            p += (o << 4) + a ^ o + c ^ (o >>> 5) + l,
            p = (4294967295 & p) >>> 0;
        var u = new Array(8);
        return n(u, 0, o),
        n(u, 4, p),
        u
    }
    function g(t) {
        for (var e = 16, o = i(t, 0, 4), p = i(t, 4, 4), r = i(f, 0, 4), s = i(f, 4, 4), a = i(f, 8, 4), l = i(f, 12, 4), c = 3816266640; e-- > 0; )
            p -= (o << 4) + a ^ o + c ^ (o >>> 5) + l,
            p = (4294967295 & p) >>> 0,
            o -= (p << 4) + r ^ p + c ^ (p >>> 5) + s,
            o = (4294967295 & o) >>> 0,
            c -= 2654435769,
            c = (4294967295 & c) >>> 0;
        var u = new Array(8);
        return n(u, 0, o),
        n(u, 4, p),
        u
    }
    function d() {
        for (var t = (k.length,
        0); t < 8; t++)
            $[t] ^= k[v + t];
        return $ = g($),
        v += 8,
        _ = 0,
        !0
    }
    function h(t, e) {
        var i = [];
        if (e)
            for (var n = 0; n < t.length; n++)
                i[n] = 255 & t.charCodeAt(n);
        else
            for (var o = 0, n = 0; n < t.length; n += 2)
                i[o++] = parseInt(t.substr(n, 2), 16);
        return i
    }
    var f = ""
      , _ = 0
      , m = []
      , $ = []
      , v = 0
      , y = 0
      , w = []
      , k = []
      , b = !0;
    window.TEA = {
        encrypt: function(t, e) {
            return o(a(h(t, e)))
        },
        enAsBase64: function(t, e) {
            for (var i = h(t, e), n = a(i), o = "", p = 0; p < n.length; p++)
                o += String.fromCharCode(n[p]);
            return btoa(o)
        },
        decrypt: function(t) {
            return o(l(h(t, !1)))
        },
        initkey: function(t, e) {
            f = h(t, e)
        },
        bytesToStr: p,
        strToBytes: r,
        bytesInStr: o,
        dataFromStr: h
    };
    var q = {};
    q.PADCHAR = "=",
    q.ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    q.getbyte = function(t, e) {
        var i = t.charCodeAt(e);
        if (i > 255)
            throw "INVALID_CHARACTER_ERR: DOM Exception 5";
        return i
    }
    ,
    window.btoa = function(t) {
        if (1 != arguments.length)
            throw "SyntaxError: Not enough arguments";
        var e, i, n = q.PADCHAR, o = q.ALPHA, p = q.getbyte, r = [];
        t = "" + t;
        var s = t.length - t.length % 3;
        if (0 == t.length)
            return t;
        for (e = 0; e < s; e += 3)
            i = p(t, e) << 16 | p(t, e + 1) << 8 | p(t, e + 2),
            r.push(o.charAt(i >> 18)),
            r.push(o.charAt(i >> 12 & 63)),
            r.push(o.charAt(i >> 6 & 63)),
            r.push(o.charAt(63 & i));
        switch (t.length - s) {
        case 1:
            i = p(t, e) << 16,
            r.push(o.charAt(i >> 18) + o.charAt(i >> 12 & 63) + n + n);
            break;
        case 2:
            i = p(t, e) << 16 | p(t, e + 1) << 8,
            r.push(o.charAt(i >> 18) + o.charAt(i >> 12 & 63) + o.charAt(i >> 6 & 63) + n)
        }
        return r.join("")
    }
}(window),
$ = window.$ || {},
$pt = {},
Encryption = function() {
    function t(t) {
        return e(t)
    }
    function e(t) {
        return u(i(c(t), t.length * m))
    }
    function i(t, e) {
        t[e >> 5] |= 128 << e % 32,
        t[14 + (e + 64 >>> 9 << 4)] = e;
        for (var i = 1732584193, n = -271733879, l = -1732584194, c = 271733878, u = 0; u < t.length; u += 16) {
            var g = i
              , d = n
              , h = l
              , f = c;
            i = o(i, n, l, c, t[u + 0], 7, -680876936),
            c = o(c, i, n, l, t[u + 1], 12, -389564586),
            l = o(l, c, i, n, t[u + 2], 17, 606105819),
            n = o(n, l, c, i, t[u + 3], 22, -1044525330),
            i = o(i, n, l, c, t[u + 4], 7, -176418897),
            c = o(c, i, n, l, t[u + 5], 12, 1200080426),
            l = o(l, c, i, n, t[u + 6], 17, -1473231341),
            n = o(n, l, c, i, t[u + 7], 22, -45705983),
            i = o(i, n, l, c, t[u + 8], 7, 1770035416),
            c = o(c, i, n, l, t[u + 9], 12, -1958414417),
            l = o(l, c, i, n, t[u + 10], 17, -42063),
            n = o(n, l, c, i, t[u + 11], 22, -1990404162),
            i = o(i, n, l, c, t[u + 12], 7, 1804603682),
            c = o(c, i, n, l, t[u + 13], 12, -40341101),
            l = o(l, c, i, n, t[u + 14], 17, -1502002290),
            n = o(n, l, c, i, t[u + 15], 22, 1236535329),
            i = p(i, n, l, c, t[u + 1], 5, -165796510),
            c = p(c, i, n, l, t[u + 6], 9, -1069501632),
            l = p(l, c, i, n, t[u + 11], 14, 643717713),
            n = p(n, l, c, i, t[u + 0], 20, -373897302),
            i = p(i, n, l, c, t[u + 5], 5, -701558691),
            c = p(c, i, n, l, t[u + 10], 9, 38016083),
            l = p(l, c, i, n, t[u + 15], 14, -660478335),
            n = p(n, l, c, i, t[u + 4], 20, -405537848),
            i = p(i, n, l, c, t[u + 9], 5, 568446438),
            c = p(c, i, n, l, t[u + 14], 9, -1019803690),
            l = p(l, c, i, n, t[u + 3], 14, -187363961),
            n = p(n, l, c, i, t[u + 8], 20, 1163531501),
            i = p(i, n, l, c, t[u + 13], 5, -1444681467),
            c = p(c, i, n, l, t[u + 2], 9, -51403784),
            l = p(l, c, i, n, t[u + 7], 14, 1735328473),
            n = p(n, l, c, i, t[u + 12], 20, -1926607734),
            i = r(i, n, l, c, t[u + 5], 4, -378558),
            c = r(c, i, n, l, t[u + 8], 11, -2022574463),
            l = r(l, c, i, n, t[u + 11], 16, 1839030562),
            n = r(n, l, c, i, t[u + 14], 23, -35309556),
            i = r(i, n, l, c, t[u + 1], 4, -1530992060),
            c = r(c, i, n, l, t[u + 4], 11, 1272893353),
            l = r(l, c, i, n, t[u + 7], 16, -155497632),
            n = r(n, l, c, i, t[u + 10], 23, -1094730640),
            i = r(i, n, l, c, t[u + 13], 4, 681279174),
            c = r(c, i, n, l, t[u + 0], 11, -358537222),
            l = r(l, c, i, n, t[u + 3], 16, -722521979),
            n = r(n, l, c, i, t[u + 6], 23, 76029189),
            i = r(i, n, l, c, t[u + 9], 4, -640364487),
            c = r(c, i, n, l, t[u + 12], 11, -421815835),
            l = r(l, c, i, n, t[u + 15], 16, 530742520),
            n = r(n, l, c, i, t[u + 2], 23, -995338651),
            i = s(i, n, l, c, t[u + 0], 6, -198630844),
            c = s(c, i, n, l, t[u + 7], 10, 1126891415),
            l = s(l, c, i, n, t[u + 14], 15, -1416354905),
            n = s(n, l, c, i, t[u + 5], 21, -57434055),
            i = s(i, n, l, c, t[u + 12], 6, 1700485571),
            c = s(c, i, n, l, t[u + 3], 10, -1894986606),
            l = s(l, c, i, n, t[u + 10], 15, -1051523),
            n = s(n, l, c, i, t[u + 1], 21, -2054922799),
            i = s(i, n, l, c, t[u + 8], 6, 1873313359),
            c = s(c, i, n, l, t[u + 15], 10, -30611744),
            l = s(l, c, i, n, t[u + 6], 15, -1560198380),
            n = s(n, l, c, i, t[u + 13], 21, 1309151649),
            i = s(i, n, l, c, t[u + 4], 6, -145523070),
            c = s(c, i, n, l, t[u + 11], 10, -1120210379),
            l = s(l, c, i, n, t[u + 2], 15, 718787259),
            n = s(n, l, c, i, t[u + 9], 21, -343485551),
            i = a(i, g),
            n = a(n, d),
            l = a(l, h),
            c = a(c, f)
        }
        return 16 == v ? Array(n, l) : Array(i, n, l, c)
    }
    function n(t, e, i, n, o, p) {
        return a(l(a(a(e, t), a(n, p)), o), i)
    }
    function o(t, e, i, o, p, r, s) {
        return n(e & i | ~e & o, t, e, p, r, s)
    }
    function p(t, e, i, o, p, r, s) {
        return n(e & o | i & ~o, t, e, p, r, s)
    }
    function r(t, e, i, o, p, r, s) {
        return n(e ^ i ^ o, t, e, p, r, s)
    }
    function s(t, e, i, o, p, r, s) {
        return n(i ^ (e | ~o), t, e, p, r, s)
    }
    function a(t, e) {
        var i = (65535 & t) + (65535 & e);
        return (t >> 16) + (e >> 16) + (i >> 16) << 16 | 65535 & i
    }
    function l(t, e) {
        return t << e | t >>> 32 - e
    }
    function c(t) {
        for (var e = Array(), i = (1 << m) - 1, n = 0; n < t.length * m; n += m)
            e[n >> 5] |= (t.charCodeAt(n / m) & i) << n % 32;
        return e
    }
    function u(t) {
        for (var e = _ ? "0123456789ABCDEF" : "0123456789abcdef", i = "", n = 0; n < 4 * t.length; n++)
            i += e.charAt(t[n >> 2] >> n % 4 * 8 + 4 & 15) + e.charAt(t[n >> 2] >> n % 4 * 8 & 15);
        return i
    }
    function g(t) {
        for (var e = [], i = 0; i < t.length; i += 2)
            e.push(String.fromCharCode(parseInt(t.substr(i, 2), 16)));
        return e.join("")
    }
    function d(t, e) {
        if (!(Math.random() > (e || 1)))
            try {
                var i = location.protocol + "//ui.ptlogin2.qq.com/cgi-bin/report?id=" + t;
                document.createElement("img").src = i
            } catch (t) {}
    }
    function h(e, i, n, o) {
        n = n || "",
        e = e || "";
        for (var p = o ? e : t(e), r = g(p), s = t(r + i), a = window.TEA.strToBytes(n.toUpperCase(), !0), l = Number(a.length / 2).toString(16); l.length < 4; )
            l = "0" + l;
        window.TEA.initkey(s);
        var c = window.TEA.encrypt(p + window.TEA.strToBytes(i) + l + a);
        window.TEA.initkey("");
        for (var u = Number(c.length / 2).toString(16); u.length < 4; )
            u = "0" + u;
        var h = window.RSA.rsa_encrypt(g(u + c));
        return window.btoa(g(h)).replace(/[\/\+=]/g, function(t) {
            return {
                "/": "-",
                "+": "*",
                "=": "_"
            }[t]
        })
    }
    function f(e, i, n) {
        var o = n ? e : t(e)
          , p = o + i.toUpperCase();
        return $.RSA.rsa_encrypt(p)
    }
    var _ = 1
      , m = 8
      , v = 32;
    return {
        getEncryption: h,
        getRSAEncryption: f,
        md5: t
    }
}(),
pt.headerCache = {
    update: function(t) {
        var e = $("img_" + t);
        e ? pt.headerCache[t] && pt.headerCache[t].indexOf("sys.getface.qq.com") > -1 ? e.src = pt.plogin.dftImg : e.src = pt.headerCache[t] || pt.plogin.dftImg : pt.headerCache[t] && pt.headerCache[t].indexOf("sys.getface.qq.com") > -1 ? $("auth_face").src = pt.plogin.dftImg : $("auth_face").src = pt.headerCache[t] || pt.plogin.dftImg
    }
},
pt.setHeader = function(t) {
    for (var e in t)
        pt.headerCache[e] = t[e],
        "" != e && pt.headerCache.update(e)
}
;
var __pt_ieZeroLogin = !1
  , __pt_webkitZeroLogin = !1;




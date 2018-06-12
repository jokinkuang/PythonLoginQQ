#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import urllib
import re
import requests
from pyv8 import PyV8
# from v8browser.jsrt import JSR


class QQ_Login:
    """
    使用V8引擎
    加密JS参考：qq.login.encrypt.js 里面做了一些简单的修改，谢谢大庆哥(rsnl: LiuQing)友情提供
    参考登录组件：http://ui.ptlogin2.qq.com/cgi-bin/login?hide_title_bar=0&low_login=0&qlogin_auto_login=1&no_verifyimg=1&link_target=blank&appid=636014201&target=self&s_url=http%3A//www.qq.com/qq2012/loginSuccess.htm
    """
    ## default qq info
    # jsRT = None
    appid = 603049403
    action = '2-1-1523195018891'
    # https://xui.ptlogin2.qq.com/cgi-bin/xlogin?hide_border=1&hide_close_icon=1&low_login=0&appid=603049403&daid=276&s_url=https%3A%2F%2Fcas.bugly.qq.com%2Fcas%2FloginBack%3Ftype%3D9
    # urlRaw = "https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=603049403&daid=276&s_url=https%3A%2F%2Fcas.bugly.qq.com%2Fcas%2FloginBack%3Ftype%3D9"
    urlRaw = "https://xui.ptlogin2.qq.com/cgi-bin/xlogin?hide_border=1&hide_close_icon=1&low_login=0&appid=603049403&daid=27"
    # urlRaw = 'https://cas.bugly.qq.com/cas/login?service=https%3A%2F%2Fbugly.qq.com%2Fv2%2Fworkbench%2Fapps'
    # successUrl = 'https://bugly.qq.com/v2/workbench/apps'
    urlCheck = 'https://ssl.ptlogin2.qq.com/check'
    urlLogin = 'https://ssl.ptlogin2.qq.com/login'
    urlSuccess = 'https://bugly.qq.com/v2/workbench/apps'
    login_sig = None #"KPAIlL6yTckBiQrTnWEY0CTLJDQ8J3Q7D*K8-FEBlbflrQwFVKlYa9FnjBKF6EUH"
    headers = {
        'pragma': 'no-cache',
        'referer': 'https://xui.ptlogin2.qq.com/cgi-bin/xlogin?hide_border=1&hide_close_icon=1&low_login=0&appid=603049403&daid=276',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
    }

    def __init__(self, uin, pwd):
        self.uin = uin
        self.pwd = pwd
        self.nick = None
        self.session = requests.Session()
        self.pt_verifysession_v1 = ""
        # self.jsRT = JSR("<html>empty</html>")

    def run(self):
        sig_flag, sig_msg = self.get_signature()
        if sig_flag:
            n = 0
            while n < 3:
                check_flag, check_msg = self.check_login()
                if check_flag:
                    login_flag, login_msg = self.login()
                    if login_flag:
                        print "User %s login Ok, nickname: %s" %(self.uin, self.nick)
                        print "Cookie info:"
                        for c in self.session.cookies:
                            print c
                        self.get_app_list()
                    else:
                        print login_msg
                    break
                else:
                    print check_msg
                    n += 1
                    print "Need Verifycode. Try again."
        else:
            print sig_msg

    def get_signature(self):
        """
        step 1, load web login iframe and get a login signature
        """
        params = {
            'no_verifyimg': 1,
            "appid": self.appid,
            "s_url": self.urlSuccess,
            "style": 20,
            "border_radius": 1,
            "target": "self",
            "maskOpacity": 40
        }
        if self.login_sig is not None:
            return [True, ""]
        params = urllib.urlencode(params)
        url = "%s?%s" %(self.urlRaw, params)
        print "loading url:"+url
        r = self.session.get(url, timeout=30, headers=self.headers)
        # r = requests.get(url, timeout=30, headers=self.headers)
        # self.jsRT.execute(r.text)
        if 200 != r.status_code:
            error_msg = "[Get signature error] %s %s" %(r.status_code, url)
            print "# Step1: get login sig failed:"+error_msg
            return [False, error_msg]
        else:
            self.login_sig = self.session.cookies['pt_login_sig']
            print "# Step1: Login sig is " + self.login_sig
            return [True, ""]

    def check_login(self):
        '''
        step 2: get verifycode and pt_verifysession_v1.
        TX will check username and the login's environment is safe

        example
        requests: http://check.ptlogin2.qq.com/check?regmaster=&pt_tea=1&pt_vcode=1&uin=1802014971&appid=636014201&js_ver=10151&js_type=1&login_sig=YRQ*Xx0x-1yLCn3W0bmxd-Md2*qgxUCe66sH5DFlDLRJMIXvF7WGP0jyLBjkk8f2&u1=http%3A%2F%2Fwww.qq.com%2Fqq2012%2FloginSuccess.htm&r=0.8094342746365941
        response: ptui_checkVC('0','!FKL','\x00\x00\x00\x00\x6b\x68\x90\xfc','025dcaccfbc7ef17ddaf6f2b5b80a37fbe65611d579f893114a984d23c0438c67c53da5525ff368f0224ac62d0d07a1b360a097eac64f219','0');
        '''
        params = {
            # "uin": self.uin,
            # "appid": self.appid,
            # "pt_tea": 1,
            # "pt_vcode": 1,
            # "js_ver": 10151,
            # "js_type": 1,
            # "login_sig": self.login_sig,
            # "u1": self.urlSuccess,
            "regmaster":"",
            "pt_tea":2,
            "pt_vcode": 1,
            "uin": self.uin,
            "appid": self.appid,
            "js_ver": 10270,
            "js_type": 1,
            "login_sig": self.login_sig,
            "u1": self.urlSuccess,
            "r": 0.6881583041625727,
            "pt_uistyle": 40,
            "pt_jstoken": 825386474,
        }
        params = urllib.urlencode(params)
        url = "%s?%s" %(self.urlCheck, params)
        r = self.session.get(url)
        if 200 != r.status_code:
            error_msg = "[Get verifycode error] %s %s" %(r.status_code, url)
            return [False, error_msg]
        else:
            print r.text
            v = re.findall('\'(.*?)\'', r.text)
            self.check_code = v[0]
            print "# Step2. Check verifycode " + self.check_code
            if self.check_code != '0':
                error_msg = "[Verifycode not 0] %s %s" %(self.check_code, url)
                return [False, error_msg]
            self.verifycode = v[1]
            self.salt = v[2]
            self.pt_verifysession_v1 = v[3]
            return [True, ""]

    def login(self):
        '''
        step 3: login and get cookie.
        TX will check encrypt(password)

        example
        requests: http://ptlogin2.qq.com/login?u=1802014971&verifycode=!OYZ&pt_vcode_v1=0&pt_verifysession_v1=b8be1c5453957e14efb7c0f7d42586b3e88c6299a118236e1281c7761f0a0e0fec45b8aea6671244eee48f89c57d577670506acddca203e0&p=bVhYmmZQRxkIGxzMv0ac7WSDu9JzT8oZQhVRBShYqK54PJgykXnTNTwrPbxNShmCjOMFarrILgwipCdwBpXER2UZ-B2jyLc467Z1*5d8Tc8fW-bNgJUYAkKmWguZEQ1V2WODU4gGXMRlKkC-geveBIJZYLAB1KoU2ncyIZEodboa1ZFoGavK3rrdy*q7zweWD-8NP-fnRhmAsykz2TmKww__&pt_randsalt=0&ptredirect=0&u1=http%3A%2F%2Fwww.qq.com%2Fqq2012%2FloginSuccess.htm&h=1&t=1&g=1&from_ui=1&ptlang=2052&action=3-0-1456900566808&js_ver=10151&js_type=1&login_sig=-v*7eYY3VqnPdd2G8zeHtFWpUwBygrAb540e-Kr*XfieZNJPkh5Aq3EUMvexH4wN&pt_uistyle=20&aid=636014201&        response: ptui_checkVC('0','!FKL','\x00\x00\x00\x00\x6b\x68\x90\xfb','025dcaccfbc7ef17ddaf6f2b5b80a37fbe65611d579f893114a984d23c0438c67c53da5525ff368f0224ac62d0d07a1b360a097eac64f219','0');
        response: ptuiCB('0','0','http://www.qq.com/qq2012/loginSuccess.htm','0','登录成功！', '艾希吧');
                set-cookie!!!
        '''
        encrypt_pwd  =  self.tx_pwd_encode_by_js(self.pwd, self.salt, self.verifycode)


        if not self.pt_verifysession_v1:
            self.pt_verifysession_v1 = self.session.cookies['ptvfsession']
        params = {
            # 'u': self.uin,
            # 'verifycode': self.verifycode,
            # 'pt_vcode_v1': 0,
            # 'pt_verifysession_v1': self.pt_verifysession_v1,
            # 'p': encrypt_pwd,
            # 'pt_randsalt': 2,
            # 'u1': self.urlSuccess,
            # 'ptredirect': 1,
            # 'h': 1,
            # 't': 1,
            # 'g': 1,
            # 'from_ui': 1,
            # 'ptlang': 2052,
            # 'action': self.action,
            # 'js_ver': 10270,
            # 'js_type': 1,
            # 'aid': self.appid,
            # 'daid': 276,
            # 'login_sig': self.login_sig,

            'u': self.uin,
            'verifycode': self.verifycode,
            'pt_vcode_v1': 0,
            'pt_verifysession_v1': self.pt_verifysession_v1,
            'p': encrypt_pwd,
            'pt_randsalt': 2,
            'pt_jstoken': 825386474,
            'u1': self.urlSuccess,
            'ptredirect': 0,
            'h': 1,
            't': 1,
            'g': 1,
            'from_ui': 1,  # ui会返回ptuiCB。
            'ptlang': 2052,
            'action': 1 - 2 - 1523238136286,
            'js_ver': 10270,
            'js_type': 1,
            'login_sig': self.login_sig,
            'pt_uistyle': 40,
            'aid': self.appid,
        }
        params = urllib.urlencode(params)
        url = "%s?%s" %(self.urlLogin, params)
        r = self.session.get(url)
        if 200 != r.status_code:
            error_msg = "[Login error] %s %s" %(r.status_code, url)
            return [False, error_msg]
        else:
            print r.text
            print r.headers
            v = re.findall('\'(.*?)\'', r.text)
            if v[0] != '0':
                error_msg = "[Login Faild] %s %s" %(url, v[4])
                return [False, error_msg]
            self.nick = v[5]
            self.jump = v[2]
            return [True, ""]

    def tx_pwd_encode_by_js(self, pwd, salt, verifycode):
        """
        调用V8引擎，直接执行TX的登陆JS中的加密方法，不用自己实现其中算法。
        """
        # pwd, salt, verifycode, undefined
        # with PyV8.JSContext() as ctxt:
        #     with open("qq.login.encrypt.js") as jsfile:
        #         ctxt.eval(jsfile.read())
        #         encrypt_pwd = ctxt.eval("window.$pt.Encryption.getEncryption('%s', '%s', '%s', undefined)"
        #                          %(pwd, salt, verifycode) )
        #         return encrypt_pwd
        #
        # self.jsRT.require("xlogin")
        # self.jsRT.require("c_login_2_src")
        print "OK"
        str = u"Encryption.getEncryption('%s', '%s', '%s', undefined)" % (pwd.encode('utf-8'), salt.encode('utf-8'),
                                                                            verifycode.encode('utf-8'))
        print str
        # encrypt_pwd = self.jsRT.execute(str.encode("utf-8"))
        # print "Encrypt1:"
        # print encrypt_pwd
        # return encrypt_pwd
        with PyV8.JSContext() as ctxt:
            with open("c_login_2.js") as jsfile:
                ctxt.eval(jsfile.read())
                str = u"Encryption.getEncryption('%s', '%s', '%s', undefined)" % (pwd.encode('utf-8'), salt.encode('utf-8'),
                          verifycode.encode('utf-8'))
                print str
                # encrypt_pwd = ctxt.eval(str.encode("utf-8"))
                # print "Encrypt2:"
                # print encrypt_pwd

                encrypt_pwd = ctxt.eval(str.encode("utf-8"))
                # print "Encrypt3:"
                print encrypt_pwd

                return encrypt_pwd

    def get_bugly_session(self):
        # {
        #     "pttype": 2,
        #     "uin": 345106552,
        #     "service": "jump",
        #     "nodirect": 0,
        #     "ptsigx":
        #     "s_url": "https: // cas.bugly.qq.com / cas / loginBack?type = 9",
        #     "ptlang": 2052,
        #     "ptredirect": 100,
        #     "aid": 1000101,
        #     "daid": 276,
        #     "j_later": 0,
        #     "low_login_hour": 0,
        #     "regmaster": 0,
        #     "pt_login_type": -1,
        #     "pt_aid": 603049403,
        #     "pt_aaid": 0,
        #     "pt_light": 0,
        #     "pt_3rd_aid": 0
        # }
        self.session.get()
        pass

    def get_app_list(self):
        print "jump url:"+self.jump
        r = self.session.get(self.jump)
        self.print_cookies("jump")
        r = self.session.get("https://cas.bugly.qq.com/cas/login?service=https%3A%2F%2Fbugly.qq.com%2Fv2%2Fworkbench%2Fapps")
        self.print_cookies("cas/login")
        r = self.session.get("https://cas.bugly.qq.com/cas/loginBack?type=9")
        self.print_cookies("loginback")
        r = self.session.get("https://bugly.qq.com/v2/workbench/apps")
        self.print_cookies("index")

        if 200 != r.status_code:
            error_msg = "[error]"
            print error_msg
            return [False, error_msg]
        else:

            token = self.getToken(r.text)
            print token
            r = self.session.get("https://bugly.qq.com/v2/users/null/appList?userId="+self.uin,headers={"X-token":token})
            print r.text
            result = json.loads(r.text)
            print json.dumps(result, indent=4, sort_keys=True)
            return [True, ""]
        pass

    def getToken(self, body):
        # <meta name="token" content="1490385211" />
        index = body.find('name="token"')
        str = body[index + 13:index + 13 + 20]
        print str
        list = str.split('"')
        print list
        return list[1]

    def print_cookies(self, str):
        print "=========="+str+"=========="
        for c in self.session.cookies:
            print c


uin = "2153413946@qq.com"
pwd = ""
qlogin = QQ_Login(uin, pwd)
#qlogin.get_signature()
#qlogin.check_login()
#qlogin.login()
qlogin.run()
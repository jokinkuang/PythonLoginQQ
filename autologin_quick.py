#!/usr/bin/env python
# -*- coding: utf-8 -*-
__author__ = 'leohuang'
__date__ = '2016/3/2'
__version__ = '0.1-dev'

import urllib
import re
import requests
import random
import json

class QQ_Quick_Login:
    """
    QQ客户端快速登陆:2016.3.2
    算法和实现参考：/ptlogin/ver/10151/js/c_login_1.js
    参考登陆组件：http://ui.ptlogin2.qq.com/cgi-bin/login?hide_title_bar=0&low_login=0&qlogin_auto_login=1&no_verifyimg=1&link_target=blank&appid=636014201&target=self&s_url=http%3A//www.qq.com/qq2012/loginSuccess.htm
    """
    ## default qq info
    appid = 636014201
    action = '2-0-1456213685600'
    urlRaw = "http://ui.ptlogin2.qq.com/cgi-bin/login"
    urlUins = "http://localhost.ptlogin2.qq.com:4300/pt_get_uins"
    urlCheck = 'http://check.ptlogin2.qq.com/check'
    urlSt = "http://localhost.ptlogin2.qq.com:4300/pt_get_st"
    urlQuickLogin = "https://xui.ptlogin2.qq.com/jump"
    urlLogin = 'https://xui.ptlogin2.qq.com/cgi-bin/xlogin?'
    urlSuccess = 'http://www.qq.com/qq2012/loginSuccess.htm'
    # https://xui.ptlogin2.qq.com/cgi-bin/xlogin?

    def __init__(self, uin=None, pwd=None):
        self.uin = uin
        self.pwd = pwd
        self.nick = None
        self.session = requests.Session()
        self.pt_verifysession_v1 = ""
        self.client_type = None

    def run(self):
        '''
        get_signature()
        get_client_uins()
        check_login()
        get_client_pt_get_st()
        quick_login()
        '''

        sig_flag, sig_msg = self.get_signature()
        if sig_flag:
            flag, msg = self.get_client_uins()
            if flag:
                check_flag, check_msg = self.check_login()
                if check_flag:
                    flag, msg = self.get_client_pt_get_st()
                    if flag:
                        flag, msg = self.quick_login()
                        if flag:
                            print "User %s login Ok, nickname: %s" %(self.uin, self.nick)
                            print "Cookie info:"
                            for c in self.session.cookies:
                                print c
                        else:
                            print msg
                    else:
                        print msg
                else:
                    print check_msg
            else:
                print msg
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
        }
        params = urllib.urlencode(params)
        url = "%s?%s" %(self.urlRaw, params)
        r = self.session.get(url)
        if 200 != r.status_code:
            error_msg = "[Get signature error] %s %s" %(r.status_code, url)
            return [False, error_msg]
        else:
            self.login_sig = self.session.cookies['pt_login_sig']
            return [True, ""]

    def get_client_uins(self):
        '''
        get client unis info
        need: token check & referer check
        '''
        tk =  "%s%s" %(random.random(), random.randint(1000, 10000) )
        self.session.cookies['pt_local_token'] = tk
        self.session.headers.update({'Referer':'http://ui.ptlogin2.qq.com/'})
        params = {
            'callback':"ptui_getuins_CB",
            'pt_local_tk': tk,
        }
        params = urllib.urlencode(params)
        url = "%s?%s" %(self.urlUins, params)
        try:
            r = self.session.get(url, timeout=120)
            if 200 != r.status_code:
                error_msg = "[Get client unis error] %s %s" %(r.status_code, url)
                print error_msg
                return [False, error_msg]
            else:
                #print r.text
                v = re.findall('\{.*?\}', r.text)
                # 多个帐号，默认取第一个，用户可以自己设置
                v = v[0]
                v = json.loads(v)
                self.uin = v["uin"]
                self.client_type = v["client_type"]
                self.nick = v["nickname"]
                print self.nick, self.uin
                return [True, ""]

        except Exception, e:
            error_msg = "[Get client unis error] %s %s" %(url, str(e))
            return [False, error_msg]


    def check_login(self):
        '''
        step 2: get verifycode and pt_verifysession_v1.
        TX will check username and the login's environment is safe

        example
        requests: http://check.ptlogin2.qq.com/check?regmaster=&pt_tea=1&pt_vcode=1&uin=1802014971&appid=636014201&js_ver=10151&js_type=1&login_sig=YRQ*Xx0x-1yLCn3W0bmxd-Md2*qgxUCe66sH5DFlDLRJMIXvF7WGP0jyLBjkk8f2&u1=http%3A%2F%2Fwww.qq.com%2Fqq2012%2FloginSuccess.htm&r=0.8094342746365941
        response: ptui_checkVC('0','!FKL','\x00\x00\x00\x00\x6b\x68\x90\xfb','025dcaccfbc7ef17ddaf6f2b5b80a37fbe65611d579f893114a984d23c0438c67c53da5525ff368f0224ac62d0d07a1b360a097eac64f219','0');
        '''
        params = {
            "uin": self.uin,
            "appid": self.appid,
            "pt_tea": 1,
            "pt_vcode": 1,
            "js_ver": 10151,
            "js_type": 1,
            "login_sig": self.login_sig,
            "u1": self.urlSuccess,
        }
        params = urllib.urlencode(params)
        url = "%s?%s" %(self.urlCheck, params)
        r = self.session.get(url)
        if 200 != r.status_code:
            error_msg = "[Get verifycode error] %s %s" %(r.status_code, url)
            return [False, error_msg]
        else:
            #print r.text
            v = re.findall('\'(.*?)\'', r.text)
            self.check_code = v[0]
            if self.check_code != '0':
                error_msg = "[Verifycode not 0] %s %s" %(self.check_code, url)
                return [False, error_msg]
            self.verifycode = v[1]
            self.salt = v[2]
            self.pt_verifysession_v1 = v[3]
            #pprint(v)
            return [True, ""]

    def get_client_pt_get_st(self):
        '''
        get client key
        '''

        params = {
            'clientuin': self.uin,
            'callback': 'ptui_getst_CB',
            'pt_local_tk': self.session.cookies['pt_local_token'],
        }
        params = urllib.urlencode(params)
        url = "%s?%s" %(self.urlSt, params)
        try:
            r = self.session.get(url, timeout=120)
            if 200 != r.status_code:
                error_msg = "[Get client st error] %s %s" %(r.status_code, url)
                print error_msg
                return [False, error_msg]
            else:
                self.clientkey = self.session.cookies["clientkey"]
                #pprint(v)
                return [True, ""]
        except Exception, e:
            error_msg = "[Get client st error] %s %s" %(url, str(e))
            return [False, error_msg]

    def quick_login(self):
        params = {
            "clientuin": self.uin,
            "keyindex": '9',
            "pt_aid": self.appid,
            "u1": self.urlSuccess,
            "pt_local_tk": self.session.cookies["pt_local_token"],
            "pt_3rd_aid": 0,
            "ptopt": 1,
            "style": 20,
        }
        params = urllib.urlencode(params)
        url = "%s?%s" %(self.urlQuickLogin, params)
        #print url
        r = self.session.get(url, timeout=120)
        if 200 != r.status_code:
            error_msg = "[Get client st error] %s %s" %(r.status_code, url)
            print error_msg
            return [False, error_msg]
        else:
            print r.text
            v = re.findall('\'(.*?)\'', r.text)
            if v[0] != '0':
                error_msg = "[Quick Login Faild] %s %s" %(url, v[4])
                return [False, error_msg]
            return [True, ""]


# qlogin = QQ_Quick_Login()
#qlogin.get_signature()
#qlogin.get_client_uins()
#qlogin.check_login()
#qlogin.get_client_pt_get_st()
#qlogin.quick_login()
# qlogin.run()
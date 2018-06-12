#!/usr/bin/env python
# -*- coding: utf-8 -*-
import autologin_account_v8
from autologin_quick import QQ_Quick_Login

__author__ = 'leohuang'
__date__ = '2016/3/2'
__version__ = '0.1-dev'

import urllib
import rsa
import re
import binascii
import hashlib
import base64
import requests
from pprint import pprint
import tea

class QQ_Login:
    """
    QQ用户名密码登陆:2016.3.2
    涉及算法：TX_TEA算法，RSA算法,MD5
    算法和实现参考：/ptlogin/ver/10151/js/c_login_1.js
    参考登陆组件：http://ui.ptlogin2.qq.com/cgi-bin/login?hide_title_bar=0&low_login=0&qlogin_auto_login=1&no_verifyimg=1&link_target=blank&appid=636014201&target=self&s_url=http%3A//www.qq.com/qq2012/loginSuccess.htm
    """
    ## RSA info
    rsaE = "F20CE00BAE5361F8FA3AE9CEFA495362FF7DA1BA628F64A347F0A8C012BF0B254A30CD92ABFFE7A6EE0DC424CB6166F8819EFA5BCCB20EDFB4AD02E412CCF579B1CA711D55B8B0B3AEB60153D5E0693A2A86F3167D7847A0CB8B00004716A9095D9BADC977CBB804DBDCBA6029A9710869A453F27DFDDF83C016D928B3CBF4C7"
    rsaN = int("3", 16)
    rsaPublickey = int(rsaE, 16)
    rsaKey = rsa.PublicKey(rsaPublickey, rsaN)

    ## default qq info
    appid = 636014201
    action = '2-0-1456213685600'
    urlRaw = "http://ui.ptlogin2.qq.com/cgi-bin/login"
    urlCheck = 'http://check.ptlogin2.qq.com/check'
    urlLogin = 'http://ptlogin2.qq.com/login'
    urlSuccess = 'http://www.qq.com/qq2012/loginSuccess.htm'


    def __init__(self, uin, pwd):
        self.uin = uin
        self.pwd = pwd
        self.nick = None
        self.session = requests.Session()
        self.pt_verifysession_v1 = ""

    def run(self):

        sig_flag, sig_msg = self.get_signature()
        if sig_flag:
            check_flag, check_msg = self.check_login()
            if check_flag:
                login_flag, login_msg = self.login()
                if login_flag:
                    print "User %s login Ok, nickname: %s" %(self.uin, self.nick)
                    print "Cookie info:"
                    for c in self.session.cookies:
                        print c
                else:
                    print login_msg
            else:
                print check_msg
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

    def login(self):
        '''
        step 3: login and get cookie.
        TX will check encrypt(password)

        example
        requests: http://ptlogin2.qq.com/login?u=1802014931&verifycode=!OYZ&pt_vcode_v1=0&pt_verifysession_v1=b8be1c5453957e14efb7c0f7d42586b3e88c6299a118236e1281c7761f0a0e0fec45b8aea6671244eee48f89c57d577670506acddca203e0&p=bVhYmmZQRxkIGxzMv0ac7WSDu9JzT8oZQhVRBShYqK54PJgykXnTNTwrPbxNShmCjOMFarrILgwipCdwBpXER2UZ-B2jyLc467Z1*5d8Tc8fW-bNgJUYAkKmWguZEQ1V2WODU4gGXMRlKkC-geveBIJZYLAB1KoU2ncyIZEodboa1ZFoGavK3rrdy*q7zweWD-8NP-fnRhmAsykz2TmKww__&pt_randsalt=0&ptredirect=0&u1=http%3A%2F%2Fwww.qq.com%2Fqq2012%2FloginSuccess.htm&h=1&t=1&g=1&from_ui=1&ptlang=2052&action=3-0-1456900566808&js_ver=10151&js_type=1&login_sig=-v*7eYY3VqnPdd2G8zeHtFWpUwBygrAb540e-Kr*XfieZNJPkh5Aq3EUMvexH4wN&pt_uistyle=20&aid=636014201&        response: ptui_checkVC('0','!FKL','\x00\x00\x00\x00\x6b\x68\x90\xfb','025dcaccfbc7ef17ddaf6f2b5b80a37fbe65611d579f893114a984d23c0438c67c53da5525ff368f0224ac62d0d07a1b360a097eac64f219','0');
        response: ptuiCB('0','0','http://www.qq.com/qq2012/loginSuccess.htm','0','登录成功！', 'xxx');
                set-cookie!!!
        '''

        encrypt_pwd = self.tx_pwd_encode(self.pwd, self.salt, self.verifycode)

        if not self.pt_verifysession_v1:
            self.pt_verifysession_v1 = self.session.cookies['ptvfsession']
        params = {
            'u': self.uin,
            'verifycode': self.verifycode,
            'pt_vcode_v1': 0,
            'pt_verifysession_v1': self.pt_verifysession_v1,
            'p': encrypt_pwd,
            'pt_randsalt': 0,
            'u1': self.urlSuccess,
            'ptredirect': 0,
            'h': 1,
            't': 1,
            'g': 1,
            'from_ui': 1,
            'ptlang': 2052,
            'action': self.action,
            'js_ver': 10270,
            'js_type': 1,
            'aid': self.appid,
            'daid': 5,
            'login_sig': self.login_sig,
        }
        params = urllib.urlencode(params)
        url = "%s?%s" %(self.urlLogin, params)
        r = self.session.get(url)
        if 200 != r.status_code:
            error_msg = "[Login error] %s %s" %(r.status_code, url)
            return [False, error_msg]
        else:
            #print r.text
            v = re.findall('\'(.*?)\'', r.text)
            if v[0] != '0':
                error_msg = "[Login Faild] %s %s" %(url, v[4])
                return [False, error_msg]
            self.nick = v[5]
            return [True, ""]


    def tx_pwd_encode(self, pwd, salt, verifycode):
        """
        js:getEncryption(t, e, i, n)
        t=pwd, e=salt 二进制形式, i=verifycode, n:default undefined
        # """
        salt = salt.replace(r'\x', '')
        e = self.fromhex(salt)
        md5_pwd = o = self.tx_md5(pwd)
        r = hashlib.md5(pwd).digest()
        p = self.tx_md5( r + e )
        a = rsa.encrypt(r, self.rsaKey)
        rsaData = a = binascii.b2a_hex(a)

        # rsa length
        s = self.hexToString( len(a)/2 )
        s = s.zfill(4)

        # verifycode先转换为大写，然后转换为bytes
        verifycodeLen = hex(len(verifycode)).replace(r"0x","").zfill(4)
        l = binascii.b2a_hex( verifycode.upper() )

        # verifycode length
        c = self.hexToString( len(l)/2 )
        c = c.zfill(4)

        # TEA: KEY:p, s+a+ TEA.strToBytes(e) + c +l
        new_pwd = s + a + salt + c + l
        saltpwd = base64.b64encode(
                tea.encrypt( self.fromhex(new_pwd), self.fromhex(p) )
        ).decode().replace('/', '-').replace('+', '*').replace("=", "_")

        data = {}
        data['l'] = l
        data['a'] = a
        data['o'] = o
        data['r'] = r
        data['e'] = e
        data['p'] = p
        data['s'] = s
        data['l'] = l
        data['c'] = c
        #pprint(data)
        return saltpwd

    def hexToString(self, ct):
        return hex(ct).replace("0x", "")

    # md5&upper
    def tx_md5(self, raw_str):
        return hashlib.md5(raw_str).hexdigest().upper()

    def fromhex(self, s):
        return bytes(bytearray.fromhex(s))


uin = "2153413946@qq.com"
pwd = ""
qlogin = autologin_account_v8.QQ_Login(uin, pwd)
#qlogin.get_signature()
#qlogin.check_login()
#qlogin.login()
qlogin.run()
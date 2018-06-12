# -*- coding:utf-8 -*-
# @author jokinkuang

from jsrt import JSR

rt = JSR("www.baidu.com")
rt.execute("alert(window.location.href)")
rt.execute("alert(document.title)")
rt.execute("alert(document.getElementsByTagName('body')[0])")
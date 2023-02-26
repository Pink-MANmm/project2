from cmath import log
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from .models import positionData
import pandas as pd
import json
import numpy as np
import json
import pymongo
import base64
# Create your views here.

myclient = pymongo.MongoClient('mongodb://localhost:27017')
mycollection = myclient["positionData"]['missions']
mycollection1 = myclient["userData"]['accounts']

# 添加任务信息


@csrf_exempt
def add(request):
    if request.method == 'POST':
        arr = json.loads(request.POST['arr'])
        names = []
        for i in mycollection.find():
            names.append(i['name'])
        for info in arr:
            if info['name'] in names:
                pass
            else:
                mycollection.insert_one(info)
    return HttpResponse('添加成功')

# 删除任务信息


@csrf_exempt
def delete(request):
    if request.method == 'POST':
        arr = json.loads(request.POST['arr'])
        names = []
        for info in arr:
            names.append(info['name'])
        for i in mycollection.find():
            if i['name'] in names:
                pass
            else:
                mycollection.delete_one(i)
    return HttpResponse('删除成功')

# 查询任务信息


def get(request):
    contents = []
    for i in mycollection.find():
        info = {"name": i['name'], "longitude": i['longitude'],
                "latitude": i['latitude'], "zoom": i['zoom']}
        contents.append(info)
    data = {'data': contents}
    return JsonResponse(data)

# 验证用户信息


@csrf_exempt
def main(request):
    # 验证是否为ajax请求
    def is_ajax(request):
        return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
    # 验证登录账户

    def check(data):
        username = data['username']
        password = data['password']
        info = ''
        for i in mycollection1.find({'username': username}):
            info = i
        # 账户是否存在
        if info != '':
            # 账户密码是否正确
            if info['password'] == password:
                token=str(base64.b64encode(bytes(username+password,'utf-8')),'utf-8')
                return JsonResponse({'status': '登录成功!','token':token})
            else:
                return JsonResponse({'status': '密码输入错误'})
        else:
            return JsonResponse({'status': '账号不存在,请前往注册'})
    # 获取请求类型（登录或注册）
    status = json.loads(request.body.decode('utf-8')).get('confirm')
    if status != 'login':
        # 注册验证
        uname = str(json.loads(json.loads(request.body.decode('utf-8')).get('userName')))
        pword = str(json.loads(json.loads(request.body.decode('utf-8')).get('passWord')))
        info = ''
        for i in mycollection1.find({'username': uname}):
            info = i
        # 验证用户是否存在
        if info != '':  # 存在则跳转登录界面
            return JsonResponse({'status': '账号已注册，请返回登录'})
        else:  # 不存在则生成用户信息data
            if len(uname) <6:
                return JsonResponse({'status': '用户名不得低于6位!'})
            elif len(pword)<6:
                return JsonResponse({'status': '密码不得低于6位!'})
            else:
                mycollection1.insert_one({"username": uname, "password": pword})
                token=str(base64.b64encode(bytes(uname+pword,'utf-8')),'utf-8')
                return JsonResponse({'status': '注册成功!','token':token})
            
    else:
        # 登录验证
        uname = str(json.loads(json.loads(request.body.decode('utf-8')).get('userName')))
        pword = str(json.loads(json.loads(request.body.decode('utf-8')).get('passWord')))
        info = ''
        return check({'username': uname, 'password': pword})

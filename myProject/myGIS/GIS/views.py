from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
import json
import pymongo

import hashlib
import time
# Create your views here.

myclient = pymongo.MongoClient('mongodb://localhost:27017')
mycollection = myclient["positionData"]['missions']
mycollection1 = myclient["userData"]['accounts']

# 添加任务信息


@csrf_exempt
def add(request):
    if request.method == 'POST':
        arr = json.loads(request.body)['arr']
        names = []
        for i in mycollection.find():
            names.append(i['name'])
        if arr['name'] in names:
            pass
        else:
            mycollection.insert_one(arr)
            return HttpResponse('添加成功')
    return HttpResponse('添加失败')

# 删除任务信息


@csrf_exempt
def delete(request):
    if request.method == 'POST':
        name = json.loads(request.body)['arr']
        for i in mycollection.find():
            if i['name'] !=name:
                pass
            else:
                mycollection.delete_one(i)
    return HttpResponse('删除成功')

# 获取任务信息


def get(request):
    contents = []
    for i in mycollection.find():
        info = {"name": i['name'], "longitude": i['longitude'],
                "latitude": i['latitude'], "zoom": i['zoom']}
        contents.append(info)
    data = {'data': contents}
    return JsonResponse(data)

# 渲染登录页面


def login(request):
    return render(request, 'login.html', {})

# 渲染注册页面


def register(request):
    return render(request, 'register.html', {})
    
# 验证用户信息


@csrf_exempt
def main(request):
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
                # 计算token
                return JsonResponse({'status': '登录成功!','token':token})
            else:
                return JsonResponse({'status': '密码输入错误'})
        else:
            return JsonResponse({'status': '账号不存在,请前往注册'})
    if request.method == 'POST':  
        #若为get请求，则为
        #request.GET.get('content2')
        status = json.loads(request.body)['confirm']
        username = json.loads(request.body)['userName']
        password = json.loads(request.body)['passWord']
        # 计算token
        md5 = hashlib.md5()
        md5.update((username + password + "1258" + str(time.time())).encode())
        token = md5.hexdigest()
        if status != 'login':
            info = ''
            for i in mycollection1.find({'username': username}):
                info = i
            # 验证用户是否存在
            if info != '':  # 存在则跳转登录界面
                return JsonResponse({'status': '账号已注册，请返回登录'})
            else:  # 不存在则生成用户信息data
                data = {'username': username,
                        'password': password}
                if len(username) <6:
                    return JsonResponse({'status':'用户名不得低于6位!'})
                elif len(password)<6:
                    return JsonResponse({'status':'密码不得低于6位!'})
                elif len(username) >= 6 and len(password) >= 6:
                    mycollection1.insert_one(data)
                    return JsonResponse({'status':'注册成功!','token':token})
        else:
            # 登录验证
            info = ''
            for i in mycollection1.find({'username': username}):
                info = i
            # 验证用户是否存在
            if info == '':
                data = {'username': username, 'password': password}
                return check(data)
            else:
                return check({'username': username, 'password': password})
    else:  # 请求类型非'POST'（例如直接修改网页地址为'/main'）
        return render(request, 'login.html', {})

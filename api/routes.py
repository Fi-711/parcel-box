from flask import request, jsonify
from api import app, db, guard, socketio
from flask_praetorian import auth_required, current_user, roles_accepted
from datetime import datetime, timedelta
from api.models import User
import simplejson as json
import re
from flask_socketio import emit, send
import os
import time
"""
Use to make admin - testing only: Run the following from root i.e. same place as wsgi.py:
from api import db, guard
from api.models import User
db.session.add(User(first_name="CM2306", last_name="Group 18", email="test@test.com", password=guard.hash_password("raspberry"), roles="admin", is_active=True))
db.session.commit()
"""

# telemetry data
temperature = None
humidity = None
brightness = None

# facial recognition
facial_recognition = False
# auto lock
auto_lock = False
# anti-theft
anti_theft = False

# request to unlock
unlock_req = False

# lock status
box_locked = True

@app.errorhandler(404)
def not_found(e):
    """
    Send user to home page 404 error occurs

    """

    return app.send_static_file('index.html')


@app.route('/', methods=["GET"])
def index():
    """
    Default route - sends user to homepage

    """
    return app.send_static_file('index.html')


@app.route('/api/login', methods=['POST'])
def login():
    """
    Validate user login by checking credentials with db and then issue a JW Token.
    """
    req = request.get_json(force=True)
    email = req.get('email', None)
    password = req.get('password', None)
    query = db.session.query(User).filter_by(email=email).first()
    name = query.first_name if query is not None else ''
    is_admin = query.roles == "admin"

    user = guard.authenticate(email, password)

    ret = {'user': email, 'accessToken': guard.encode_jwt_token(user), 'name': name.title(), 'isAdmin': is_admin}

    return ret


@app.route('/api/refresh', methods=['POST'])
def refresh():
    """
    Refresh access token - current tokens last 60 minutes with lifespan of 30 days. Called every time user visits the
    home page.

    """
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200


@app.route('/api/tokenRequest', methods=['GET'])
def get_token():
    """
    Validate user credentials with db and then issue a JW Token.
    """
    user = guard.authenticate("test@test.com", "raspberry")

    ret = {'accessToken': guard.encode_jwt_token(user)}

    return ret


"""

Authorized routes

"""
@app.route('/api/telemetry', methods=['GET'])
@auth_required
def get_telemetry():
    global temperature, humidity, brightness
    return {'temperature': temperature, 'humidity': humidity, 'brightness': brightness} if temperature else {}


@socketio.on('api')
@app.route('/api/auto', methods=['POST'])
@auth_required
def set_auto():
    global facial_recognition, auto_lock, anti_theft
    req = request.get_json(force=True)['data']
    # send facial recognition response
    print(req)

    try:
        facial_recognition = req['facialRecognition']
        auto_lock = req['autoLock']
        anti_theft = req['antiTheft']    
        # notify listeners
        # handle_switches("upadate")
        emit('switches', {'data': {'antiTheft': anti_theft, 'facialRecognition': facial_recognition, 'autoLock': auto_lock}}, broadcast=True)

    except Exception as e:
        print(e)
    
    return jsonify({"autoLock": auto_lock, "facialRecognition": facial_recognition, 'antiTheft': anti_theft})


@app.route('/api/unlock', methods=['POST'])
@auth_required
def unlock_boxr():
    global box_locked
    try:
        req = request.get_json(force=True)['data']
        # is the box lockeda
        print(req)
        if req == True:
            box_locked = True
        else:
            box_locked = False
    except Exception as e:
        print(e)
    
    return jsonify({"Response": box_locked})


@app.route('/api/lock', methods=['GET'])
# @auth_required
def process_auto_lock():
    global unlock_req
    req = request.get_json(force=True)
    if (req['data'] and req['data'] == "unlock"):
        # set unlock_request to true
        unlock_req = True
        return jsonify({"data": "Success"}) if facial_recognition else jsonify({"data": "Auto Lock Disabled... Processing Request"})
    return jsonify({"data": "Error cannot be processed"})


@app.route('/api/setlock', methods=['POST'])
@auth_required
def set_lock():
    global box_locked
    try:
        req = request.get_json(force=True)['data']
        # is the box locked
        print(req)
        box_locked = req['lock']
    except Exception as e:
        print(e)
    
    return jsonify({"data": box_locked})


"""

Web Sockets

"""
# default unamed route
@socketio.on('message')
def test_message(message):
    send({'data': message})
    print(message)
    

# button pressed/ unlock request
@socketio.on('lock')
def unlock_request(message):
    global unlock_req
    # if there is a request, process it by informing listeners
    if unlock_req:
        emit('unlock_request', {'data': unlock_req}, broadcast=True)
        print("Processing unlock request.")
        # sleep for 2s
        time.sleep(2)
        # reset request
        unlock_req = False
        return "Success"


# unlock box
@socketio.on('unlock')
def unlock_box(message):
    global box_locked
    print(box_locked)
    if not box_locked:        
        # reset box locked
        emit('unlock', {'data': "unlock"}, broadcast=True)
        box_locked = True
        print(message)
    else:        
        # reset box locked
        emit('unlock', {'data': "lock"}, broadcast=True)
        box_locked = False
        print(message)    

    return box_locked

# lock status - emit box current status
@socketio.on('lock_status')
def lock_status(message):
    # global box_locked
    emit('lock_status', {'data': box_locked}, broadcast=True)
    print("lock status")
    return box_locked


@socketio.on('connect')
def test_connect():
    emit('my response', {'data': 'Connected'})
    print("Connected")


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')


# telemetry data
@socketio.on("telemetry")
def handleMessage(msg):
    global temperature, humidity, brightness
    
    temperature = float(msg['temperature']) if msg['temperature'] else 21
    humidity = int(msg['humidity']) if msg['humidity'] else 60
    brightness = float(msg['brightness']) if msg['brightness'] else 30


# handle switches data
@socketio.on("switches")
def handle_switches(msg):
    emit('switches', {'data': {'antiTheft': anti_theft, 'facialRecognition': facial_recognition, 'autoLock': auto_lock}}, broadcast=True)


# handles all namespaces without an explicit error handler
@socketio.on_error_default  
def default_error_handler(e):
    print('An error occured:')
    print(e)


"""
Admin Routes

"""

from os import getenv
from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_praetorian import Praetorian
from flask_cors import CORS
import eventlet

# app configurations
app = Flask(__name__, static_folder="../build", static_url_path='/')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = getenv('SQLALCHEMY_DATABASE_URI')

app.config['JWT_ACCESS_LIFESPAN'] = {'minutes': 60}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 7}

# websocket
socketio = SocketIO(app, cors_allowed_origins="*")

# Database/ Schemas
db = SQLAlchemy(app)

# Security/ Login
guard = Praetorian()
cors = CORS()


from api.models import User
from api import routes

# Initialize the flask-praetorian instance for the app
guard.init_app(app, User)
# Initializes CORS
cors.init_app(app)

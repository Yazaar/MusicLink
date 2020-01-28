from flask import Flask, request
from flask_socketio import SocketIO

app = Flask(__name__)
sio = SocketIO(app)

@app.route('/')
def root():
    return 'welcome'

@sio.on('message')
def on_message(data=''):
    sio.emit('message', 'hello', room=request.sio)
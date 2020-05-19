import json
from flask import Flask, request, render_template, redirect
from flask_socketio import SocketIO

app = Flask(__name__)
sio = SocketIO(app)

@app.route('/', methods=['GET'])
def root():
    return render_template('index.html')

@sio.on('ping')
def on_message(data=''):
    sio.emit('pong', 'pong', room=request.sid)
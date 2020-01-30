from flask import Flask, request
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@app.route("/")
def index():
    return 'welcome'

@socketio.on('message')
def on_message(data):
    socketio.emit('ok...', room=request.sid)
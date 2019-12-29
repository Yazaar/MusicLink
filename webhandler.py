from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def root():
    return 'welcome!'

@app.route('/<path:path>')
def root(path):
    return 'welcome! (' + path + ')'

@socketio.on('join')
def socketio_join(data):
    return

@socketio.on('message')
def socketio_message(msg=''):
    socketio.emit('message', msg.upper() + '!!!!!')
    return
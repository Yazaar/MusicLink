from flask import Flask, request, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
sio = SocketIO(app)

@app.route('/')
def root():
    return render_template('index.html')

@sio.on('message')
def on_message(data=''):
    sio.emit('message', 'hello', room=request.sid)
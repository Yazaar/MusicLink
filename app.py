from flask import Flask, request, render_template, redirect
from flask_socketio import SocketIO, join_room
import os

app = Flask(__name__)

app.secret_key = os.environ.get('flaskAppSecret')

sio = SocketIO(app, cors_allowed_origins='*')

@app.route('/', methods=['GET'])
def app_MusicLink():
    return render_template('MusicLink.html')

@app.route('/static/js/socket.io.js', methods=['GET'])
def app_getSIO():
    return redirect('https://cdn.socket.io/4.7.2/socket.io.min.js', 302)

@app.route('/overlay/<roomId>', methods=['GET'])
def app_MusicLinkOverlay(roomId):
    return render_template('MusicLinkOverlay.html', roomId=roomId)

@sio.on('bind_to_room')
def sio_bind_to_room(data=''):
    join_room(data)
    sio.emit('message', f'joined the room {data}', room=request.sid)

@sio.on('overlayUpdate')
def sio_overlayUpdate(data=''):
    if type(data) != dict or not 'roomId' in data:
        return
    sio.emit('overlayUpdate', data, room=data['roomId'])

sio.run(app, port=8080)

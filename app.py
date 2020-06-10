from flask import Flask, request, render_template
from flask_socketio import SocketIO, join_room, rooms
import os

app = Flask(__name__)

app.secret_key = os.environ.get('flaskAppSecret')

sio = SocketIO(app)

@app.route('/MusicLink', methods=['GET'])
def app_root():
    return render_template('MusicLink.html')

@app.route('/MusicLink/overlay/<roomId>', methods=['GET'])
def app_MusicLink(roomId):
    return render_template('MusicLinkOverlay.html', roomId=roomId)

@sio.on('connect')
def sio_connect():
    print('user connected!')
    sio.emit('message', 'welcome to the socketIO connection', room=request.sid)

@sio.on('bind_to_room')
def sio_bind_to_room(data=''):
    join_room(data)
    sio.emit('message', f'joined the room {data}', room=request.sid)

@sio.on('overlayUpdate')
def sio_overlayUpdate(data=''):
    if type(data) != dict or not 'roomId' in data:
        return
    sio.emit('overlayUpdate', data, room=data['roomId'])

#sio.run(app, port=8080)
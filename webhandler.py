import json
from flask import Flask, request, render_template, redirect
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
sio = SocketIO(app)

statusMessage = 'unset'

@app.route('/', methods=['GET'])
def root():
    return render_template('index.html', statusMessage=statusMessage)

@app.route('/setStatus', methods=['POST'])
def setStatus():
    global statusMessage
    status = request.form.get('status')
    if status != None:
        statusMessage = status

    return redirect('/', code=301)

@sio.on('message')
def on_message(data=''):
    sio.emit('message', 'hello', room=request.sid)
'''
CONFIG FILE FOR webhandler.py AND gunicorn

launch command:
gunicorn webhandler:app -c webconfig.py -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1
'''

bind = '0.0.0.0:8000'
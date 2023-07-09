# # Load environment variables first, so app can be configured correctly
# from dotenv import load_dotenv
# load_dotenv()

# from api import app as application


# if __name__ == "__main__":
#     application.run(host='0.0.0.0', debug=False)
import os, eventlet

# Load environment variables first, so app can be configured correctly a
from dotenv import load_dotenv
load_dotenv()

from api import app, socketio


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', debug=False, port=os.environ.get('PORT', 1880), threaded=True)
import os
import eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_socketio import SocketIO
from flask_login import LoginManager
from pymongo import MongoClient
from config import Config
from models import User

# Initialize extensions
socketio = SocketIO()
login_manager = LoginManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # MongoDB connection
    client = MongoClient(app.config['MONGO_URI'])
    app.db = client.get_default_database()

    # Create indexes
    app.db.users.create_index('email', unique=True)
    app.db.reports.create_index([('location', '2dsphere')])
    app.db.reports.create_index('created_at')
    app.db.reports.create_index('neighborhood')

    # Flask-Login setup
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'info'

    @login_manager.user_loader
    def load_user(user_id):
        return User.find_by_id(app.db, user_id)

    # Register blueprints
    from routes.auth import auth_bp
    from routes.user import user_bp
    from routes.admin import admin_bp
    from routes.api import api_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(api_bp, url_prefix='/api')

    # Initialize SocketIO
    socketio.init_app(app, cors_allowed_origins="*")
    app.socketio = socketio  # Store socketio in app for access from routes

    # Register SocketIO events
    from routes.api import register_socketio_events
    register_socketio_events(socketio)

    return app


if __name__ == '__main__':
    app = create_app()
    print("=" * 50)
    print("  Neighborhood Watch & Safety App")
    print("  Running at http://localhost:5000")
    print("=" * 50)
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)

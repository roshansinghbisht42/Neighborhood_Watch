from datetime import datetime, timezone
from bson import ObjectId
from flask_login import UserMixin


class User(UserMixin):
    """User model wrapping MongoDB document."""

    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.name = user_data['name']
        self.email = user_data['email']
        self.password = user_data['password']
        self.role = user_data.get('role', 'user')
        self.neighborhood = user_data.get('neighborhood', '')
        self.created_at = user_data.get('created_at', datetime.now(timezone.utc))

    def is_admin(self):
        return self.role == 'admin'

    @staticmethod
    def create_user(db, name, email, password_hash, neighborhood, role='user'):
        user_doc = {
            'name': name,
            'email': email,
            'password': password_hash,
            'role': role,
            'neighborhood': neighborhood,
            'created_at': datetime.now(timezone.utc)
        }
        result = db.users.insert_one(user_doc)
        user_doc['_id'] = result.inserted_id
        return User(user_doc)

    @staticmethod
    def find_by_email(db, email):
        user_data = db.users.find_one({'email': email})
        return User(user_data) if user_data else None

    @staticmethod
    def find_by_id(db, user_id):
        user_data = db.users.find_one({'_id': ObjectId(user_id)})
        return User(user_data) if user_data else None


class Report:
    """Incident report model."""

    CATEGORIES = [
        'theft', 'fire', 'harassment', 'vandalism',
        'suspicious_activity', 'accident', 'other'
    ]
    STATUSES = ['pending', 'in_progress', 'resolved']
    PRIORITIES = ['low', 'medium', 'high', 'critical']

    @staticmethod
    def create_report(db, user_id, category, description, latitude, longitude,
                      neighborhood, anonymous=False, photo=None):
        report_doc = {
            'user_id': ObjectId(user_id),
            'category': category,
            'description': description,
            'location': {
                'type': 'Point',
                'coordinates': [float(longitude), float(latitude)]
            },
            'latitude': float(latitude),
            'longitude': float(longitude),
            'neighborhood': neighborhood,
            'anonymous': anonymous,
            'photo': photo,
            'status': 'pending',
            'priority': 'medium',
            'assigned_to': None,
            'admin_notes': '',
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc)
        }
        result = db.reports.insert_one(report_doc)
        report_doc['_id'] = result.inserted_id
        return report_doc

    @staticmethod
    def get_all(db, filters=None, sort_by='created_at', order=-1):
        query = filters or {}
        return list(db.reports.find(query).sort(sort_by, order))

    @staticmethod
    def get_by_id(db, report_id):
        return db.reports.find_one({'_id': ObjectId(report_id)})

    @staticmethod
    def get_by_user(db, user_id):
        return list(db.reports.find({'user_id': ObjectId(user_id)}).sort('created_at', -1))

    @staticmethod
    def update_status(db, report_id, status, admin_notes='', assigned_to=None):
        update = {
            '$set': {
                'status': status,
                'updated_at': datetime.now(timezone.utc)
            }
        }
        if admin_notes:
            update['$set']['admin_notes'] = admin_notes
        if assigned_to is not None:
            update['$set']['assigned_to'] = assigned_to
        db.reports.update_one({'_id': ObjectId(report_id)}, update)

    @staticmethod
    def update_priority(db, report_id, priority):
        db.reports.update_one(
            {'_id': ObjectId(report_id)},
            {'$set': {'priority': priority, 'updated_at': datetime.now(timezone.utc)}}
        )

    @staticmethod
    def get_stats(db):
        pipeline = [
            {'$group': {
                '_id': '$status',
                'count': {'$sum': 1}
            }}
        ]
        status_stats = {item['_id']: item['count'] for item in db.reports.aggregate(pipeline)}

        category_pipeline = [
            {'$group': {
                '_id': '$category',
                'count': {'$sum': 1}
            }}
        ]
        category_stats = {item['_id']: item['count'] for item in db.reports.aggregate(category_pipeline)}

        total = db.reports.count_documents({})
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        today_count = db.reports.count_documents({'created_at': {'$gte': today_start}})

        return {
            'total': total,
            'today': today_count,
            'pending': status_stats.get('pending', 0),
            'in_progress': status_stats.get('in_progress', 0),
            'resolved': status_stats.get('resolved', 0),
            'by_category': category_stats
        }

    @staticmethod
    def get_recent(db, limit=10):
        return list(db.reports.find().sort('created_at', -1).limit(limit))

    @staticmethod
    def get_for_map(db, neighborhood=None):
        query = {}
        if neighborhood:
            query['neighborhood'] = neighborhood
        return list(db.reports.find(query, {
            'latitude': 1, 'longitude': 1, 'category': 1,
            'description': 1, 'status': 1, 'created_at': 1,
            'anonymous': 1, 'priority': 1
        }))

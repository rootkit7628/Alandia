from app import app
from flask_mysqldb import MySQL

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'rootKit7629'
app.config['MYSQL_DATABASE_DB'] = 'Alandia'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)
from flask import jsonify
from flask import flash, request
from app import app
from flask_mysqldb import MySQL
import MySQLdb.cursors


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'rootKit7629'
app.config['MYSQL_DB'] = 'Alandia'


mysql = MySQL(app)

@app.route('/list_film')
def get_list_parc():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    print("connected")
    cursor.execute("SELECT id_parc,nom_parc, province.nom_province,description_parc as description from parc join province on parc.id_province=province.id_province where id_parc <12 ")

    empRows = cursor.fetchall()
    respone = jsonify(empRows)

    return respone


if __name__ == "__main__":
    app.run()

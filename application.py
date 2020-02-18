from flask import Flask, render_template
from os import environ

app = Flask(__name__)
app.config['GMAPS_API_KEY'] = environ.get('GMAPS_API_KEY')

@app.route('/')
def index():
   return render_template("index.html", gmapsKey=app.config['GMAPS_API_KEY'])
   # return app.config['GMAPS_API_KEY']
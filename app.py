from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/blog/')
@app.route('/home/')
@app.route('/')
def index():
    content_list = os.listdir("content")

    return render_template('index.html', content_list=content_list)

@app.route('/blog/<string:slug>')
def blog(slug):
    post = "yay"
    with open('content/' + slug, 'r') as file:
        post = file.read()

    return render_template('blog.html', post=post)

if __name__ == '__main__':
    app.run(debug=True)


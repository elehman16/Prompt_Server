import flask
import json

import annotator
import article
import config
import reader
import writer
import numpy as np

application = flask.Flask(__name__)

anne = annotator.Annotator(reader.get_reader(config.reader)(**config.reader_params),
                           writer.get_writer(config.writer)(**config.writer_params))

valid_users = np.loadtxt('usernames.txt', delimiter = ',', dtype = 'str')

"""
Display the main page.
"""
@application.route('/', methods=['GET'])
def index():
    return flask.render_template('index.html')

"""
Start the program.
"""
@application.route('/start/', methods=['GET', 'POST'])
def start():
    userid = flask.request.form['userid']
    if not(userid in valid_users):
        return flask.render_template('index_invalid_user.html')
        
    id_ = anne.get_next_file(userid)
    if not id_:
        return flask.redirect(flask.url_for('finish'))
    else:
        return flask.redirect(flask.url_for('annotate_full', 
                                            userid = userid, 
                                            id_ = id_))
                
"""
Start the program, but show the error to the user first.
"""
@application.route('/invalid_user/', methods=['GET', 'POST'])
def invalid_user():
    userid = flask.request.form['userid']
    if not(userid in valid_users):
        return flask.render_template('index_invalid_user.html', should_show = "true")
    
    id_ = anne.get_next_file(userid)
    if not id_:
        return flask.redirect(flask.url_for('finish'))
    else:
        return flask.redirect(flask.url_for('annotate_full', 
                                            userid = userid, 
                                            id_ = id_))

"""
Grabs a specified article and displays the full text.
"""                             
@application.route('/annotate_full/<userid>/<id_>/', methods=['GET'])
def annotate_full(userid, id_ = None):
    try:
        art = anne.get_next_article(userid, id_)
    except:
        user_progress = np.genfromtxt('.//data//user_progress.csv', delimiter = ",", dtype = str)
        user_progress = user_progress.reshape((int(user_progress.size / 2), 2))              
        i = 0
        for row in user_progress:
            if (row[0] == userid):
                user_progress[i][1] = str(int(user_progress[i][1]) + 1)
                np.savetxt('.//data//user_progress.csv', user_progress, delimiter = ",", fmt = "%s")
                break
            i += 1
           
        id_ = anne.get_next_file(userid)
        return annotate_full(userid, id_)
    
    if not art:
        return flask.redirect(flask.url_for('finish'))
    else:
        return flask.render_template('full_article.html',
                                     userid = userid,
                                     id = art.id_,
                                     pmc = art.get_extra()['PMC'],
                                     rowid = id_,
                                     tabs = art.text,
                                     options = config.options_full)
                                 

"""
Submits the article id with all annotations.
"""
@application.route('/submit/', methods=['POST'])
def submit(): 
    userid = flask.request.form['userid']
    anne.submit_annotation(flask.request.form)
    
    # otherwise go to the next abstract
    id_ = anne.get_next_file(userid)
    if not id_:
        return flask.redirect(flask.url_for('finish'))
    else:
        return flask.redirect(flask.url_for('annotate_full', 
                                            userid=userid,
                                            id_ = id_))

"""
Only go to this if there are no more articles to be annotated.
"""
@application.route('/finish/', methods=['GET'])
def finish():
    return flask.render_template('finish.html')

"""
Call the get results funciton.
"""
@application.route('/results/', methods=['GET'])
def results():
    return anne.get_results()

"""
Run the application.
"""
if __name__ == '__main__':
    #application.run()
    application.run(host = '0.0.0.0', port = 8082) 

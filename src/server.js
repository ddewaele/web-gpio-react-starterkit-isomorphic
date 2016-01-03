/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel-core/polyfill';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from './routes';
import Html from './components/Html';
import assets from './assets.json';

import fs from 'fs';


const server = global.server = express();
const port = process.env.PORT || 5000;
server.set('port', port);

const JSON_DIR = path.join(__dirname, './content/json');

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/content', require('./api/content'));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

server.get('/boards', function(req, res) {
    var file = fs.readFileSync(path.join(JSON_DIR,"/boards/boards.json"), "UTF-8");
      res.send(JSON.parse(file));
});

server.get("/boards/:boardName", function(req, res) {
      var boardName = req.params.boardName;
      var file = fs.readFileSync(path.join(JSON_DIR,"/boards/" + boardName + ".json"), "UTF-8");
    res.send(JSON.parse(file));
});

// Main entry point when an HTTP get executed (launching a new browser window, loading page from bookmark)
server.get('*', async (req, res, next) => {
  try {
    console.log(" +++ server.js - processing * : " + req.path);
    let statusCode = 200;
    const data = { title: '', description: '', css: '', body: '', entry: assets.app.js };
    const css = [];
    const context = {
      insertCss: styles => css.push(styles._getCss()),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404,
    };

    await Router.dispatch({ path: req.path, context }, (state, component) => {
      console.log(" +++ server.js - router returned component : " + JSON.stringify(component));
      var body = ReactDOM.renderToString(component);
      console.log(" +++ server.js - Rendered body = " + body);
      data.body = body;
      data.css = css.join('');
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});

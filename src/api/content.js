/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import fs from 'fs';
import { join } from 'path';
import { Router } from 'express';
import Promise from 'bluebird';
import jade from 'jade';
import fm from 'front-matter';

// A folder with Jade/Markdown/HTML content pages
const CONTENT_DIR = join(__dirname, './content');


// Extract 'front matter' metadata and generate HTML
const parseJade = (path, jadeContent) => {
  const fmContent = fm(jadeContent);
  const htmlContent = jade.render(fmContent.body);
  return Object.assign({ path, content: htmlContent }, fmContent.attributes);
};

const readFile = Promise.promisify(fs.readFile);
const fileExists = filename => new Promise(resolve => {
  fs.exists(filename, resolve);
});

const router = new Router();





router.get('/', async (req, res, next) => {
  try {
    const path = req.query.path;

    console.log(" +++ content.js - " + path);

    if (!path || path === 'undefined') {
      res.status(400).send({ error: `The 'path' query parameter cannot be empty.` });
      return;
    }

    let fileName = join(CONTENT_DIR, (path === '/' ? '/index' : path) + '.jade');

    console.log(" +++ content.js - fileName = " + fileName);
    
    if (!(await fileExists(fileName))) {
      fileName = join(CONTENT_DIR, path + '/index.jade');
    }

    if (!(await fileExists(fileName))) {
      res.status(404).send({ error: `The page '${path}' is not found.` });
    } else {
      const source = await readFile(fileName, { encoding: 'utf8' });
      const content = parseJade(path, source);
      console.log(" +++ content.js parsed content = " + JSON.stringify(content));
      res.status(200).send(content);
    }
  } catch (err) {
    next(err);
  }
});



export default router;



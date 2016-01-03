/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import Router from 'react-routing/src/Router';
import http from './core/HttpClient';
import App from './components/App';
import ContentPage from './components/ContentPage';
import ContactPage from './components/ContactPage';
import BoardSelection from './components/BoardSelection';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';


// This react-routing component is called after the server has processed a request.
// It takes care of rendering our App 
const router = new Router(on => {
  on('*', async (state, next) => {
    console.log(" +++ routes.js (react-routing) -> matching * with state = " + JSON.stringify(state) + " and next = " + next);
    // here we fetch a component that will come from the any of the other routes.
    // if the index/contact/about/privacy page was loaded for example, a REST call to /api/content?path=index
    // will be called (the jade template), and its content will be wrapped inside the contentpage.
    const component = await next();
    console.log(" +++ routes.js (react-routing) ->  found component " + JSON.stringify(component));
    return component && <App context={state.context}>{component}</App>;
  });

  on('/contact2', async () => <ContactPage />);

  on('/login', async () => <LoginPage />);

  on('/register', async () => <RegisterPage />);

  //on('/boardSelection', async () => <BoardSelection />);

  // on('/boardSelection', async() {
  //   return(<BoardSelection />);
  // });


var _this = this;

on('/boardSelection', function callee() {
  return regeneratorRuntime.async(function callee(context) {
    while (1) switch (context.prev = context$1$0.next) {
      case 0:
        return context.abrupt('return', React.createElement(BoardSelection, null));

      case 1:
      case 'end':
        return context.stop();
    }
  }, null, _this);
});





  on('*', async (state) => {
    // when hitting /index for example this is called
    console.log(" +++ routes.js (react-routing) -> matching * with state " + JSON.stringify(state));
    const content = await http.get(`/api/content?path=${state.path}`);
    return content && <ContentPage {...content} />;
  });

  on('error', (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );
});

export default router;

import React, {Component} from 'react';
import './App.css';
import '../HomePage/HomePage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import MainPage from '../MainPage/MainPage';
import NotFound from '../NotFound/NotFound';
import UserPage from '../UserPage/UserPage';
import CarPage from '../CarPage/CarPage';
import CompanyPage from '../CompanyPage/CompanyPage';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <ReactNotification />
          <div className='top_bar'>
            Car service
          </div>
          <div className='page'>
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route exact path='/home/:id' component={MainPage} />
              <Route exact path='/home/:id/user' component={UserPage} />
              <Route exact path='/home/:id/cars' component={CarPage} />
              <Route exact path='/home/:id/company' component={CompanyPage} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App;

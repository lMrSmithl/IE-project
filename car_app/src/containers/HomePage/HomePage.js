import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom';
import './HomePage.css';

import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

class HomePage extends Component {

  constructor(props){
    super(props);
    this.state ={
      id: '',
      login: '',
      password: '',
      redirect: false
    }
    this.login=this.login.bind(this)
    this.register=this.register.bind(this)
    this.onChange=this.onChange.bind(this)
  }

  login(){
    if(this.state.login && this.state.password){
      PostData('user/login', this.state).then ((result) => {
        let responseJSON = result;
        this.setState({id: responseJSON.id})
        if(responseJSON.login){
          sessionStorage.setItem('userData', responseJSON.name);
          this.setState({redirect: true});
        }
      },
      _ => {   
      store.addNotification({
        title: "Błąd logowania",
        message: "Zły login lub hasło",
        type: "danger",
        container: "top-right",
        insert: "top",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 2000
        },
        wifth: 600
      })
    })
    }
    else {
      store.addNotification({
        title: "Uzupełnij dane do logowania",
        message: "Podaj login i hasło",
        type: "warning",
        container: "top-right",
        insert: "top",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 2000
        },
        wifth: 600
      })
    }
  }

  register(){
    if(this.state.login && this.state.password){
      PostData('user', this.state).then ((result) => {
        let responseJSON = result;
        this.setState({id: responseJSON.id})
        if(responseJSON.login){
          sessionStorage.setItem('userData', responseJSON.name);
          this.setState({redirect: true});
        }
      },
      _ => {   
      store.addNotification({
        title: "Błąd rejestracji",
        message: "Błędne dane lub użytkownik już istnieje",
        type: "danger",
        container: "top-right",
        insert: "top",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 2000
        },
        wifth: 600
      })
    })
    }
    else {
      store.addNotification({
        title: "Uzupełnij dane do rejestracji",
        message: "Podaj login i hasło",
        type: "warning",
        container: "top-right",
        insert: "top",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 2000
        },
        wifth: 600
      })
    }
  }

  onChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  render() {

    if(this.state.redirect){
      return (<Redirect to={'/home/'+this.state.id} />)
    }

    return (
      <div className='home_page'>
          <p className='title'>Witaj w bazie komisów samochodowych</p>
          <div className='login'>
            <h2>Zaloguj się</h2>
            <div className='input_div'>
              <label>Login</label>
              <input type='text' name='login' placeholder='login' onChange={this.onChange} />
            </div>
            <div className='input_div'>
              <label>Hasło</label>
              <input type='password' name='password' placeholder='hasło' onChange={this.onChange} />
            </div>
            <input type='submit' value='Zaloguj się' className='button' onClick={this.login} /> 
          </div>
          <div className='rejestracja'>
            <h2>Zarejestruj się</h2>
            <div className='input_div'>
              <label>Login</label>
              <input type='text' name='login' placeholder='login' onChange={this.onChange} />
            </div>
            <div className='input_div'>
              <label>Hasło</label>
              <input type='password' name='password' placeholder='hasło' onChange={this.onChange} />
            </div>
            <input type='submit' value='Zarejestruj się' className='button' onClick={this.register} /> 
          </div>
      </div>
    )
  }
}

export default HomePage;
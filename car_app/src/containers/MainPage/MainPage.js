import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './MainPage.css';

class MainPage extends Component {

  constructor(props){
    super(props);
    this.state ={
      redirect: false,
      redirectToUser: false,
      redirectToShopList: false,
      redirectToCars: false
    }
    this.logout = this.logout.bind(this);
    this.userDetails = this.userDetails.bind(this);
    this.cars = this.cars.bind(this);
    this.shops = this.shops.bind(this);
  }

  componentWillMount(){
    if(sessionStorage.getItem("userData")){
      console.log("OK");
    }
    else{
      this.setState({redirect: true});
    }
  }

  logout(){
    sessionStorage.setItem("userData", '');
    sessionStorage.clear();
    this.setState({redirect: true});
  }

  userDetails(){
    this.setState({redirectToUser: true});
  }

  cars(){
    this.setState({redirectToCars: true});
  }

  shops(){
    this.setState({redirectToShopList: true});
  }
  
  render() {

    if(this.state.redirect){
      return (<Redirect to={'/'} />)
    }
    if(this.state.redirectToUser){
      return (<Redirect to={'/home/'+this.props.match.params.id+'/user'} />)
    }
    if(this.state.redirectToCars){
      return (<Redirect to={'/home/'+this.props.match.params.id+'/cars'} />)
    }
    if(this.state.redirectToShopList){
      return (<Redirect to={'/home/'+this.props.match.params.id+'/company'} />)
    }

    return (
      <div className='home_page'>
          <p className='title'>Witaj na stronie głównej</p>
          <div className='top_button'>
            <button type='button' className='button' onClick={this.cars}>Lista samochodów</button>
            <button type='button' className='button' onClick={this.shops}>Komisy samochodowe</button>
          </div>
          <div className='bottom_button'>
            <button type='button' className='button' onClick={this.userDetails}>Dane użytkownika</button>
            <button type='button' className='button' onClick={this.logout}>Wyloguj</button>
          </div>
      </div>
    )
  }
}

export default MainPage;
import React, {Component} from 'react';
import {GetData} from '../../services/GetData';
import {PutData} from '../../services/PutData';
import {DeleteData} from '../../services/DeleteData';
import './UserPage.css';
import {Redirect} from 'react-router-dom';
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

class UserPage extends Component {

    constructor(props){
        super(props);
        this.state ={
            login: '',
            password: '',
            redirect: false,
            redirectToHome: false,
        }
        this.home = this.home.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount(){
        if(sessionStorage.getItem("userData")){
          console.log("OK");
          const url = 'user/' + this.props.match.params.id
          GetData(url).then ((result) => {
            let responseJSON = result;
            if(responseJSON.login){
              this.setState({login: responseJSON.login});
              this.setState({password: responseJSON.password});
            }
          },
          _ => {   
          store.addNotification({
            title: "Błąd ładowania",
            message: "Nastąpił problem z załadowaniem danych użytkownika",
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
        else{
          this.setState({redirect: true});
        }
    }

    home(){
        this.setState({redirect: true});
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    delete(){
        const url = 'user/' + this.props.match.params.id
        DeleteData(url).then ((result) => {
            let responseJSON = result;
            if(responseJSON){
                store.addNotification({
                    title: "Użytkownik usunięty",
                    message: "Użytkownik został usunięty",
                    type: "success",
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
        })
        sessionStorage.setItem("userData", '');
        sessionStorage.clear();
        this.setState({redirectToHome: true})
    }

    update(){
        if(this.state.login && this.state.password){
            const url = 'user/' + this.props.match.params.id
            PutData(url, this.state).then ((result) => {
                store.addNotification({
                    title: "Zaktualizowano pomyślnie",
                    message: "Aktualizacja danych użytkownika przebiegła pomyślnie",
                    type: "success",
                    container: "top-right",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                      duration: 2000
                    },
                    wifth: 600
                  })
            },
            _ => {   
            store.addNotification({
              title: "Błąd aktualizacji",
              message: "Aktualizacja nie powiodła się",
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
              title: "Uzupełnij dane",
              message: "Login lub hasło nie zostały podane",
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

    render() {

        if(this.state.redirect){
            return (<Redirect to={'/home/'+this.props.match.params.id} />)
        }
        if(this.state.redirectToHome){
            return (<Redirect to={'/'} />)
        }

        return(
            <div className='user_page'>
                <div className='details'>
                    <h2>Dane użytkownika</h2>
                    <div className='input_div'>
                        <label>Login</label>
                        <input type='text' name='login' placeholder={this.state.login} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Hasło</label>
                        <input type='password' name='password' placeholder={this.state.password} onChange={this.onChange} />
                    </div>
                    <input type='submit' value='Edytuj' className='button' onClick={this.update} /> 
                    <input type='submit' value='Usuń' className='button' onClick={this.delete} /> 
                </div>
                <div className='bottom_div'>
                    <button type='button' className='button' onClick={this.home}>Powrót do strony głównej</button>
                </div>
            </div>
        );
    }
}

export default UserPage;
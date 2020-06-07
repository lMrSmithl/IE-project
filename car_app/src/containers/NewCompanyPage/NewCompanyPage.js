import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import './NewCompanyPage.css';
import {Redirect} from 'react-router-dom';
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

class NewCompanyPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            company_name: '',
            email_address: '',
            phone_number: '',
            redirect: false
        }
        this.home = this.home.bind(this);
        this.update = this.update.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    home(){
        this.setState({redirect: true});
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    update(){
        if(this.state.company_name){
            PostData('company', this.state).then ((result) => {
                store.addNotification({
                    title: "Zapisano pomyślnie",
                    message: "Komis został pomyślnie dodany",
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
                this.setState({redirect: true});
            },
            _ => {   
            store.addNotification({
              title: "Błąd zapisu",
              message: "Zapis nie powiódł się",
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
              message: "Nazwa komisu nie została podana",
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
            return (<Redirect to={'/home/'+this.props.match.params.id+'/company'} />);
        }
        
        return (
            <div className='new_page'>
                <div className='details'>
                    <h2>Dane komisu</h2>
                    <div className='input_div'>
                        <label>Nazwa</label>
                        <input type='text' name='company_name' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Adres email</label>
                        <input type='email' name='email_address' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Numer telefonu</label>
                        <input type='text' name='phone_number' onChange={this.onChange} />
                    </div>
                    <input type='submit' value='Zapisz' className='button_save' onClick={this.update} />
                    <input type='submit' value='Anuluj' className='button_nope' onClick={this.home} /> 
                </div>
            </div>
        );
    }
}

export default NewCompanyPage;
import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import './NewCarPage.css';
import {Redirect} from 'react-router-dom';
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

class NewCarPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            model: '',
            brand: '',
            generation: '',
            prod_year: '',
            body: '',
            fuel: '',
            mileage: '',
            engine: '',
            gearbox: '',
            color: '',
            price: '',
            company_id: this.props.match.params.companyId,
            status: '',
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
        if(this.state.brand && this.state.model){
            console.log(this.state);
            PostData('cars', this.state).then ((result) => {
                store.addNotification({
                    title: "Zapisano pomyślnie",
                    message: "Samochód został pomyślnie dodany",
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
              message: "Marka i model nie zostały podane",
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
                <div className='details_car'>
                <h2>Dane samochodu</h2>
                    <div className='input_div'>
                        <label>Marka</label>
                        <input type='text' name='brand' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Model</label>
                        <input type='text' name='model' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Generacja</label>
                        <input type='text' name='generation' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Rok produkcji</label>
                        <input type='text' name='prod_year' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Nadwozie</label>
                        <input type='text' name='body' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Paliwo</label>
                        <input type='text' name='fuel' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Przebieg</label>
                        <input type='text' name='mileage' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Silnik</label>
                        <input type='text' name='engine' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Skrzynia biegów</label>
                        <input type='text' name='gearbox' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Kolor</label>
                        <input type='text' name='color' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Cena</label>
                        <input type='text' pattern="[0-9]*" name='price' onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Status pojazdu</label>
                        <input type='text' name='status' onChange={this.onChange} />
                    </div>
                    <input type='submit' value='Zapisz' className='button_save' onClick={this.update} />
                    <input type='submit' value='Anuluj' className='button_nope' onClick={this.home} /> 
                </div>
            </div>
        );
    }
}

export default NewCarPage;
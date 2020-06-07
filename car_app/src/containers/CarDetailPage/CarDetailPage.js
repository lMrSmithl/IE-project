import React, {Component} from 'react';
import {GetData} from '../../services/GetData';
import {DeleteData} from '../../services/DeleteData';
import {PutData} from '../../services/PutData';
import './CarDetailPage.css';
import {Redirect} from 'react-router-dom';
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

class CarDetailPage extends Component {

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
            company_id: '',
            status: '',
            redirect: false,
            redirectKomis: false
        }
        this.home = this.home.bind(this);
        this.komis = this.komis.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount(){
        if(sessionStorage.getItem("userData")){
          console.log("OK");
          const url = 'cars/' + this.props.match.params.carId
          GetData(url).then ((result) => {
            let responseJSON = result;
            if(responseJSON){
              this.setState({model: responseJSON.model});
              this.setState({brand: responseJSON.brand});
              this.setState({generation: responseJSON.generation});
              this.setState({prod_year: responseJSON.prod_year});
              this.setState({body: responseJSON.body});
              this.setState({fuel: responseJSON.fuel});
              this.setState({mileage: responseJSON.mileage});
              this.setState({engine: responseJSON.engine});
              this.setState({gearbox: responseJSON.gearbox});
              this.setState({color: responseJSON.color});
              this.setState({price: responseJSON.price});
              this.setState({company_id: responseJSON.company_id});
              this.setState({status: responseJSON.status});
            }
          },
          _ => {   
          store.addNotification({
            title: "Błąd ładowania",
            message: "Nastąpił problem z załadowaniem danych samochodu",
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

    komis(){
        this.setState({redirectKomis: true});
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    delete(){
        const url = 'cars/' + this.props.match.params.carId
        DeleteData(url).then ((result) => {
            let responseJSON = result;
            if(responseJSON){
                store.addNotification({
                    title: "Samochód usunięty",
                    message: "Samochód został usunięty",
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
        this.setState({redirect: true})
    }

    update(){
        if(this.state.brand && this.state.model){
            const url = 'cars/' + this.props.match.params.carId
            PutData(url, this.state).then ((result) => {
                store.addNotification({
                    title: "Zaktualizowano pomyślnie",
                    message: "Aktualizacja danych samochodu przebiegła pomyślnie",
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
            return (<Redirect to={'/home/'+this.props.match.params.id+'/cars'} />);
        }
        if(this.state.redirectKomis){
            return (<Redirect to={'/home/'+this.props.match.params.id+'/company'} />);
        }

        return (
            <div className='user_page'>
                <div className='details_car'>
                    <h2>Dane samochodu</h2>
                    <div className='input_div'>
                        <label>Marka</label>
                        <input type='text' name='brand' value={this.state.brand} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Model</label>
                        <input type='text' name='model' value={this.state.model} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Generacja</label>
                        <input type='text' name='generation' value={this.state.generation} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Rok produkcji</label>
                        <input type='text' name='prod_year' value={this.state.prod_year} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Nadwozie</label>
                        <input type='text' name='body' value={this.state.body} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Paliwo</label>
                        <input type='text' name='fuel' value={this.state.fuel} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Przebieg</label>
                        <input type='text' name='mileage' value={this.state.mileage} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Silnik</label>
                        <input type='text' name='engine' value={this.state.engine} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Skrzynia biegów</label>
                        <input type='text' name='gearbox' value={this.state.gearbox} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Kolor</label>
                        <input type='text' name='color' value={this.state.color} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Cena</label>
                        <input type='text' pattern="[0-9]*" name='price' value={this.state.price} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Status pojazdu</label>
                        <input type='text' name='status' value={this.state.status} onChange={this.onChange} />
                    </div>
                    <input type='submit' value='Edytuj' className='button' onClick={this.update} /> 
                    <input type='submit' value='Usuń' className='button' onClick={this.delete} /> 
                </div>
                <div className='bottom_div'>
                    <button type='button' className='button' onClick={this.home}>Lista samochodów</button>
                    <button type='button' className='button' onClick={this.komis}>Lista komisów</button>
                </div>
            </div>
        );
    }
}

export default CarDetailPage;
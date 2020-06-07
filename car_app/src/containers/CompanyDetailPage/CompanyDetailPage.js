import React, {Component} from 'react';
import {GetData} from '../../services/GetData';
import {DeleteData} from '../../services/DeleteData';
import {PutData} from '../../services/PutData';
import {Redirect} from 'react-router-dom';
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './CompanyDetailPage.css'
import Car from '../../components/Car'

class CompanyDetailPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            company_name: '',
            email_address: '',
            phone_number: '',
            cars: [],
            currentPage: 1,
            carsPerPage: 4,
            redirect: false,
            redirectTo: false,
            redirectAdd: false,
            currentId: ''
        }
        this.home = this.home.bind(this);
        this.samochod = this.samochod.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.details = this.details.bind(this);
    }
    componentWillMount(){
        if(sessionStorage.getItem("userData")){
          console.log("OK");
          const url = 'company/' + this.props.match.params.companyId
          GetData(url).then ((result) => {
            let responseJSON = result;
            if(responseJSON){
              this.setState({company_name: responseJSON.company_name});
              this.setState({email_address: responseJSON.email_address});
              this.setState({phone_number: responseJSON.phone_number});
            }
          },
          _ => {   
          store.addNotification({
            title: "Błąd ładowania",
            message: "Nastąpił problem z załadowaniem danych komisu",
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
        const carUrl = 'company/' + this.props.match.params.companyId + '/cars'
            GetData(carUrl).then ((result) => {
                let responseJSON = result;
                if(responseJSON){
                    this.setState({cars: responseJSON})
                }
            },
            _ => {   
            store.addNotification({
                title: "Błąd ładowania",
                message: "Nastąpił problem z załadowaniem danych z serwera",
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

    samochod(){
      this.setState({redirectAdd: true});
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    delete(){
      const url = 'company/' + this.props.match.params.companyId
      DeleteData(url).then ((result) => {
        let responseJSON = result;
        if(responseJSON){
            store.addNotification({
                title: "Komis usunięty",
                message: "Komis został usunięty",
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
        if(this.state.company_name){
            const url = 'company/' + this.props.match.params.companyId
            PutData(url, this.state).then ((result) => {
                store.addNotification({
                    title: "Zaktualizowano pomyślnie",
                    message: "Aktualizacja danych komisu przebiegła pomyślnie",
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

    handleClick(event) {
        this.setState({
          currentPage: Number(event.target.id)
        });
    }

    details(id) {
      this.setState({currentId: id});
      this.setState({redirectTo: true});
    }

    render() {

        if(this.state.redirect){
            return (<Redirect to={'/home/'+this.props.match.params.id+'/company'} />);
        }
        if(this.state.redirectTo){
            return (<Redirect to={'/home/'+this.props.match.params.id+'/car/'+this.state.currentId} />)
        }
        if(this.state.redirectAdd){
          return (<Redirect to={'/home/'+this.props.match.params.id+'/car/new/'+this.props.match.params.companyId} />)
        }

        const { cars, currentPage, carsPerPage } = this.state;
        const indexOfLastCar = currentPage * carsPerPage;
        const indexOfFirstCar = indexOfLastCar - carsPerPage;
        const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

        const carsToShow = currentCars.map(car => {
            return (
              <li className='car_item' key={car.id}>
                <Car car={car} key={car.id} />
                <div className='div_bottom'><button className='button_details' onClick={() =>this.details(car.id)}>Zobacz szczegóły</button></div>
              </li>
            )
        })

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(cars.length / carsPerPage); i++) {
          pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
              <li
                key={number}
                id={number}
                onClick={this.handleClick}
              >
                {number}
              </li>
            );
        });

        return (
            <div className='user_page'>
                <div className='details_company'>
                    <h2>Dane komisu</h2>
                    <div className='input_div'>
                        <label>Nazwa</label>
                        <input type='text' name='company_name' value={this.state.company_name} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Adres email</label>
                        <input type='email' name='email_address' value={this.state.email_address} onChange={this.onChange} />
                    </div>
                    <div className='input_div'>
                        <label>Numer telefonu</label>
                        <input type='text' name='phone_number' value={this.state.phone_number} onChange={this.onChange} />
                    </div>
                    <input type='submit' value='Edytuj' className='button' onClick={this.update} /> 
                    <input type='submit' value='Usuń' className='button' onClick={this.delete} /> 
                </div>
                <div className='car_list'>
                    <p className='title_list'>Lista samochodów w komisie</p>
                    <ul className='car_list'>
                        {carsToShow}
                    </ul>
                </div>
                <div className='bottom_button_div'>
                    <ul className='pagination' id="page-numbers">
                        {renderPageNumbers}
                    </ul>
                    <button type='button' className='add' onClick={this.samochod}>Dodaj samochód</button>
                    <button type='button' className='button' onClick={this.home}>Powrót do listy komisów</button>
                </div>
            </div>
        );
    }
}

export default CompanyDetailPage;
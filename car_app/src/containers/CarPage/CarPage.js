import React, {Component} from 'react';
import {GetData} from '../../services/GetData';
import './CarPage.css';
import {Redirect} from 'react-router-dom';
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Car from '../../components/Car'

class CarPage extends Component {

    constructor(props){
        super(props);
        this.state ={
            cars: [],
            currentPage: 1,
            carsPerPage: 10,
            redirect: false
        }
        this.home = this.home.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){
        if(sessionStorage.getItem("userData")){
          console.log("OK");
          GetData('cars').then ((result) => {
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

    handleClick(event) {
        this.setState({
          currentPage: Number(event.target.id)
        });
    }

    details(id){
      //toDo
    }

    render(){

        if(this.state.redirect){
          return (<Redirect to={'/home/'+this.props.match.params.id} />)
        }

        const { cars, currentPage, carsPerPage } = this.state;
        const indexOfLastCar = currentPage * carsPerPage;
        const indexOfFirstCar = indexOfLastCar - carsPerPage;
        const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

        const carsToShow = currentCars.map(car => {
            return <Car car={car} details={this.details.bind(this)}/>
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

        return(
            <div className='car_page'>
                <p className='title'>Lista samochodów</p>
                <ul className='car_list'>
                    {carsToShow}
                </ul>
                <ul className='pagination' id="page-numbers">
                    {renderPageNumbers}
                </ul>
                <div className='bottom_button'>
                    <button type='button' className='button' onClick={this.home}>Powrót do strony głównej</button>
                </div>
            </div>
        );
    }
}

export default CarPage;
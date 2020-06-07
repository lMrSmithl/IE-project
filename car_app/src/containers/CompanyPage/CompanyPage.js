import React, {Component} from 'react';
import {GetData} from '../../services/GetData';
import './CompanyPage.css';
import {Redirect} from 'react-router-dom';
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Company from '../../components/Company'

class CompanyPage extends Component {

    constructor(props){
        super(props);
        this.state ={
            companies: [],
            currentPage: 1,
            companyPerPage: 10,
            redirect: false,
            redirectTo: false,
            redirectAdd: false,
            currentId: ''
        }
        this.home = this.home.bind(this);
        this.komis = this.komis.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){
        if(sessionStorage.getItem("userData")){
          console.log("OK");
          GetData('company').then ((result) => {
            let responseJSON = result;
            if(responseJSON){
                this.setState({companies: responseJSON})
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

    komis(){
      this.setState({redirectAdd: true});
    }

    handleClick(event) {
        this.setState({
          currentPage: Number(event.target.id)
        });
    }

    details(id){
      this.setState({currentId: id});
      this.setState({redirectTo: true});
    }  

    render(){

        if(this.state.redirect){
          return (<Redirect to={'/home/'+this.props.match.params.id} />)
        }
        if(this.state.redirectTo){
          return (<Redirect to={'/home/'+this.props.match.params.id+'/company/'+this.state.currentId} />)
        }
        if(this.state.redirectAdd){
          return (<Redirect to={'/home/'+this.props.match.params.id+'/company/new'} />)
        }

        const { companies, currentPage, companyPerPage } = this.state;
        const indexOfLastCompany = currentPage * companyPerPage;
        const indexOfFirstCompany = indexOfLastCompany - companyPerPage;
        const currentCompany = companies.slice(indexOfFirstCompany, indexOfLastCompany);

        const companiesToShow = currentCompany.map(company => {
            return (
              <li className='company_item' key={company.id}>
                <Company company={company} kay={company.id} />
                <div className='div_bottom'><button className='button_details' onClick={() => this.details(company.id)}>Zobacz szczegóły</button></div>
              </li>
            ) 
        })

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(companies.length / companyPerPage); i++) {
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
                <p className='title'>Lista komisów samochodowych</p>
                <ul className='car_list'>
                    {companiesToShow}
                </ul>
                <div className='bottom_button_div'>
                  <ul className='pagination' id="page-numbers">
                      {renderPageNumbers}
                  </ul>
                  <button type='button' className='add' onClick={this.komis}>Dodaj komis</button>
                  <button type='button' className='button' onClick={this.home}>Powrót do strony głównej</button>
                </div>
            </div>
        );
    }
}

export default CompanyPage;
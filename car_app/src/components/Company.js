import React from 'react';
import './style.css';

const Company = props => {
    return (
        <li className='company_item' key={props.company.id}>
            <p className='company_title'>{props.company.company_name}</p>
            <div className='div_bottom'><button className='button_details' onClick={props.details(props.company.id)}>Zobacz szczegóły</button></div>
        </li>
    );
}

export default Company;
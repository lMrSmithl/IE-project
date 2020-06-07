import React from 'react';
import './style.css';

const Company = props => {
    return (
        <div key={props.company.id}>
            <p className='company_title'>{props.company.company_name}</p>
        </div>
    );
}

export default Company;
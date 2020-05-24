import React from 'react';
import './style.css';

const Car = props => {
    return (
        <li className='car_item' key={props.car.id}>
            <p className='car_title'>{props.car.brand} {props.car.model} {props.car.generation} {props.car.prod_year}</p>
            <p className='car_price'>{props.car.price} PLN</p>
            <div className='div_bottom'><button className='button_details' onClick={props.details(props.car.id)}>Zobacz szczegóły</button></div>
        </li>
    );
}

export default Car;
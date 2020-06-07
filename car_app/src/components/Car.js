import React from 'react';
import './style.css';

const Car = props => {
    return (
        <div key={props.car.id}>
            <p className='car_title'>{props.car.brand} {props.car.model} {props.car.generation} {props.car.prod_year}</p>
            <p className='car_price'>{props.car.price} PLN</p>
        </div>
    );
}

export default Car;
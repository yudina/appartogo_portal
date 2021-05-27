import React, { Component } from 'react';
import './CardIcons.css'
import {FaParking, FaPlug, FaThermometerThreeQuarters} from "react-icons/fa";
import { ImDroplet } from "react-icons/im";

class CardIcons extends Component
{
    render(){
        const {
            hasElectricity,
            hasWater,
            hasheater,
            hasParking,
        } = this.props.listing.apartment;

        const getColor = (bool) => {
            return bool ? 'cardIcons-true' : 'cardIcons-false';
        }

        return (
            <div className="cardIcons">
                <FaParking className={getColor(hasParking)} />
                <FaPlug className={getColor(hasElectricity)} />
                <FaThermometerThreeQuarters className={getColor(hasheater)} />
                <ImDroplet className={getColor(hasWater)} />
            </div>
        )
    }
    
}

export default CardIcons;
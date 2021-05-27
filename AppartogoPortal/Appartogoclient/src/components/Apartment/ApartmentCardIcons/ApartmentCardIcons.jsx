import React, { Component } from 'react';
import {
  FaParking, 
  FaPlug, 
  FaThermometerThreeQuarters, 
  FaSnowflake,
  FaWind,
  FaRulerCombined
} from "react-icons/fa";
import { ImDroplet } from "react-icons/im";
import { BsWifi} from 'react-icons/bs';
import { GiSofa } from 'react-icons/gi';
import { CgScreen } from 'react-icons/cg'
import './ApartmentCardIcons.css';
import { Translate } from "react-translated";

class ApartmentCardIcons extends Component {

  render() {
    const getColor = (bool) => {
      return bool ? 'cardIcons-true' : 'cardIcons-false';
    }
    const {
      hasElectricity,
      hasWater,
      hasHeater,
      hasParking,
      hasFurniture,
      hasAirconditioner,
      hasCable,
      hasInternet
    } = this.props.apartment;

    return (
      <div className="cardIcons-appart">
    
    <div>
    <div>
        <Translate text="Electricity" />: <FaPlug className={getColor(hasElectricity)} />
        </div>

        <div>
        <Translate text="Heater" />:<FaThermometerThreeQuarters className={getColor(hasHeater)} />
        </div>

        <div>
        <Translate text="Water" />: <ImDroplet className={getColor(hasWater)} />
        </div>

        <div>
        <Translate text="Air Conditioner" /><FaSnowflake className={getColor(hasAirconditioner)} ></FaSnowflake>
        </div>
    </div>
        
        <div className={"cardIcons-appart-right"}>
          
        <div>
        <Translate text="Internet" /> <BsWifi className={getColor(hasInternet)} ></BsWifi>
        </div>

        <div>
        <Translate text="Parking" />: <FaParking className={getColor(hasParking)} />
        </div>

        <div>
        <Translate text="Fourniture" /> <GiSofa className={getColor(hasFurniture)} ></GiSofa>
        </div>

        <div>
        <Translate text="Cable" /> <CgScreen className={getColor(hasCable)} ></CgScreen>
        </div>
        </div>
      </div>
    );
  }
  
};

export default ApartmentCardIcons;
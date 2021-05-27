import React from 'react';
import { BiGridAlt } from "react-icons/bi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import './AltListIcons.css'
import Button from 'react-bootstrap/Button';

function AltListIcons({isGrid, triggerList, triggerGrid}) {

    

    return(
        <div className="alt-list-icons-container">
            <Button className="alt-list" onClick={triggerList}>
                <AiOutlineUnorderedList 
                    className={isGrid ? "alt-desactivated" : "alt-activated"}
                />
            </Button>

            <Button className="alt-grid" onClick={triggerGrid}>
                <BiGridAlt 
                    className={isGrid ? "alt-activated" : "alt-desactivated"}
                />
            </Button>
            
            
        </div>
    );
}

export default AltListIcons;
import { ErrorMessage, Field, getIn } from "formik";
import React from "react";
import './FormInput.css';

import { 
    Col,
    FormGroup, 
    Label, 
    Input, 
} from 'reactstrap';

const FormInputCheckbox = ({ label, property, type, formik }) => {

    return (
        <FormGroup row>
            <Label for={property} sm={3}>
                {label}
            </Label>
            <Col sm={9}>
                <Field 
                    name={property}
                    id={property}
                    className={'form-control'} 
                    type={type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                
            </Col>
        </FormGroup>
    );
}

export default FormInputCheckbox; 
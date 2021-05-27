import { ErrorMessage, getIn, Field } from "formik";
import React from "react";

import { 
    Col,
    FormGroup, 
    Label, 
    Input, 
} from 'reactstrap';

const DatePicker = ({ label, property, formik }) => {

    return (
        <FormGroup row>
            <Label for={property} sm={3}>
                {label}
            </Label>
            <Col sm={9}>
            <DatePicker 
                  selected={formik.values.availibityDate}
                  dateFormat="MMMM d, yyyy"
                  className={
                    getIn(formik.errors, property) && getIn(formik.touched, property)
                    ? 'form-control is-invalid' 
                    : 'form-control'
                  } 
                  name={property}
                  onChange={date => formik.setFieldValue(property, date)}
                />
                {
                    getIn(formik.errors, property)
                    && getIn(formik.touched, property)
                    ? 
                    (
                        <div className="invalid-feedback">
                            <ErrorMessage
                                component="div"
                                name={property}
                                className="input-feedback"
                            />
                        </div>
                    ) : 
                    null
                }
                
            </Col>
        </FormGroup>
    );
}

export default DatePicker; 
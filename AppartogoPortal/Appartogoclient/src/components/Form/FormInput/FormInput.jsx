import { ErrorMessage, getIn, Field } from "formik";
import React from "react";
import './FormInput.css';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';

import {
  Col,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

const FormInput = ({ label, property, type, formik, textArea }) => {

  return (
    <FormGroup row>
      <Label for={property} sm={3}>
        {label}
      </Label>
      <Col sm={9}>
        {type != "DatePicker" ? (
          <Field
            name={property}
            id={property}
            component={textArea ? "textarea" : null}
            className={
              getIn(formik.errors, property) && getIn(formik.touched, property)
                ? 'form-control is-invalid'
                : 'form-control'
            }
            type={type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={textArea ? {height: '200px'} : null}
          />)
          :
          (
            <DatePicker
              selected={getIn(formik.values, property)}
              dateFormat="yyyy-MM-dd"
              className={
                getIn(formik.errors, property) && getIn(formik.touched, property)
                  ? 'form-control is-invalid'
                  : 'form-control'
              }
              name={property}
              onChange={date => formik.setFieldValue(property, date)}
            />
          )
        }
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

export default FormInput; 
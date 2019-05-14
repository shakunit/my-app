import React, { Component } from 'react';
import { UncontrolledCollapse, InputGroup, InputGroupText, InputGroupAddon, Input, Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Card, CardHeader, CardFooter, CardBody,  CardText, CardImg} from 'reactstrap';
import './QueryForm.css'



class QueryNewBtn extends  Component{
constructor(props) {
    super(props);
    
   

    this.state = {
        modal: false,
       
    };

   this.toggle = this.toggle.bind(this);
 
}


toggle() {
    this.setState(prevState => ({
        modal: !prevState.modal
    }));
}


    render(){
        const { term, articalDB } = this.state;
        
        return(
            
             <Button onClick={this.toggle} className="addArticaleBtn btnSuccess"><i className="fa fa-plus"></i> <span className="newBtn">New</span></Button> 
                    
            
        )
    }
}
export default QueryNewBtn;
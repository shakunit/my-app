import React, { Component } from 'react';
import { UncontrolledCollapse, CustomInput, InputGroup, InputGroupText, InputGroupAddon, Input, Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Card, CardHeader, CardFooter, CardBody,  CardText, CardImg} from 'reactstrap';


import './QueryForm.css'


function searchingFor(term){
    return function (x){
        return x.issueTitle.toLowerCase().includes(term.toLowerCase()) || !term;
        
    }
} 



class QueryFormSearch extends  Component{
constructor(props) {
    super(props);
    
    

    this.state = {
               term:''
    };
    this.searchHandler = this.searchHandler.bind(this);
}

clearFilter = () =>{
    this.setState({ term: ""});
}


toggle() {
    this.setState(prevState => ({
        modal: !prevState.modal
    }));
}

handleOptionChange = (changeEvent) => {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  }
  
handleFormSubmit = (formSubmitEvent) =>{
  
  return this.state.selectedOption;
}  





searchHandler(event){
    this.setState({term: event.target.value});
}




    render(){
        const { term } = this.state;
        
        return(
            <div className="myArtical">

                            
                <input type="text" className="form-control" onChange={this.searchHandler} value={this.state.term}/>               
                    
            </div>
        )
    }
}
export default QueryFormSearch;
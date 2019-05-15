import React, { Component } from 'react';
import { UncontrolledCollapse, InputGroup, InputGroupText, InputGroupAddon, Input, Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Card, CardHeader, CardFooter, CardBody,  CardText, CardImg} from 'reactstrap';

import Firebase from "firebase";

import Config from './Config';


function searchingFor(term){
    return function (x){
        return x.issueTitle.toLowerCase().includes(term.toLowerCase()) || !term;
        
    }
} 



class QuerySubmitForm extends  Component{
constructor(props) {
    super(props);
    this.state = {
        term:'',
        articalDB: []
    };

    
    
}

fnCurrentDate = () => {
     let date = new Date().getDate();
     let month = new Date().getMonth() + 1;
     let year = new Date().getFullYear();
     return (date + '/' + month + '/' + year)
} 
componentDidMount() {
    this.getUserData();
    console.log("componentDidMount")
    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.writeUserData();
    }
    
    
  }


clearFilter = () =>{
    this.setState({ term: ""});
}


writeUserData = () => {
    Firebase.database()
      .ref("/")
      .set(this.state);
    //console.log("DATA SAVED");
    
  };

  getUserData = () => {
    let ref = Firebase.database().ref("/");
    ref.on("value", snapshot => {
      const state = snapshot.val();
      this.setState(state);
      
    });
    
  };

handleSubmit = event => {
event.preventDefault();
    let userName = this.refs.userName.value;
    let issueTitle = this.refs.issueTitle.value;
    let issueBrowser = this.refs.issueBrowser.value;
    let issueDetail = this.refs.issueDetail.value;
    let currentDate = this.fnCurrentDate();
    let uid = this.refs.uid.value;
    let issueStatus = this.handleFormSubmit();
    let url = this.refs.url.value;
    let updaterName =this.refs.updaterName.value;
    let updatedIssueDetail = this.refs.updatedIssueDetail.value;
    let updationDate =this.refs.updationDate.value;
    
    if (uid && userName && issueTitle && issueBrowser && issueDetail && currentDate && issueStatus && url ) {
      const { articalDB } = this.state;
      const devIndex = articalDB.findIndex(data => {
        return data.uid === uid;
      });
      articalDB[devIndex].userName = userName;
      articalDB[devIndex].issueTitle = issueTitle;
      articalDB[devIndex].issueBrowser = issueBrowser;
      articalDB[devIndex].issueDetail = issueDetail;
      articalDB[devIndex].currentDate = currentDate;
      articalDB[devIndex].issueStatus = issueStatus;
      articalDB[devIndex].url = url;
      articalDB[devIndex]. = updaterName;
      articalDB[devIndex].updatedIssueDetail = updatedIssueDetail;
      articalDB[devIndex].updationDate = updationDate;

      this.setState({ articalDB });
    } else if (userName && issueTitle && issueBrowser && issueDetail && currentDate && issueStatus && url ) {
      const uid = new Date().getTime().toString();
      const { articalDB } = this.state;
      articalDB.push({ uid, userName, issueTitle, issueBrowser, issueDetail, currentDate, issueStatus, url, updaterName, updatedIssueDetail, updationDate});
      //var newPostKey = Firebase.database().ref().child('articalDB').push().devIndex;
      
      this.setState({ articalDB });
    }

    this.refs.userName.value = "";
    this.refs.issueTitle.value = "";
    this.refs.issueBrowser.value = "";
    this.refs.issueDetail.value = "";
    this.refs.url.value = "";
    this.currentDate = "";
    this.refs.uid.value = "";
    this.selectedOption = null;
    this.setState({selectedOption:null});
    

   };



handleOptionChange = (changeEvent) => {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  }
  
handleFormSubmit = (formSubmitEvent) =>{
    //formSubmitEvent.preventDefault();

  console.log('You have selected:', this.state.selectedOption);
  return this.state.selectedOption;
}  



    render(){
        
        
        return(
            <div className="myArticalSubmitForm">
              
                        <ModalHeader >New Artical</ModalHeader>
                        <ModalBody>
                        
                            <FormGroup row>
                                <input type="hidden" ref="uid" />
                                <input type="hidden" ref="updaterName" />
                                <input type="hidden" ref="updatedIssueDetail" />
                                <input type="hidden" ref="updationDate" />
                                
                                <Label for="userName" sm={2}>Name:</Label>
                                <Col sm={10}>
                                <input type="text" name="name" id="userName" placeholder="Enter your name" ref="userName" className="form-control"/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="issueTitle" sm={2}>Issue:</Label>
                                <Col sm={10}>
                                    <input type="text" name="issue" id="issueTitle" placeholder="Enter your issue" ref="issueTitle" className="form-control"/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="issueBrowser" sm={2}>Browser:</Label>
                                <Col sm={10}>
                                    <input type="text" name="issue" id="issueBrowser" placeholder="Enter your issue browser" ref="issueBrowser" className="form-control"/>
                                </Col>
                            </FormGroup>
                            
                            <FormGroup row>
                                <Label for="exampleUrl" sm={2}>Url</Label>
                                <Col sm={10}>
                                    <input type="url" name="url" id="exampleUrl" placeholder="url placeholder" className="form-control" ref="url"/>
                                </Col>
                            </FormGroup>
                            
                            <FormGroup inline row>
                            <Label for="issueBrowser" sm={2}>Status:</Label>
                            <Col sm={10} className="statusradio">
                                    <input type="radio" value="Open" checked={this.state.selectedOption === 'Open'} onChange={this.handleOptionChange} /> Open
                                    <input type="radio" value="Close" checked={this.state.selectedOption === 'Close'} onChange={this.handleOptionChange} /> Close
                            </Col>
                            </FormGroup>
                            
                             <FormGroup row>
                                <Label for="issueDetail"sm={2}>Details:</Label>
                                <Col sm={10}>
                                    <textarea className="form-control" rows="4" id="issueDetail" ref="issueDetail"></textarea>
                                </Col>
                            </FormGroup>
                         </ModalBody>
                        <ModalFooter>
                            <Button className="btnSuccess" id="submitForm" onClick={this.handleSubmit}>Submit</Button>
                            <Button className="btnSuccess"   id="submitForm">Cancel</Button>
                        </ModalFooter>
                        
                                
                 
                    
            </div>
        )
    }
}
export default QuerySubmitForm;
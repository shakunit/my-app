import React, { Component } from 'react';
import { UncontrolledCollapse, InputGroup, InputGroupText, InputGroupAddon, Input, Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Card, CardHeader, CardFooter, CardBody,  CardText, CardImg} from 'reactstrap';
import { Router, Route, browserHistory} from 'react-router';
import Firebase from "firebase";
import QuerySubmitForm from './QuerySubmitForm';
import Config from './Config';
import './QueryForm.css'

function searchingFor(term){
    return function (x){
        return x.issueTitle.toLowerCase().includes(term.toLowerCase()) || !term;
        
    }
} 



class QueryForm extends  Component{
constructor(props) {
    super(props);
    
    Firebase.initializeApp(Config);

    this.state = {
        inputTxt:'',
        textareaTxt:'',
        term:'',
        articalDB: []
    };

    
    this.searchHandler = this.searchHandler.bind(this);
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




removeData = developer => {
    const { articalDB } = this.state;
    const newState = articalDB.filter(data => {
      return data.uid !== developer.uid;
    });
    
    this.setState({ articalDB: newState });
  };

updateData = (index) => {
 
    let adaNameRef = Firebase.database().ref('articalDB/'+index+'/');
    
    adaNameRef.update({ 
        updaterName: this.state.inputTxt,
        updatedIssueDetail:this.state.textareaTxt,
        issueStatus: "Fixed",
        updationDate: this.fnCurrentDate()
    });
       
      this.setState({inputTxt : null})
      this.setState({textareaTxt : null})


  };


updateInputBox = (event) => {this.setState({inputTxt : event.target.value })}
updateTextareaBox = (event) => {this.setState({textareaTxt : event.target.value })}



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

lockIcon = (articalDB) =>{
    
        switch(articalDB.issueStatus ) {
            case "Open":
            return (<span className="issueLock recLock"></span>);
            case "Close":
            return (<span className="issueLock greenLock"></span>);
            case "Fixed":
            return (<span className="issueLock greenLock"></span>);
            default:
            return null;
      }
}

articalUpdateList = (articalDB, index) =>{
    switch(articalDB.issueStatus ) {
                                
        case "Open":
        return (
            <div className="issueStatusDetail">
                <div className="updationBox">
                
                    <Form>
                    <FormGroup>
                            <input type="hidden" ref="uid" />
                            <Label for="updaterName" className="issueStatusDetailtxt">Name:</Label>
                            <textarea rows="1" name="name" id="updaterName" placeholder="Enter your name" onChange={this.updateInputBox} className="border_radius_0 form-control issueStatusDetailtxt" ></textarea>
                        </FormGroup>
                        <FormGroup>
                            <Label for="updatedIssueDetail" className="issueStatusDetailtxt">Soluction Details:</Label>
                            <textarea rows="3" id="updatedIssueDetail" ref="updatedIssueDetail" className="border_radius_0 form-control issueStatusDetailtxt" onChange={this.updateTextareaBox} ></textarea>
                            <Button onClick={() => this.updateData(index)} className="issueStatusDetailtxt btnSuccess">Submit</Button>
                        </FormGroup>
                        
                    </Form> 
               </div>
            </div>
        );
        case "Fixed":
        return (
            <div className="issueStatusDetail">
                <div className="updationBox">
                    <Container className="SoluctionHdr"><u><b>Soluction:</b></u></Container>
                    <Container><CardText className="cardText">{articalDB.updatedIssueDetail}</CardText></Container>
                </div>    
                <div className="footer"><small className="footerTxt font-italic grayData">Posted by:  <i className="primary">{articalDB.updaterName}</i> <span className="lineData">|</span> Posted on: <i className="primary">{articalDB.updationDate}</i> </small></div>
            </div>
        );
        default:
        return null;
    }
}


searchHandler(event){
    this.setState({term: event.target.value});
}

abc = () =>{
    const path = '/QuerySubmitForm';
    this.props.history.push(path)
    // browserHistory.push(path);
}


    render(){
        const { term, articalDB } = this.state;
        
        return(
            <div className="myArtical">
               <Container>

            
            

               <QuerySubmitForm/>


                <Row>
                <Col className="padding_0">
                <Form className="cardWrap">
                    <Row>
                        <Button className="addArticaleBtn btnSuccess" onClick={this.abc}><i className="fa fa-plus"></i> <span className="newBtn">New</span></Button>
                        
                        <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fas fa-sliders-h"></i> <span>By Issue</span></InputGroupText>
                                </InputGroupAddon>
                                <input type="text" className="form-control" onChange={this.searchHandler} value={this.state.term}/>
                        </InputGroup>
                        
                        
                            <InputGroup disabled>
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText disabled>By User</InputGroupText>
                                </InputGroupAddon>
                                <input type="text" className="form-control" disabled/>
                            </InputGroup>
                            <div onClick={this.clearFilter} className="txtbtnSuccess text-right">Clear All</div>
                        
                    </Row>
                   
                        
                    </Form>
                    </Col>                
                </Row>
                <Row className="listItm"> 
                <Col className="padding_0">
                {articalDB.filter(searchingFor(term)).map((articalDB, index) => (
                    <Card key={index}>
                        <CardHeader>
                            
                            <h3 className="hdrTxt">{articalDB.issueTitle}</h3> 
                            {this.lockIcon(articalDB)}
                            <small className="text-muted showDetails" id={"toggler"+index} style={{ marginBottom: '1rem' }}>View <i className="fa fa-arrow-right" aria-hidden="true"></i></small>
                           
                        </CardHeader>
                        <UncontrolledCollapse toggler={"#toggler"+index}>
                        <CardBody>
                        <Container>
                            <Row>
                                {/* <Col xs="2"><CardImg top width="100%" src="https://cdn.auth0.com/blog/react-js/react.png" alt="Card image cap" /></Col> */}
                                <Col className="margn_25">
                                    <CardText className="text_14">{articalDB.issueDetail}</CardText>
                                    
                                     <span className="text_14"><u>Course Url:</u>   &nbsp; <a href={articalDB.url} className="text-primary">{articalDB.url}</a></span><br/>
                                     <span className="text_14"><u>Reported Browser:</u>    &nbsp;<small><i>{articalDB.issueBrowser}</i></small></span>
                                </Col>
                            </Row>
                        </Container>
                        
                        
                        </CardBody>
                        <CardFooter>
                          <small className="footerTxt font-italic grayData">Posted by:  <i className="primary">{articalDB.userName}</i> <span className="lineData">|</span> Posted on: <i className="primary">{articalDB.currentDate}</i> </small>
                          <span onClick={() => this.removeData(articalDB)} className="cursor leftTrace"><i className="fas fa-trash-restore-alt"></i></span>
                        </CardFooter>
                            {this.articalUpdateList(articalDB, index)}
                    </UncontrolledCollapse>   
                    </Card>
                            
                    )).reverse()}                     
                    </Col>
                </Row>
            </Container>  
                   
            </div>
        )
    }
}
export default QueryForm;
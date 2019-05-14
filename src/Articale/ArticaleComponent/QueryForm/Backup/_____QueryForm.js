import React, { Component } from 'react';
import { UncontrolledCollapse, InputGroup, InputGroupText, InputGroupAddon, Input, Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Card, CardHeader, CardFooter, CardBody,  CardText, CardImg} from 'reactstrap';

import Firebase from "firebase";
import QuerySubmitForm from './QuerySubmitForm';
import QueryNewBtn from './QueryNewBtn';
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
        modal: false,
        inputTxt:'',
        textareaTxt:'',
        term:'',
        articalDB: []
    };

    this.toggle = this.toggle.bind(this);
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
    
    
    if (uid && userName && issueTitle && issueBrowser && issueDetail && currentDate && issueStatus && url) {
      const { articalDB } = this.state;
      const devIndex = articalDB.findIndex(data => {
        return data.uid === uid;
      });
      articalDB[devIndex].userName = userName;
      articalDB[devIndex].issueTitle = issueTitle;
      articalDB[issueBrowser].issueBrowser = issueBrowser;
      articalDB[issueDetail].issueDetail = issueDetail;
      articalDB[currentDate].currentDate = currentDate;
      articalDB[issueStatus].issueStatus = issueStatus;
      articalDB[url].url = url;
      this.setState({ articalDB });
    } else if (userName && issueTitle && issueBrowser && issueDetail && currentDate && issueStatus && url) {
      const uid = new Date().getTime().toString();
      const { articalDB } = this.state;
      articalDB.push({ uid, userName, issueTitle, issueBrowser, issueDetail, currentDate, issueStatus, url});
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
    this.setState({modal:false});

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




    render(){
        const { term, articalDB } = this.state;
        
        return(
            <div className="myArtical">
               <Container>
                <Row>
                <Col className="padding_0">
                <Form className="cardWrap">
                    <Row>
                        <QueryNewBtn/>
                        
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
                   
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} className="detailForm">
                        <ModalHeader toggle={this.toggle}>New Artical</ModalHeader>
                        <QuerySubmitForm/>
                        </Modal>
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
                                    
                                     <span className="text_14"><u>Course Url:</u>   &nbsp; <a href={articalDB.url} class="text-primary">{articalDB.url}</a></span><br/>
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
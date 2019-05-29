import React, { Component } from 'react';
import { Alert, UncontrolledCollapse, CustomInput, InputGroup, InputGroupText, InputGroupAddon, Container, Row, Col, Button, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Card, CardHeader, CardFooter, CardBody,  CardText} from 'reactstrap';

import Firebase from "firebase";

import Config from './Config';
import './QueryForm.css'
import QuerySubmitForm from './QuerySubmitForm';

import $ from 'jquery';

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
    this.newState={
        
    }

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
    

    
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
       this.writeUserData();
    }
    
    $(".UpdateBtn").click(function(){
        $(".updateFormWrap").show();
    })
    $(".UpdateCancel").click(function(){
        $(".updateFormWrap").hide();
    })

    $(".alertBtnError").click(function(){
        $(".UpdatedWrapError").hide();
    })
    $(".alertBtnCorrect").click(function(){
      setTimeout(function(){  $(".UpdatedWrapCorrect").hide(); }, 3000);
     
    })

  }


clearFilter = () =>{
    this.setState({ term: ""});
}


writeUserData = () => {
    
    if(this.state.term==""){
        Firebase.database().ref("/").set(this.state);
    }
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

  updateData = developer => {
    this.refs.uid.value = developer.uid;
    this.refs.userName.value = developer.userName;
    this.refs.issueTitle.value = developer.issueTitle;
    this.refs.issueBrowser.value = developer.issueBrowser;
    this.refs.issueDetail.value = developer.issueDetail;
    this.refs.currentDate.value = developer.currentDate;
    this.refs.url.value = developer.url;
    this.refs.issueStatus.value = developer.issueStatus;
  };

  handleSubmitCloseIssue = event => {
    
        let userName = this.refs.userName.value;
        let issueTitle = this.refs.issueTitle.value;
        let issueBrowser = this.refs.issueBrowser.value;
        let issueDetail = this.refs.issueDetail.value;
        let currentDate =  this.refs.currentDate.value;
        let uid = this.refs.uid.value;
        let issueStatus = "Fixed";
        let url = this.refs.url.value;
        let updaterName =this.refs.updaterName.value;
        let updatedIssueDetail = this.refs.updatedIssueDetail.value;
        let updationDate =this.refs.updationDate.value;
        if(updaterName=="" || updatedIssueDetail=="" ){
            $(".UpdatedWrapError").show();
            }
                //alert("issueBrowser=> "+issueBrowser)
        else{
            if (uid && userName) { 
                    
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
                articalDB[devIndex].updaterName = updaterName;
                articalDB[devIndex].updatedIssueDetail = updatedIssueDetail;
                articalDB[devIndex].updationDate = updationDate;


                this.setState({ articalDB });
                } else if (userName) {
                    console.log("22222")
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
                this.refs.updaterName.value = "";
                this.refs.updatedIssueDetail.value = "";
                this.selectedOption = null;
                
                this.setState({selectedOption:null});
                
                $(".updateFormWrap").hide();
                this.clearFilter();
        }        
       };




// updateData1 = (index) => {
//     let adaNameRef = Firebase.database().ref('articalDB/'+index+'/');
//     adaNameRef.update({
//         updaterName: this.state.inputTxt
//         // updatedIssueDetail:this.state.textareaTxt,
//         // issueStatus: "Fixed",
//         // updationDate: this.fnCurrentDate()
//     });
//       this.setState({inputTxt : null})
//       this.setState({textareaTxt : null})
//   };


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
  
  return this.state.selectedOption;
}  


deleteAlert = () =>{
    alert("You need admin permission to delete this file !!!")
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
fnUpdateBtn= (articalDB, index) =>{
    switch(articalDB.issueStatus ) {
        
        case "Close":
        return (
            <span>
            <p title="Update"  className="cursor UpdateBtnDisable"></p>
            <span title="Delete" onClick={() => this.removeData(articalDB)} className="cursor leftTrace"><i className="fas fa-trash-restore-alt"></i></span>
            {/* <span title="Delete" onClick={() => this.deleteAlert()} className="diable"><i className="fas fa-trash-restore-alt"></i></span> */}
            </span>
        );
        case "Open":
        return (
            <span>
            <span title="Update"  onClick={() => this.updateData(articalDB)} className="cursor UpdateBtn"></span>
            <span title="Delete" onClick={() => this.removeData(articalDB)} className="cursor leftTrace"><i className="fas fa-trash-restore-alt"></i></span>
            {/* <span title="Delete" onClick={() => this.deleteAlert()} className="diable"><i className="fas fa-trash-restore-alt"></i></span> */}
            </span>
        );
        case "Fixed":
        return (
            <span>
            <p title="Update"  className="cursor UpdateBtnDisable"></p>
            <span title="Delete" onClick={() => this.removeData(articalDB)} className="cursor leftTrace" ><i className="fas fa-trash-restore-alt"></i></span>
            {/* <span title="Delete" onClick={() => this.deleteAlert()} className="diable"><i className="fas fa-trash-restore-alt"></i></span> */}
            </span>
        );
        default:
        return null;
    }
}

articalUpdateList = (articalDB, index) =>{
    switch(articalDB.issueStatus ) {
                                
        case "Open":
        return (
            <div>
                 {this.abc}
            </div>
           
        );
        case "Fixed":
        return (
            <div className="issueStatusDetail">
                <div className="updationBox">
                {this.abc}
                    <Container className="SoluctionHdr"><u><b>Solution:</b></u></Container>
                    <Container><CardText className="cardText"><pre>{articalDB.updatedIssueDetail}</pre></CardText></Container>
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



                             <div className="UpdatedWrapError">
                                <div className="whiteBox"></div>
                                    <Alert color="secondary" className="ErrorMssg"> 
                                    
                                        <h4 className="alert-heading">Error</h4>
                                        <p>Please update the all files, after that preess the submit button.</p>
                                        <ul>
                                            <li>Please enter your name</li>
                                            <li>Please enter a solution</li>
                                        
                                        </ul>
                                        <hr />
                                        <Button className="mb-0 alertBtnError" color="secondary">Continue</Button>
                                        
                                    </Alert>
                                </div>
                                <div className="UpdatedWrapCorrect">
                                <div className="whiteBox"></div>
                                    <Alert color="success" className="ErrorMssg"> 
                                    
                                        <h4 className="alert-heading">Well done!</h4>
                                        <p>Your data has been successfully updated.</p>
                                        <hr />
                                        <Button className="mb-0 alertBtnCorrect"  id="submitForm" color="success">Continue</Button>
                                        
                                    </Alert>
                                </div>





                                   <div className="updateFormWrap" style={{display:"none"}}> 
                                   <div className="whiteBox"></div>
                                   <div className="updateFormSubWrap"> 
                                   <div className="updateFormmainWrap">
                                    <ModalHeader >New Artical</ModalHeader>
                                    <ModalBody>
                                        <FormGroup row>
                                            <input type="hidden" ref="uid" value={articalDB.uid}/>
                                            <input type="hidden" ref="currentDate" />
                                            <input type="hidden" ref="issueStatus"/>
                                            <input type="hidden" ref="updationDate" value={this.fnCurrentDate()}/>
                                            <input type="hidden" name="name" id="userName" placeholder="Enter your name" ref="userName" className="form-control" value={articalDB.userName}/>
                                            <input type="hidden" name="issue" id="issueTitle" placeholder="Enter your issue" ref="issueTitle" className="form-control" value={articalDB.issueTitle}/>
                                            <input type="hidden" name="issue" id="issueBrowser" placeholder="Enter your issue browser" ref="issueBrowser" className="form-control" value={articalDB.issueBrowser}/>
                                            <input type="hidden" name="url" id="exampleUrl" placeholder="url placeholder" className="form-control" ref="url" value={articalDB.issueBrowser}/>
                                            <input type="hidden" className="form-control" rows="4" id="issueDetail" ref="issueDetail" value={articalDB.issueDetail}></input>
                                        </FormGroup>
                                        <FormGroup row>
                                            
                                            <Label for="updaterName" sm={2}>Name:</Label>
                                            <Col sm={10}>
                                            <input type="text" name="name" id="updaterName" placeholder="Enter your name" ref="updaterName" className="form-control" value={articalDB.updaterName}/>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup inline row>
                                            <Label for="issueBrowser" sm={2}>Status:</Label>
                                            <Col sm={10} className="statusradio">
                                            <CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch" label="Open" disabled inline/>
                                            <CustomInput type="switch" id="exampleCustomSwitch2" name="customSwitch" label="Close" checked/> 
                                            </Col>
                                        </FormGroup>
                            
                                        <FormGroup row>
                                            <Label for="updatedIssueDetail"sm={2}>Solution:</Label>
                                            <Col sm={10}>
                                                <textarea className="form-control" rows="4" id="updatedIssueDetail" ref="updatedIssueDetail" value={articalDB.updatedIssueDetail}></textarea>
                                            </Col>
                                        </FormGroup>

                                    </ModalBody>
                                    <ModalFooter>
                                        <Button className="btnSuccess" onClick={this.handleSubmitCloseIssue}>Submit</Button>
                                        <Button className="UpdateCancel btnSuccess"  >Cancel</Button>
                                    </ModalFooter>
                                    </div>
                                    </div>
                                    </div>



                    <UncontrolledCollapse toggler="#submitForm" className="submitFormWrap">
                    <div className="whiteBox" id="submitForm"></div>
                    <Card className="submitFormSubWrap">
                        <CardBody>
                        <QuerySubmitForm/>
                        </CardBody>
                    </Card>
                    </UncontrolledCollapse> 
                    
                   

               <Container>
                <Row>
                <Col className="padding_0">
                <Form className="cardWrap">
                    <Row>
                        <Button  id="submitForm" className="addArticaleBtn btnSuccess"><i className="fa fa-plus"></i> <span className="newBtn">New</span></Button>
                        
                        <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fas fa-sliders-h"></i> <span>By Issue</span></InputGroupText>
                                </InputGroupAddon>
                                <input type="text" className="form-control" onChange={this.searchHandler} value={this.state.term}/>
                                
                        </InputGroup>
                        
                        
                            <InputGroup disabled className="disableItm">
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
                    
                        <CardHeader id={"toggler"+index}> 
                            
                            <h3 className="hdrTxt">{articalDB.issueTitle}</h3> 
                            {this.lockIcon(articalDB)}
                            <small className="text-muted showDetails" style={{ marginBottom: '1rem' }}>View <i className="fa fa-arrow-right" aria-hidden="true"></i></small>
                           
                        </CardHeader>
                        <UncontrolledCollapse toggler={"#toggler"+index}>
                        <CardBody>
                        <Container>
                            <Row>
                                {/* <Col xs="2"><CardImg top width="100%" src="https://cdn.auth0.com/blog/react-js/react.png" alt="Card image cap" /></Col> */}
                                <Col className="margn_25">
                                    <CardText className="text_14"><pre>{articalDB.issueDetail}</pre></CardText>
                                    
                                    
                                     <span className="text_14"><u>Course Url:</u>   &nbsp; <a href={articalDB.url} target="_blank" className="text-primary">{articalDB.url}</a></span><br/>
                                     <span className="text_14"><u>Reported Browser:</u>    &nbsp;<small><i>{articalDB.issueBrowser}</i></small></span>
                                </Col>
                            </Row>
                        </Container>
                        
                        
                        </CardBody>
                        <CardFooter>
                          <small className="footerTxt font-italic grayData">Posted by:  <i className="primary">{articalDB.userName}</i> <span className="lineData">|</span> Posted on: <i className="primary">{articalDB.currentDate}</i> </small>
                          {/* <span title="Update"  onClick={() => this.updateData(articalDB)} className="cursor UpdateBtn"></span> */}
                          {this.fnUpdateBtn(articalDB)}
                         
                          
                          {/* <Button color="primary" onClick={() => this.updateData(articalDB)} className="UpdateBtn">Edit</Button> */}
                          
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
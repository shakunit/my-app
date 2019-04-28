import React, { Component } from 'react';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Card, CardHeader, CardFooter, CardBody,  CardText, CardImg} from 'reactstrap';

import Firebase from "firebase";

import Config from './Config';
import './QueryForm.css'


class QueryForm extends  Component{
constructor(props) {
    super(props);
    
    Firebase.initializeApp(Config);

    this.state = {
        modal: false,
        articalDB: []
    };

    this.toggle = this.toggle.bind(this);
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
  }


writeUserData = () => {
    Firebase.database()
      .ref("/")
      .set(this.state);
    console.log("DATA SAVED");
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

    if (uid && userName && issueTitle && issueBrowser && issueDetail && currentDate) {
      const { articalDB } = this.state;
      const devIndex = articalDB.findIndex(data => {
        return data.uid === uid;
      });
      articalDB[devIndex].userName = userName;
      articalDB[devIndex].issueTitle = issueTitle;
      articalDB[issueBrowser].issueBrowser = issueBrowser;
      articalDB[issueDetail].issueDetail = issueDetail;
      articalDB[currentDate].currentDate = currentDate;
      this.setState({ articalDB });
    } else if (userName && issueTitle && issueBrowser && issueDetail && currentDate) {
      const uid = new Date().getTime().toString();
      const { articalDB } = this.state;
      articalDB.push({ uid, userName, issueTitle, issueBrowser, issueDetail, currentDate });
      //var newPostKey = Firebase.database().ref().child('articalDB').push().devIndex;
      
      this.setState({ articalDB });
    }

    this.refs.userName.value = "";
    this.refs.issueTitle.value = "";
    this.refs.issueBrowser.value = "";
    this.refs.issueDetail.value = "";
    this.currentDate = "";
    this.refs.uid.value = "";
    
    this.setState({modal:false});

   };


removeData = developer => {
    const { articalDB } = this.state;
    const newState = articalDB.filter(data => {
      return data.uid !== developer.uid;
    });
    
    this.setState({ articalDB: newState });
  };

updateData = (articalDB) => {
  

  
  // Now simply find the parent and return the name.
  
  //console.log("articalDB>>>>>"+ref.parent().name())
    //this.setState({modal:true});
    
    let adaNameRef = Firebase.database().ref('articalDB/3/');
    
    adaNameRef.update({ userName: 'Ada', });
    // this.refs.uid.value = articalDB.uid;
    // this.refs.userName.value = articalDB.userName;
    // this.refs.issueTitle.value = articalDB.issueTitle;
    // this.refs.issueBrowser.value = articalDB.issueBrowser;
    // this.refs.issueDetail.value = articalDB.issueDetail;

  };

toggle() {
    this.setState(prevState => ({
        modal: !prevState.modal
    }));
}
    


    render(){
        const { articalDB } = this.state;
        return(
            <div className="myArtical">
            
               <Container>
                <Row>
                
                <Col  xs="2">
                    <Form>
                        
                        <Button onClick={this.toggle} className="cursor"><i className="fas fa-folder-plus"></i>Add Issue</Button>
                        
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Artical</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <input type="hidden" ref="uid" />
                                <Label for="userName">Name:</Label>
                                <input type="text" name="name" id="userName" placeholder="Enter your name" ref="userName" className="form-control"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="issueTitle">Issue:</Label>
                                <input type="text" name="issue" id="issueTitle" placeholder="Enter your issue" ref="issueTitle" className="form-control"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="issueBrowser">Browser:</Label>
                                <input type="text" name="issue" id="issueBrowser" placeholder="Enter your issue browser" ref="issueBrowser" className="form-control"/>
                            </FormGroup>
                             <FormGroup>
                                <Label for="issueDetail">Issue Details:</Label>
                                <textarea className="form-control" rows="3" id="issueDetail" ref="issueDetail"></textarea>
                            </FormGroup>
                         </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.handleSubmit}>Submit</Button>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                        </Modal>
                    </Form>                
                </Col>
                <Col xs="10"> 
                {articalDB.map(articalDB => (
                    <Card>
                        <CardHeader><h3>{articalDB.issueTitle}</h3></CardHeader>
                        <CardBody>
                        <Container>
                            <Row>
                                <Col xs="2"><CardImg top width="100%" src="https://cdn.auth0.com/blog/react-js/react.png" alt="Card image cap" /></Col>
                                <Col xs="10">
                                    <CardText>{articalDB.issueDetail}</CardText>
                                     <i className="text-muted">Reported Browser:   {articalDB.issueBrowser}</i>
                                </Col>
                            </Row>
                        </Container>
                        
                        
                        </CardBody>
                        <CardFooter>
                          <small className="text-muted footerTxt">Posted by:  <i className="primary">{articalDB.userName}</i> on <i className="primary">{articalDB.currentDate}</i> </small>
                          
                          <span onClick={() => this.removeData(articalDB)} className="cursor leftTrace"><i className="fas fa-trash-restore-alt"></i></span>
                          <span onClick={() => this.updateData(articalDB)} className="cursor leftTrace">Update</span>
                        </CardFooter>
                    </Card>
                            
                    ))}                     
                </Col>
                </Row>
            </Container>  
                    
            </div>
        )
    }
}
export default QueryForm;
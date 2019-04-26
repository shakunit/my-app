import React, { Component } from 'react';
import QueryForm from './ArticaleComponent/QueryForm/QueryForm';

import { Container, Row, Col } from 'reactstrap';

class Artical extends  Component{
    
    render(){
        return(
            <Container>
                <Row>
                
                <Col> <QueryForm/></Col>
            </Row>
            </Container>
        )
    }
}
export default Artical;
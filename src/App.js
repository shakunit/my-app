import React, { Component } from 'react';
import Articale from './Articale/Articale';

import ArticaleHeader from './Articale/ArticaleComponent/ArticaleHeader'
import { Container, Row, Col } from 'reactstrap';

class App extends Component {
  
  
  render() {
    return (
       <div className="App">
       <ArticaleHeader/>
          <Container>
                <Row>
                  <Col >
                    <Articale/>
                   
                  </Col>
                </Row>
                
          </Container>
     
      </div>
    )
  }
}

export default App;
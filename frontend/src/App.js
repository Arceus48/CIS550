import React, { Component } from 'react';
import './App.css';
import Welcome from './components/Welcome/Welcome';
import Major from './components/Major/Major';
import RestaurantInformation from './components/RestaurantInformation/RestaurantInformation';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';

const backendUrl = 'http://localhost:3001/';
const messageSetting = { position: 'bottom', timeout: 5000};
const initialState = {
  route : "welcome",
  query:{
    name : '',
    address : '',
  },
  results : [],
  name:'',
  business_id:'',
  // name:'17 SOUTH BOOZE & BITES BAR',
  // business_id:'dNRbhJt4wd-ZU4lFVK3iiw',
}
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }
  handleWelcome = (search, address) => {
    const query = {name:search, address:address};
    this.setState({query:query});
    fetch(backendUrl + 'welcome', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        query: query
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response === "error"){
        Alert.error('Error connecting server', messageSetting);
      } 
      else if(response.length === 0){
        Alert.warning('No Matching data found', messageSetting);
      }
      else {
        this.setState({route: 'major', results:response});
      }
    })
    .catch(err => Alert.error('Error connecting server', messageSetting));
  }

  returnInfo = (name, business_id) => {
    fetch(backendUrl + 'information', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: name,
        business_id: business_id
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response === "error"){
        Alert.error('Error connecting server', messageSetting);
      } 
      else{
        this.setState({route: 'info', results:response });
      }
    })
    .catch(err => Alert.error('Error connecting server', messageSetting));
  }

  componentDidMount(){
    // this.returnInfo(this.state.name, this.state.business_id);
  }
  render() {
    return (
      <div className="app">
       { (this.state.route === 'welcome')
         ? <Welcome handleWelcome = {this.handleWelcome} />
         : (this.state.route === 'major') ?
            <Major returnInfo={this.returnInfo} results={this.state.results} />
            : <RestaurantInformation results={this.state.results} />
       }
       <Alert stack={{limit: 3}}  html={true}/>
      </div>
    );
  }
}

export default App;

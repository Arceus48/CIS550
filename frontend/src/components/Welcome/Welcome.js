import React from 'react';
import './Welcome.css';
import logo from './logo.png';

class Welcome extends React.Component {
    constructor(props){
        super();
        this.state = {
            search:'',
            address:''
        }
    }

    onChangeSearch = (event) => {
        this.setState({search:event.target.value});
    }

    onChangeAddress = (event) => {
        this.setState({address:event.target.value});
    }
	render() {
        const handleWelcome = this.props.handleWelcome;
        const { search, address } = this.state;
        return(
            <div className="welcome">
                <div className="hero-image">
                    <nav className="navbar navbar-light">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <a className="navbar-brand" href="index.html">Delicious Map</a>
                            </div>
                        </div>
                        <div className="hero-text">
                            <img src={logo} id = "logoImage" alt="logo" />
                            <div>
                                <input type="text" placeholder="Search.." name="search" onChange={this.onChangeSearch} />
                                <input type="text" placeholder="Near.." name="location" onChange={this.onChangeAddress}/>
                                <button onClick={() => {handleWelcome(search, address)}} type="submit">
                                    <i className="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        );
	};
}
export default Welcome;
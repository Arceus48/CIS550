import React, { Component } from 'react';
import Querybar from './Querybar/Querybar';
import MapsContainer from './MapsContainer/MapsContainer';
import './Major.css';

class Major extends Component {
    constructor(props){
        super();
        this.state = {
            initialResults: props.results,
            results: props.results,
            filter:{
                review_score : 1.0,
                hygiene : 'B',
                parking : 0,
                is_open: 0
            }
        }
    }

    handleFilterReview = (event) => {
        const newFilter = this.state.filter;
        newFilter.review_score = event.target.value;
        this.setState({filter: newFilter});
        this.handleFilter(newFilter);
    }

    handleFilterHygiene = (event) => {
        const newFilter = this.state.filter;
        newFilter.hygiene = event.target.value;
        this.setState({filter: newFilter});
        this.handleFilter(newFilter);
    }

    handleFilterParking = (event) => {
        const newFilter = this.state.filter;
        newFilter.parking = (event.target.value) === '0' ? 0 : 1;
        this.setState({filter: newFilter});
        this.handleFilter(newFilter);
    }

    handleFilterOpening = (event) => {
        const newFilter = this.state.filter;
        newFilter.opening = (event.target.value) === '0' ? 0 : 1;
        this.setState({filter: newFilter});
        this.handleFilter(newFilter);
    }

    handleFilter = (newFilter) => {
        const results = this.state.initialResults
                    .filter(row => row.current_grade <= newFilter.hygiene)
                    .filter(row => row.stars > newFilter.review_score)
                    .filter(row => row.parking >= newFilter.parking)
                    .filter(row => row.is_open >= newFilter.is_open)
        this.setState({results: results});
    }


    handleFilterSide = (name, business_id) => { 
        this.props.returnInfo(name, business_id);
    }

    handleThirdPage = (event) => {
        const name = event.target.name;
        const business_id = event.target.value;
        this.props.returnInfo(name, business_id);
    }

    render() {
        return (
            <div className="major">
                <div className="wrap">
                    <div className="left">
                        <Querybar   handleFilterReview = {this.handleFilterReview} 
                                    handleFilterHygiene = {this.handleFilterHygiene}
                                    handleFilterParking = {this.handleFilterParking}
                                    handleFilterOpening = {this.handleFilterOpening}
                                    handleFilterSide  = {this.handleFilterSide}
                                    results = {this.state.results}
                                    />
                    </div>
                    <div className="right">
                        <MapsContainer
                            handleThirdPage = {this.handleThirdPage} 
                            results = {this.state.results} />
                    </div>
                </div>
            </div>
        );
    }
}
export default Major;
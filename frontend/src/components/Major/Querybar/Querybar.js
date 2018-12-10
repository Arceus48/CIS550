import React, {Component} from 'react';
import './Querybar.css';

const initialState = {
}
class Querybar extends Component {
    
    constructor(props){
        super();
        this.state = initialState;
    }

    render(){
        const { handleFilterReview, handleFilterHygiene, handleFilterParking, handleFilterOpening } = this.props;
        return (
            <div className="Querybar">
                <div className="container">
                    <form className="form-horizontal" action="/action_page.php">
                        <div className="form-group">
                            <label className="control-label" htmlFor="category"><b>Category:</b></label>
                            <div className="">
                            <input type="text" className="form-control" id="category" placeholder="Enter category" name="category" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="score"><b>Review Score:</b></label>
                            <div className="">
                            <select className="browser-default custom-select targetSelect" id ='reviewScore' onChange={handleFilterReview}>
                                <option value="0">Yelp review scores</option>
                                <option value="4">4.0</option>
                                <option value="3">3.0</option>
                                <option value="2">2.0</option>
                                <option value="1">1.0</option>
                            </select>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label className="control-label" htmlFor="hygiene"><b>Hygiene:</b> </label>
                            <div className="">
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <input  className="btn btn-secondary btn-danger active"
                                        type="radio"
                                        name="hygiene" 
                                        value="B" 
                                        id="hygiene-lo" 
                                        autoComplete="off" 
                                        onClick={handleFilterHygiene} /> Low
                                <input  className="btn btn-secondary btn-danger"
                                        type="radio" 
                                        name="hygiene" 
                                        value="A" 
                                        id="hygiene-hi" 
                                        autoComplete="off"
                                        onClick={handleFilterHygiene} /> High
                            </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="parking"><b>Parking:</b> </label>
                            <div className="">
                            <div className="btn-group btn-group-toggle" data-toggle="buttons" >
                                <input  className="btn btn-secondary btn-danger active" 
                                        type="radio" 
                                        value="1" 
                                        name="options" 
                                        id="parking-yes" 
                                        autoComplete="off" 
                                        onClick={handleFilterParking} /> Yes
                                <input  className="btn btn-secondary btn-danger" 
                                        type="radio" 
                                        value="0" 
                                        name="options" 
                                        id="parking-no" 
                                        autoComplete="off" 
                                        onClick={handleFilterParking} /> Not Necessary
                            </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="is_open"><b>Opening Now:</b> </label>
                            <div className="">
                            <div className="btn-group btn-group-toggle" data-toggle="buttons" >
                                <input  type="radio" 
                                        name="options" 
                                        value="1"
                                        id="is_open-yes" 
                                        autoComplete="off" 
                                        onClick={handleFilterOpening} /> Yes
                                <input  type="radio" 
                                        name="options" 
                                        value="0"
                                        id="is_open-no" 
                                        autoComplete="off" 
                                        onClick={handleFilterOpening} /> Not Necessary
                                
                            </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
export default Querybar;
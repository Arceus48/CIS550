import React, {Component} from 'react';
import './Querybar.css';

const initialState = {
    parkingState : false,
    openingState : false
}
class Querybar extends Component {
    
    constructor(props){
        super();
        this.state = initialState;
    }

    handleRadioButtonParking = (event) => {
        // const parkingState = (event.target.value === "1") ? true : false;
        // this.setState({parkingState : parkingState});
    }
    handleRadioButtonOpening = (event) => {
        // const openingState = (event.target.value === "1") ? true: false;
        // this.setState({openingState : openingState});
    }

    render(){
        const { results, handleFilterReview, handleFilterHygiene, handleFilterParking, handleFilterOpening, handleFilterSide  } = this.props;
        const filteredNames = [];
        const filteredBusiness_id = [];
        if(results){
            for(let i = 0; i < results.length; i++){
                const { business_id, restaurant_name } = results[i];
                if(filteredNames.indexOf(restaurant_name) === -1){
                    filteredNames.push(restaurant_name);
                    filteredBusiness_id.push(business_id);
                }
            }
        }
        const sideList = filteredNames.map((name, index) => {
            return(
                <button type="button" 
                        key={index} 
                        onClick={() => handleFilterSide(name,filteredBusiness_id[index])}> 
                        {index+1}. {name} 
                </button>
            )
        }).slice(0,10);
        
        // const { parkingState, openingState } = this.state;
        return (
            <div className="Querybar">
                <div className="container">
                    <form className="form-horizontal" action="/action_page.php">
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
                            <form className="radioButtonClass" action="/action_page.php">
                                <input  className="btn btn-secondary btn-danger active"
                                        type="radio"
                                        name="hygiene" 
                                        value="B" 
                                        id="hygiene-lo" 
                                        autoComplete="off" 
                                        defaultChecked={true}
                                        onClick={handleFilterHygiene} /> Low
                                <input  className="btn btn-secondary btn-danger"
                                        type="radio" 
                                        name="hygiene" 
                                        value="A" 
                                        id="hygiene-hi" 
                                        autoComplete="off"
                                        onClick={handleFilterHygiene} /> High
                            </form>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="parking"><b>Parking:</b> </label>
                            <div className="">
                            <form className="radioButtonClass" action="/action_page.php">
                                <input  className="btn btn-secondary btn-danger active" 
                                        type="radio" 
                                        value="1" 
                                        name="parking" 
                                        id="parking-yes" 
                                        autoComplete="off" 
                                        onClick={(event) => {handleFilterParking(event); this.handleRadioButtonParking(event)}}
                                        // checked = {parkingState}
                                        /> Yes
                                <input  className="btn btn-secondary btn-danger" 
                                        type="radio" 
                                        value="0" 
                                        name="parking" 
                                        id="parking-no" 
                                        autoComplete="off" 
                                        onClick={(event) => {handleFilterParking(event); this.handleRadioButtonParking(event)}}
                                        defaultChecked={true}
                                        //checked = {!parkingState}
                                        /> Not Necessary
                            </form>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="is_open"><b>Opening Now:</b> </label>
                            <div className="">
                            <form className="radioButtonClass" action="/action_page.php">
                                <input  type="radio" 
                                        name="isopen" 
                                        value="1"
                                        id="is_open-yes" 
                                        autoComplete="off" 
                                        // checked = {openingState}
                                        onClick={(event) => {handleFilterOpening(event); this.handleRadioButtonOpening(event)}} /> Yes
                                <input  type="radio" 
                                        name="isopen" 
                                        value="0"
                                        id="is_open-no" 
                                        autoComplete="off" 
                                        defaultChecked={true}
                                        // checked = {!openingState}
                                        onClick={(event) => {handleFilterOpening(event); this.handleRadioButtonOpening(event)}} /> Not Necessary
                            
                            </form>
                            </div>
                        </div>
                        
                        <div className="form-group sideList">
                            {sideList}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
export default Querybar;
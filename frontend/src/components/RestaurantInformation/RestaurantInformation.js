import React, { Component } from 'react';
import './RestaurantInformation.css';
import logo from './images/logo.png';
// import cafe from './images/cafe.jpg';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import configServer from '../.././configServer.js';
const messageSetting = { position: 'bottom', timeout: 5000};

const backendUrl = configServer.url;
class RestaurantInformation extends Component {
    constructor(){
        super()
        this.state = {
            results: {},
            recommendation: {}
        };
    }

    updateInfo = (name, business_id) => {
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
            this.setState({results : response });
          }
        })
        .catch(err => Alert.error('Error connecting server', messageSetting));
        window.scrollTo(0, 0);

        // below is repeated
        fetch(backendUrl + 'recommendation', {
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
              // Alert.error('Can\'t get recommendations, messageSetting);
            } 
            else if(response.length === 0){
              // Alert.warning('No Matching data found', messageSetting);
            }
            else {
                this.setState({
                  recommendation: response
                });
            }
          })
          .catch(err => console.log(err)/* Alert.error('Error connecting server', messageSetting) */ );
    }

    changeStar = (stars) => {
        for(let i = 0; i < stars; i++){
            document.getElementById("star[" + i + "]").className="fa fa-star checked";
        }
        for(let i = 0; i < stars; i++){
            document.getElementById("star2[" + i + "]").className="fa fa-star checked";
        }
    }
    componentDidMount(){
        this.setState({results : this.props.results});
        const { restaurant_name, business_id } = this.props.results.generalInfo[0];
        fetch(backendUrl + 'recommendation', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: restaurant_name,
                business_id: business_id
            })
          })
          .then(response => response.json())
          .then(response => {
            if(response === "error"){
              // Alert.error('Can\'t get recommendations, messageSetting);
            } 
            else if(response.length === 0){
              // Alert.warning('No Matching data found', messageSetting);
            }
            else {
                this.setState({
                  recommendation: response
                });
            }
          })
          .catch(err => console.log(err)/* Alert.error('Error connecting server', messageSetting) */ );
    }
    popUp = (displayStyle) => {
        document.getElementById('id01').style.display= displayStyle;
    }

    render(){
        const { generalInfo, reviews, violations, photos, inspection, category } = this.state.results;
    
        // general info
        let restaurant_name, address, is_open, take_out, parking;
        if(generalInfo && generalInfo.length > 0){
            ({ restaurant_name, address, is_open, take_out, parking } = generalInfo[0]);
        }
        // reviews
        const reviewScores = [0, 0, 0, 0, 0, 0];
        if(reviews){
            for(let i = 0; i < reviews.length; i++){
                let { stars, count } = reviews[i];
                reviewScores[stars] += count;
            }
        }
        const starsCount = reviewScores.reduce((a, b) => a + b);
        const starsAvg = reviewScores.map((val,index)=>val*index).reduce((a,b)=>a+b) / starsCount;
        this.changeStar(starsAvg);
        for(let i = 1; i <= 5; i++){
            const element = document.getElementsByClassName("bar-" + i)[0];
            if(element){
                const percent = reviewScores[i] / starsCount * 100;
                element.style.width = percent + "%";
            }
        }

        // violations
        let violationTags;
        if(violations && violations.length > 0){
            violationTags = violations.map((row,index) => <p className="p_override"> Record {index} - Violation code {row.violation_id} : {row.violation_description} </p>)
                                        .reduce((a,b) => a + b)
        }
        else violationTags = <p> No violation records in current inspection </p>
    
        // photos
        const baseUrl = 'https://s3.amazonaws.com/yelpphotos520/';
        const imgUrl = [
            baseUrl + '9B_Fiy-qxvAO8Z2nTQ3xbg.jpg',
            baseUrl + '9jgiOg4aIUjDIATM_2b3RA.jpg',
            baseUrl + 'aHXBH1Ux7Gq_QQ0siS2xhQ.jpg',
            baseUrl + 'ajZClWCKxtDFPmnVZgcb7g.jpg',
            baseUrl + 'AMQgprSzQz3WUUkrQsgixw.jpg',
            baseUrl + 'lVJkKD1Rl9281d896hrOBg.jpg',
            baseUrl + 'lvu-1jXiAI3Z9Kz3CmvJKw.jpg',
            baseUrl + 'LW9ESzK2F_49yq35DJGlgg.jpg',
        ]
        if(photos){
            for(let i = 0; i < photos.length; i++){
                imgUrl[i] = baseUrl + photos[i].photo_id + '.jpg';
            }
        }

        // inspection
        let current_grade, inspection_date;
        if(inspection){
            ({ current_grade, inspection_date } = inspection[0]);
        }
        inspection_date = new Date(inspection_date);
        const date = inspection_date.getDate();
        const month = inspection_date.getMonth();
        const year = inspection_date.getFullYear();
        const dateString = month + "/" + date + "/" + year;
        
        // category
        let categoryTag;
        if(category){
            categoryTag = category.map(((val,index) => val.category + ", "))
                                .reduce((a,b) => a + b);
            categoryTag = categoryTag.slice(0, -2);
        }
        // background images
        const bgElement = document.getElementsByClassName("bgimages")[0];
        if(bgElement){
            bgElement.style.backgroundImage = `url("${imgUrl[0]}"), url("${imgUrl[1]}"), url("${imgUrl[2]}")`;
        }

        // recommendation
        const recommendationNames = [
            'Bowen\'s Restauraunt',
            'Arceus\'s Restaurant',
            'Henry\'s Restaurant',
        ]
        const recommendationBusiness_id = [
            '0',
            '1',
            '2',
        ]
        const recommendationUrl = [
            baseUrl + 'bg38QW77pERfZL1uSv9_6w.jpg',
            baseUrl + 'Blfwdjpsh_dOXrVVBnxqhw.jpg',
            baseUrl + 'BOQ5v6hfR_6keoFF3J-hIw.jpg',
        ]
        const recName = this.state.recommendation.recommendationName;
        const recUrl = this.state.recommendation.recommendationPhoto;
        // console.log(this.state.recommendation);
        if(recName){
            for(let i = 0; i < recName.length; i++){
                recommendationNames[i] = recName[i].restaurant_name;
                recommendationBusiness_id[i] = recName[i].business_id;
            }
        }
        if(recUrl) {
            for(let i = 0; i < recUrl.length; i++){
                recommendationUrl[i] = baseUrl + recUrl[i].photo_id + '.jpg';
            }
        }

        return(
            <div className="restaurant_info">
                <nav className="navbar sticky-top navbar-expand-sm bg-light navbar-light">
                    <div className="container-fluid">
                        <ul className="navbar-nav">
                            <div className="navbar-header">
                                <a className="navbar-brand" href="index.html">
                                    <img src={logo} width="60px" height="35px" alt="logo"/>
                                </a>
                            </div>
                            <li className="nav-item">
                                <a className="page-scroll nav-link" href="#overview">Overview</a>
                            </li>
                            <li className="nav-item">
                                <a className="page-scroll nav-link" href="#photos">Photos</a>
                            </li>
                            <li className="nav-item">
                                <a className="page-scroll nav-link" href="#reviews">Reviews</a>
                            </li>
                            <li className="nav-item">
                                <a className="page-scroll nav-link" href="#recommendations">Recommendations</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="bgimages">
                    <div className="row1">
                        <div className="main">
                            <section id="overview">
                                <h2> {restaurant_name} </h2>
                            </section>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="main">
                        <hr />
                        <h5>Star Rating</h5>
                        <h3 id="star[0]" className="fa fa-star"> </h3>
                        <h3 id="star[1]" className="fa fa-star"> </h3>
                        <h3 id="star[2]" className="fa fa-star"> </h3>
                        <h3 id="star[3]" className="fa fa-star"> </h3>
                        <h3 id="star[4]" className="fa fa-star"> </h3>
                        <h5>Category</h5>
                        <p>{categoryTag}</p>
                        <h5>Address</h5>
                        <p>{address}</p>
                        <h5>Open</h5>
                        <p>{(is_open) ? 'Yes' : 'No'}</p>
                        <h5>Take-out</h5>
                        <p>{(take_out) ? 'Yes' : 'No'}</p>
                        <h5>Parking</h5>
                        <p>{(parking) ? 'Yes' : 'No'}</p>
                        <hr />
                        <section id="photos" className="photos-section">
                            <h3 className="addPadding">Photos</h3>
                            <br />
                            <br />
                            <div className="gallery">
                                <a target="_blank" href={imgUrl[0]} rel="noopener noreferrer">
                                    <img src={imgUrl[0]} alt="5Terre" />
                                </a>
                            </div>
                            <div className="gallery">
                                <a target="_blank" href={imgUrl[1]} rel="noopener noreferrer">
                                    <img src={imgUrl[1]} alt="5Terre" />
                                </a>
                            </div>
                            <div className="gallery">
                                <a target="_blank" href={imgUrl[2]} rel="noopener noreferrer">
                                    <img src={imgUrl[2]} alt="5Terre" />
                                </a>
                            </div>
                            <div className="gallery">
                                <a target="_blank" href={imgUrl[3]} rel="noopener noreferrer">
                                    <img src={imgUrl[3]} alt="5Terre" />
                                </a>
                            </div>
                            <div className="gallery">
                                <a target="_blank" href={imgUrl[4]} rel="noopener noreferrer">
                                    <img src={imgUrl[4]} alt="5Terre" />
                                </a>
                            </div>
                            <div className="gallery">
                                <a target="_blank" href={imgUrl[5]} rel="noopener noreferrer">
                                    <img src={imgUrl[5]} alt="5Terre" />
                                </a>
                            </div>
                            <div className="gallery">
                                <a target="_blank" href={imgUrl[6]} rel="noopener noreferrer">
                                    <img src={imgUrl[6]} alt="5Terre" />
                                </a>
                            </div>
                            <div className="gallery">
                                <a target="_blank" href={imgUrl[7]} rel="noopener noreferrer">
                                    <img src={imgUrl[7]} alt="5Terre" />
                                </a>
                            </div>
                        </section>
                        <hr />
                        <section id="reviews" className="review-section">
                            <span className="heading">Reviews</span>
                            <h3 id="star2[0]" className="fa fa-star"> </h3>
                            <h3 id="star2[1]" className="fa fa-star"> </h3>
                            <h3 id="star2[2]" className="fa fa-star"> </h3>
                            <h3 id="star2[3]" className="fa fa-star"> </h3>
                            <h3 id="star2[4]" className="fa fa-star"> </h3>
                            <p>{starsAvg.toFixed(1)} average based on {starsCount} reviews.</p>
                            <div className="row-of-rating">
                                <div className="side-of-rating">
                                    <div>5 star</div>
                                </div>
                                <div className="middle-of-rating">
                                    <div className="bar-container">
                                        <div className="bar-5"></div>
                                    </div>
                                </div>
                                <div className="side-of-rating right-of-rating">
                                    <div>{reviewScores[5]}</div>
                                </div>
                                <div className="side-of-rating">
                                    <div>4 star</div>
                                </div>
                                <div className="middle-of-rating">
                                    <div className="bar-container">
                                        <div className="bar-4"></div>
                                    </div>
                                </div>
                                <div className="side-of-rating right-of-rating">
                                    <div>{reviewScores[4]}</div>
                                </div>
                                <div className="side-of-rating">
                                    <div>3 star</div>
                                </div>
                                <div className="middle-of-rating">
                                    <div className="bar-container">
                                        <div className="bar-3"></div>
                                    </div>
                                </div>
                                <div className="side-of-rating right-of-rating">
                                    <div>{reviewScores[3]}</div>
                                </div>
                                <div className="side-of-rating">
                                    <div>2 star</div>
                                </div>
                                <div className="middle-of-rating">
                                    <div className="bar-container">
                                        <div className="bar-2"></div>
                                    </div>
                                </div>
                                <div className="side-of-rating right-of-rating">
                                    <div>{reviewScores[2]}</div>
                                </div>
                                <div className="side-of-rating">
                                    <div>1 star</div>
                                </div>
                                <div className="middle-of-rating">
                                    <div className="bar-container">
                                        <div className="bar-1"></div>
                                    </div>
                                </div>
                                <div className="side-of-rating right-of-rating">
                                    <div>{reviewScores[1]}</div>
                                </div>
                            </div>

                        </section>
                        <section id="recommendations" className="recommendations-section">
                            <hr />
                            <span className="heading">Recommendations</span>
                            <br />
                            <br />
                            <div onClick = {() => this.updateInfo(recommendationNames[0], recommendationBusiness_id[0])} >
                                <div className="container">
                                    <img src={recommendationUrl[0]} alt="Avatar" className="image" />
                                    <div className="overlay">
                                        <div className="text">{recommendationNames[0]}</div>
                                    </div>
                                </div>
                            </div>

                            <div onClick = {() => this.updateInfo(recommendationNames[1], recommendationBusiness_id[1])} >
                                <div className="container">
                                    <img src={recommendationUrl[1]} alt="Avatar" className="image" />
                                    <div className="overlay">
                                        <div className="text">{recommendationNames[1]}</div>
                                    </div>
                                </div>
                            </div>

                            <div onClick = {() => this.updateInfo(recommendationNames[2], recommendationBusiness_id[2])} >
                                <div className="container">
                                    <img src={recommendationUrl[2]} alt="Avatar" className="image" />
                                    <div className="overlay">
                                        <div className="text">{recommendationNames[2]}</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>

                    <div className="side sticky">
                        <h2>Hygiene</h2>
                        <hr />
                        <h5>Current Grade</h5>
                        <p>{current_grade}</p>
                        <hr />
                        <h5>Inspection Date</h5>
                        <p>{dateString}</p>
                        <hr />
                        <h5>Violation</h5>
                        <button onClick={() => this.popUp('block')}>View details</button>
                    </div>
                </div>

                <div className="footer">Copyright: Foodies' Group</div>
                <div id="id01" className="modal">
                    <form className="modal-content animate" action="/action_page.php">
                        <div className="imgcontainer">
                            <span onClick={() => this.popUp('none')} className="close" title="Close Modal">&times;</span>
                            <br />
                            <br />
                            <h3 className="addPadding">Violation</h3>
                            {violationTags}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
    
}

export default RestaurantInformation;
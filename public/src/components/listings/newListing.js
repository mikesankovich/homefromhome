import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';
import { browserHistory } from 'react-router';
import ReactMarkdown from 'react-markdown';
import city_states from '../../../locations/cities';
import states from '../../../locations/states';
import countries from '../../../locations/countries';
import us_cities_by_state from '../../../locations/us_cities';
import {Link} from 'react-router';

class NewListing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: '', text: ''
    }
  }
  handleFormSubmit(formProps) { //called with props from submit form
    var data = formProps
    data.usCity = this.state.usCity
    console.log(data)
    data.city = this.state.city
    data.country = this.state.country
    data.image = this.state.file
    data.username = this.props.userInfo.username;
    data.id = this.props.userInfo._id;
    data.phoneNumber = this.props.userInfo.phoneNumber;
    data.email = this.props.userInfo.email;
    if(data.country !== 'United States') {
      data.usCity = 'not valid'
    }
    if(data.image.length === 0) {
      alert('Must supply Image');
      return;
    }
    for (var key in data) {
      if (!data[key] ) {
        alert(`All Fields Are Required. Please fill in the ${key} field`)
        return;
      }
    }
    this.props.newListing(data);
    browserHistory.push('/listings')
  }
  changeCountry(event) {
    this.setState({country: event.target.value});
  }
  changeCity(event) {
    this.setState({city: event.target.value});
  }
  changeUsCity(event) {
    this.setState({usCity: event.target.value});
    console.log(this.state)
  }
  markdown() {
    this.setState({text: ''})
  }
  componentWillMount() {
    this.props.fetchInfo();
  }
  renderAlert() {
    if(this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Error!!! </strong> {this.props.errorMessage}
        </div>
      )
    }
  }
  previewFile() {
    var self = this;
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();
    var image;
    reader.addEventListener("load", function () {
      image = reader.result;
      self.setState({file: image})
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }

  }
  render() {
    let incrementKey = 0
    let { handleSubmit, userInfo, fields: {address, usCity, image, pricePerNight, availableForRent, title, description }} = this.props;

    let citiesorstates = [];
    if (this.state.country) {
      if (!city_states[this.state.country]) {
        alert('Sorry. We do not provide services in that country');
      } else {
        citiesorstates = city_states[this.state.country].split('|');
      }
    }
    let usCities;
    if(this.state.country && this.state.country === 'United States' && this.state.city && this.state.city.length > 0) {
      let usState = this.state.city.toUpperCase();
      usCities = us_cities_by_state[usState]
    }
    return (
      <div>
      {userInfo && userInfo.hostUserAgreementSigned &&
        <div className="container">
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                <fieldset className="form-group">
                  <label>Country: </label>
                  <select className="form-control" onChange={this.changeCountry.bind(this)}>
                    <option key="default">Pick A Country</option>
                    {countries.map((e) => {
                      return <option key={e} value={e}>{e}</option>
                    })}
                  </select>
                </fieldset>
                {this.state.country && citiesorstates.length > 0 &&
                  <fieldset className="form-group">
                    {this.state.country === 'United States' && <label>State: </label>}
                    {this.state.country !== 'United States' && <label>City: </label>}
                    <select className="form-control" onChange={this.changeCity.bind(this)}>
                      {this.state.country === 'United States' && <option key="default">Pick A State</option>}
                      {this.state.country !== 'United States' && <option key="default">Pick A City</option>}
                      {citiesorstates.map((e) => {
                        if(e.length > 0) return <option key={incrementKey+=1} value={e}>{e}</option>
                      })}
                    </select>
                  </fieldset>
                }
                {this.state.country &&
                  this.state.country === 'United States' &&
                  this.state.city &&
                  (this.state.city.length > 0) &&
                  <fieldset className="form-group">
                    <label>City: </label>
                    <select className="form-control" onChange={this.changeUsCity.bind(this)}>
                      <option key="default">Pick A City</option>
                      {usCities.map((e) => {
                        if(usCities.length > 0) return <option key={incrementKey+=1} value={e}>{e}</option>
                      })}
                    </select>
                  </fieldset>
                }
                <fieldset className="form-group">
                  <label>Address: </label>
                  <input className="form-control" type="text" {...address} />
                  {address.touched && address.error && <div className="error">{address.error}</div>}
                </fieldset>
                <fieldset className="form-group">
                  <input type="file" onChange={this.previewFile.bind(this)} />
                </fieldset>
                <fieldset className="form-group">
                  <label>Price Per Night: </label>
                  <input className="form-control" type="number" min="0.01" step="0.01" max="5000.00" {...pricePerNight} />
                  {pricePerNight.touched && pricePerNight.error && <div className="error">{pricePerNight.error}</div>}
                </fieldset>
                <fieldset className="form-group">
                  <h3>Currently Available For Rent?</h3>
                  <label className="radio-inline">
                    <input
                      type="radio"
                      name="availableForRent"
                      onChange={availableForRent.onChange}
                      value="true" />Yes:
                  </label>
                  <label className="radio-inline">
                    <input
                      type="radio"
                      name="availableForRent"
                      onChange={availableForRent.onChange}
                      value="false"/>No:
                  </label>
                  {availableForRent.touched && availableForRent.error && <div className="error">{availableForRent.error}</div>}
                </fieldset>
                <fieldset className="form-group">
                  <label>Listing Title: </label>
                  <input className="form-control" type="text" {...title} />
                  {title.touched && title.error && <div className="error">{title.error}</div>}
                </fieldset>
                <fieldset className="form-group">
                  <label>Describe the Listing: </label>
                  <textarea className="form-control" type="text" {...description} onInput={this.markdown.bind(this)}></textarea>
                  {description.touched && description.error && <div className="error">{description.error}</div>}
                </fieldset>
                {this.renderAlert()}
                <button action="submit" className="btn btn-primary">Add Listing</button>
              </form>
            </div>
            <div className='col-sm-6 previewMarkdown'>
              <ReactMarkdown source={description.value} />
            </div>
          </div>
        </div>
      }
      <div>
        {!userInfo && <h1>Loading....</h1>}
      </div>
      <div>
        {userInfo && !userInfo.hostUserAgreementSigned &&
          <h1>
            You must first sign the host user agreement
            <Link className="nav-link" to="/useragreements/host">To Host Agreement</Link>
          </h1>
        }
      </div>
    </div>
    );
  }
}

function validate(formProps) {
  const errors = {};

  if (!formProps.address) {
    errors.address = 'Please Enter an Address';
  }
  if (!formProps.pricePerNight) {
    errors.pricePerNight = 'Please Enter Price Per Night';
  }
  if(formProps.availableForRent !== formProps.availableForRent) {
    errors.availableForRent = 'Is the listing currently available for rent?';
  }
  if(!formProps.availableForRent) {
    errors.description = 'Describe the listing';
  }
  if(!formProps.title) {
    errors.title = 'Title the listing';
  }
  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    userInfo: state.auth.userInfo
  };
}

export default reduxForm({
  form: 'newListing',
  fields: ['image', 'pricePerNight', 'availableForRent', 'address', 'description', 'title', 'usCity'],
  validate,
}, mapStateToProps, actions)(NewListing);

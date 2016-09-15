import React, {Component} from 'react';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import * as actions from '../../../actions';
import { browserHistory } from 'react-router'


class PhotoBook extends Component {
  componentWillMount() {
    this.props.fetchInfo();
  }
  uploadPhoto(formprops) {
    formprops.image = this.state.file;
    this.props.uploadMyPhoto(formprops, this.props.userInfo._id)
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
    const { handleSubmit, userInfo, fields: {image, tagline, location }} = this.props;

    let photos = userInfo.myPhotos || [];
    if(userInfo) {
      return (
        <div className="col-sm-12">
          <form onSubmit={handleSubmit(this.uploadPhoto.bind(this))}>
            <fieldset className="form-group">
              <input type="file" onChange={this.previewFile.bind(this)} />
            </fieldset>
            <fieldset className="form-group">
              <label>Tagline: </label>
              <input className="form-control" type="text" {...tagline} />
              {tagline.touched && tagline.error && <div className="error">{tagline.error}</div>}
            </fieldset>
            <fieldset className="form-group">
              <label>Location: </label>
              <input className="form-control" type="text" {...location} />
              {location.touched && location.error && <div className="error">{location.error}</div>}
            </fieldset>
            {this.renderAlert()}
            <button action="submit" className="btn btn-primary">Post Blog</button>
          </form>
          <div className="col-sm-10 col-sm-offset-1">
            <div className="col-sm-12">
              {photos.map((e) => {
                return (
                  <div className="col-sm-3" key={e._id} onClick={() => {browserHistory.push(`/myphotos/${e._id}`)}}>
                    <ul className="photoBookBorder">
                      <li>{e.location}</li>
                      <li>{e.tagline}</li>
                      <li><img className="photoBookImage" src={e.image}/></li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="toppush"><h1>LOADING........</h1></div>
    }

  }
}
function validate(formProps) {
  const errors = {};

  if (!formProps.tagline) {
    errors.tagline = 'Please Enter a Tagline';
  }
  return errors;
}
function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo};
}
export default reduxForm({
  form: 'photoBook',
  fields: ['image', 'tagline', 'location'],
  validate,
}, mapStateToProps, actions)(PhotoBook);
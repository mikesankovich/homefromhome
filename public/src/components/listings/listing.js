import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import { browserHistory } from 'react-router'


class SingleListing extends Component {
  componentWillMount() {
    let id = this.props.location.pathname.split('listings/')[1]
    this.props.fetchSingleListing(id);
  }
  render() {
    let {listing} = this.props;
    console.log(listing)
    if(listing) {
      return (
        <div>
          <div className="col-sm-10 col-sm-offset-1">
            <div className="listingBorder">
              <div className="thumbnail">
                <img className="img-responsive center-block"
                  src={listing.image}
                />
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-12">
                  <div className="col-sm-10 col-sm-offset-1">
                    <h2>{listing.location.address}, {listing.location.city}, {listing.location.country}</h2>
                    <h3>Price: ${listing.pricePerNight} / night</h3>
                    <hr />
                    <h3>Contact Info: </h3>
                    <h4>Email: {listing.creator.email}</h4>
                    <h4>Phone Number: {listing.creator.phoneNumber}</h4>
                    <hr />
                    <h4>Dates Available: {listing.datesAvailable}</h4>
                  </div>
                </div>
              </div>

            </div>
            <br />
          </div>
        </div>
      );
    }
    return (
      <div>Loading...... </div>
    );
  };
}
function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo, listing: state.listing.listing};
}
export default connect(mapStateToProps, actions)(SingleListing);

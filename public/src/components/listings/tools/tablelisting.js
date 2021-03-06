import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import { browserHistory } from 'react-router'

class TableListing extends Component {
  handleClick() {
    let clickResult = this._id;
    browserHistory.push(`/listings/${clickResult}`);
  }
  render() {
    const {result } = this.props
    return (
        <tr key={result._id} onClick={this.handleClick.bind(result)} className='table-row'>
          <td>{result.title}</td>
          <td>{result.location.country}</td>
          <td>{result.location.city}</td>
          {result.location.usCity !== 'not valid' && <td>{result.location.usCity}</td>}
          <td>{result.location.address}</td>
          <td>${result.pricePerNight}</td>
          <td>{result.rating === 0 ? 'No Rating' : result.rating}</td>
        </tr>
    )
  };
}

module.exports = TableListing;

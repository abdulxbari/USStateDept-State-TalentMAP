import { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { get } from 'lodash';
import { BID_OBJECT } from 'Constants/PropTypes';
import BidTrackerCardTitle from '../BidTrackerCardTitle';


class BidTrackerCardTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm: false,
    };
  }

  onDeleteBid = () => {
    const { deleteBid, bid } = this.props;
    deleteBid(get(bid, 'position_info.id'));
  };

  render() {
    const { bid, hideDelete, showBidCount, useCDOView } = this.props;
    const { readOnly } = this.context;
    const { position_info } = bid;
    const position = get(bid, 'position_info.position');
    const bidStatistics = get(position_info, 'bid_statistics[0]') || {};
    const post = get(position, 'post') || {};
    const positionNumber = get(position, 'position_number');

    return (
      <div className="usa-grid-full padded-container-inner bid-tracker-title-container">
        <div className="bid-tracker-title-content-container">
          <BidTrackerCardTitle
            title={position.title}
            positionNumber={positionNumber}
            id={position_info.id}
            status={bid.status}
            bidStatistics={bidStatistics}
            post={post}
            showBidCount={showBidCount}
            bidCycle={position_info.bidcycle.name}
          />
        </div>
        <div className="bid-tracker-card-title-outer-container-right">
          <div className="bid-tracker-card-title-container-right">
            {bid.cdo_bid &&
              <div className="bid-tracker-question-text-container bid-tracker-cdo-submitted-container">
                <span>
                  <FontAwesome name="flag" /> Bid Submitted by CDO
                </span>
              </div>
            }
            <div className="bid-tracker-actions-container">
              {bid.can_delete && !hideDelete && (!readOnly || useCDOView) &&
                <button className="unstyled-button" onClick={this.onDeleteBid}>
                  <FontAwesome name="trash" />Remove from Bid List</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BidTrackerCardTop.contextTypes = {
  readOnly: PropTypes.bool,
};

BidTrackerCardTop.propTypes = {
  bid: BID_OBJECT.isRequired,
  deleteBid: PropTypes.func.isRequired,
  showBidCount: PropTypes.bool,
  hideDelete: PropTypes.bool,
  useCDOView: PropTypes.bool,
};

BidTrackerCardTop.defaultProps = {
  showBidCount: true,
  hideDelete: false,
  useCDOView: false,
};

export default BidTrackerCardTop;

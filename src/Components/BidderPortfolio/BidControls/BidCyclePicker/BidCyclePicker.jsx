import React, { Component } from 'react';
import Picky from 'react-picky';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import bowser from 'bowser';
import { filter, indexOf, isArray, map, throttle } from 'lodash';
import { format } from 'date-fns';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { bidderPortfolioSeasonsFetchData, bidderPortfolioSetSeasons } from 'actions/bidderPortfolio';
import ListItem from './ListItem';

// TODO - Running into an issue where the label/span element is also
// passing up an event almost concurrently (400ms difference).
// This only happens in IE11, so we add a leading throttle so that
// any additional events within 1000ms do not get called.
const browser = bowser.getParser(window.navigator.userAgent);
const isIE = browser.satisfies({ 'internet explorer': '<=11' });
const THROTTLE_MS = isIE ? 1000 : 0;

export function renderList({ items, ...rest }) {
  return items.map(item => {
    const props = {
      ...rest,
      key: item.id,
      item: item.description,
    };
    const DATE_FORMAT = 'MMM YYYY';
    const startDate = format(item.start_date, DATE_FORMAT);
    const endDate = format(item.end_date, DATE_FORMAT);

    if (startDate && endDate) {
      const label = (
        <span>
          <span>{item.description}</span>
          <div className="picky--sublabel picky--bold">
            {startDate} - {endDate}
          </div>
        </span>
      );
      props.customLabel = label;
    }
    return (
      <ListItem {...props} />
    );
  });
}

class BidCyclePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayValue: [],
    };
    this.selectMultipleOption = throttle(
      this.selectMultipleOption.bind(this),
      THROTTLE_MS,
      { trailing: false, leading: true },
    );
  }
  UNSAFE_componentWillMount() {
    // Only perform once in the session since this will rarely change.
    if (!this.props.seasons.length) {
      this.props.fetchSeasons();
    }
  }
  componentDidMount() {
    this.props.setSeasonsCb(this.getSeasons());
  }
  componentDidUpdate() {
    this.props.setSeasonsCb(this.getSeasons());
  }
  setSeasons() {
    const seasons = this.bidSeasonsToIds();
    this.props.setSeasons(seasons);
  }
  getSeasons() {
    const { arrayValue } = this.state;
    const { seasons } = this.props;
    const ids$ = isArray(seasons) ? [...seasons] : [];
    return filter(ids$, f => indexOf(arrayValue, f.description) > -1);
  }

  bidSeasonsToIds = () => {
    const { arrayValue } = this.state;
    const { seasons } = this.props;
    let ids$ = isArray(seasons) ? [...seasons] : [];
    ids$ = filter(ids$, f => indexOf(arrayValue, f.description) > -1);
    ids$ = map(ids$, m => m.id);
    return ids$;
  };

  selectMultipleOption(value) {
    this.setState({ arrayValue: value }, () => this.setSeasons());
  }
  render() {
    const { arrayValue } = this.state;
    const { seasons, isLoading, hasErrored } = this.props; // eslint-disable-line
    return (
      <div className="bid-cycle-picker-container usa-form">
        <div className="label">Bid Season:</div>
        <Picky
          placeholder="Select season(s)"
          value={arrayValue}
          options={seasons}
          onChange={this.selectMultipleOption}
          numberDisplayed={1}
          multiple
          dropdownHeight={600}
          renderList={renderList}
          disabled={isLoading}
        />
      </div>
    );
  }
}

BidCyclePicker.propTypes = {
  seasons: PropTypes.arrayOf(PropTypes.shape({})),
  isLoading: PropTypes.bool,
  hasErrored: PropTypes.bool,
  fetchSeasons: PropTypes.func.isRequired,
  setSeasons: PropTypes.func.isRequired,
  setSeasonsCb: PropTypes.func,
};

BidCyclePicker.defaultProps = {
  seasons: [],
  isLoading: false,
  hasErrored: false,
  setSeasonsCb: EMPTY_FUNCTION,
};

const mapStateToProps = state => ({
  seasons: state.bidderPortfolioSeasons,
  isLoading: state.bidderPortfolioSeasonsIsLoading,
  hasErrored: state.bidderPortfolioSeasonsHasErrored,
});

export const mapDispatchToProps = dispatch => ({
  fetchSeasons: () => dispatch(bidderPortfolioSeasonsFetchData()),
  setSeasons: (arr = []) => dispatch(bidderPortfolioSetSeasons(arr)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BidCyclePicker);

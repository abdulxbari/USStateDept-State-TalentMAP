import { Component } from 'react';
import { get, identity, keys, pickBy } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import BackButton from 'Components/BackButton';
import PositionDetailsItem from 'Components/PositionDetailsItem';
import OBCUrl from 'Components/OBCUrl';
import Spinner from 'Components/Spinner';
import { getPostName } from 'utilities';
import { NO_POST } from 'Constants/SystemMessages';
import { POSITION_DETAILS, EMPTY_FUNCTION } from 'Constants/PropTypes';
import { bureauBidsFetchData, bureauBidsAllFetchData, bureauBidsRankingFetchData, bureauBidsSetRanking, downloadBidderData } from 'actions/bureauPositionBids';
import { bureauPositionDetailsFetchData } from 'actions/bureauPositionDetails';
import ExportButton from '../ExportButton';
import PositionManagerBidders from '../PositionManagerBidders';

class PositionManagerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      hasLoaded: false,
      id: get(props, 'match.params.id'),
      ordering: 'bidder_grade',
      filters: {},
    };
  }

  UNSAFE_componentWillMount() {
    this.getPositionBids();
    this.props.getPositionDetails(this.state.id);
    this.props.getBidsRanking(this.state.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.bidsIsLoading && !nextProps.bidsIsLoading) {
      this.setState({ hasLoaded: true });
    }
  }

  onSort = sort => {
    this.setState({ ordering: sort }, () => {
      this.props.getAllBids();
      this.props.getBidsRanking(this.state.id);
    });
  }

  onFilter = (f, v) => {
    let { filters } = this.state;
    filters[f] = v;
    filters = pickBy(filters, identity);
    this.setState({ filters }, () => {
      this.getPositionBids();
      this.props.getBidsRanking(this.state.id);
    });
  }

  getPositionBids = () => {
    const { id, ordering, filters } = this.state;
    const query = {
      ...filters,
      ordering,
    };
    this.props.getBids(id, query);
    this.props.getAllBids(id, query);
  }

  setRanking = ranking => {
    const ranking$ = ranking.map(m => ({ ...m, cp_id: this.state.id }));
    this.props.setRanking(this.state.id, ranking$);
  }

  render() {
    const { id, hasLoaded, filters, ordering } = this.state;
    const { allBids, allBidsIsLoading, bids, bidsIsLoading, bureauPositionIsLoading,
      bureauPosition, ranking, rankingIsLoading } = this.props;
    const isProjectedVacancy = false;
    const isArchived = false;
    const OBCUrl$ = get(bureauPosition, 'position.post.post_overview_url');
    const title = get(bureauPosition, 'position.title');
    const filtersSelected = !!keys(filters).length;
    const filters$ = { ...filters, ordering };
    const isLoading$ = bidsIsLoading || allBidsIsLoading || rankingIsLoading;

    return (
      <div className="usa-grid-full profile-content-container position-manager-details">
        <div className="usa-grid-full profile-content-inner-container">
          {
            (!hasLoaded || bureauPositionIsLoading) ?
              <Spinner type="homepage-position-results" size="big" /> :
              <div>
                <div className="usa-grid-full">
                  <div className="usa-width-one-whole">
                    <div className="left-col">
                      <BackButton />
                    </div>
                    <div className="right-col">
                      <div className="export-button-container">
                        <ExportButton id={id} ordering={ordering} filters={filters} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile-content-inner-container position-manager-details--content">
                  <div className="usa-grid-full header-title-container padded-main-content">
                    <div className="position-details-header-title">
                      {isProjectedVacancy && <span>Projected Vacancy</span>}
                      {isArchived && <span>Filled Position</span>}
                      <h1>{title}</h1>
                    </div>
                    <div className="post-title">
                      Location: {getPostName(get(bureauPosition, 'position.post'), NO_POST)}
                      { !!OBCUrl$ && <span> (<OBCUrl url={OBCUrl$} />)</span> }
                    </div>
                  </div>
                  <PositionDetailsItem
                    details={bureauPosition}
                    hideHeader
                    hideContact
                  />
                  <div className="usa-grid-full">
                    <PositionManagerBidders
                      id={id}
                      bids={bids}
                      onSort={this.onSort}
                      onFilter={this.onFilter}
                      bidsIsLoading={isLoading$}
                      ranking={ranking}
                      setRanking={this.setRanking}
                      filtersSelected={filtersSelected}
                      filters={filters$}
                      allBids={allBids}
                      isLocked={bureauPosition.is_locked}
                    />
                  </div>
                </div>
              </div>
          }
        </div>
      </div>
    );
  }
}

PositionManagerDetails.propTypes = {
  getBids: PropTypes.func,
  getAllBids: PropTypes.func,
  bids: PropTypes.arrayOf(PropTypes.shape({})),
  bidsIsLoading: PropTypes.bool,
  getPositionDetails: PropTypes.func,
  getBidsRanking: PropTypes.func,
  bureauPositionIsLoading: PropTypes.bool,
  bureauPosition: POSITION_DETAILS,
  ranking: PropTypes.arrayOf(PropTypes.shape({})),
  setRanking: PropTypes.func,
  allBids: PropTypes.arrayOf(PropTypes.shape({})),
  allBidsIsLoading: PropTypes.bool,
  rankingIsLoading: PropTypes.bool,
};

PositionManagerDetails.defaultProps = {
  getBids: EMPTY_FUNCTION,
  getAllBids: EMPTY_FUNCTION,
  getPositionDetails: EMPTY_FUNCTION,
  getBidsRanking: EMPTY_FUNCTION,
  setRanking: EMPTY_FUNCTION,
  bids: [],
  bidsIsLoading: false,
  bureauPositionIsLoading: false,
  bureauPosition: {},
  ranking: [],
  allBids: [],
  allBidsIsLoading: false,
  rankingIsLoading: false,
};

const mapStateToProps = (state) => ({
  bids: state.bureauPositionBids,
  bidsIsLoading: state.bureauPositionBidsIsLoading,
  bureauPositionIsLoading: state.bureauPositionDetailsIsLoading,
  bureauPosition: state.bureauPositionDetails,
  ranking: state.bureauPositionBidsRanking,
  allBids: state.bureauPositionBidsAll,
  allBidsIsLoading: state.bureauPositionBidsAllIsLoading,
  rankingIsLoading: state.bureauPositionBidsRankingIsLoading,
});

export const mapDispatchToProps = dispatch => ({
  getBids: (id, query) => dispatch(bureauBidsFetchData(id, query)),
  getAllBids: (id, query) => dispatch(bureauBidsAllFetchData(id, query)),
  getBidsRanking: id => dispatch(bureauBidsRankingFetchData(id)),
  getPositionDetails: (id) => dispatch(bureauPositionDetailsFetchData(id)),
  downloadBidderData: (id, query) => dispatch(downloadBidderData(id, query)),
  setRanking: (id, ranking) => dispatch(bureauBidsSetRanking(id, ranking)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PositionManagerDetails));

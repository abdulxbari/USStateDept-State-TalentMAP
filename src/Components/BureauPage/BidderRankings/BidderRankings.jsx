import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import FA from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import { fetchBidderRankings } from 'actions/bureauPositionBids';
import Spinner from '../../Spinner';

const BidderRankings = ({ perdet }) => {
  const [showRankingData, setShowRankingData] = useState(false);
  const [rankingData, setRankingData] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const bidderRankingData = useSelector(state => state.bureauBidderRankings);
  const bidderRankingDataIsLoading = useSelector(state => state.bureauBidderRankingsIsLoading);
  // eslint-disable-next-line no-unused-vars
  const bidderRankingDataHasErrored = useSelector(state => state.bureauBidderRankingsHasErrored);


  // Actions
  const dispatch = useDispatch();

  const positionTableHeaders = [
    'Rank',
    'Position',
    'Post',
    'Skill',
    'Grade',
    'Bid Cycle',
    'Date of Submission',
  ];

  function toggleRankingData() {
    setShowRankingData(!showRankingData);
  }

  useEffect(() => {
    if (showRankingData && isEmpty(rankingData)) {
      dispatch(fetchBidderRankings(perdet));
      setRankingData([':)']);
    }
  }, [showRankingData]);

  return (
    <div
      className={'bidder-rankings'}
    >
      <div className={'bidder-rankings-toggle'} >
        <InteractiveElement onClick={toggleRankingData}>
          View Bidder Ranking Data
          <FA name={showRankingData ? 'chevron-down' : 'chevron-right'} />
        </InteractiveElement>
      </div>
      {
        showRankingData &&
          <div className={'bidder-rankings-table-container'}>
            <div className={'arrow-down'} />
            {
              bidderRankingDataIsLoading &&
                <Spinner type="bidder-rankings-table" size="small" />
            }
            {
              !bidderRankingDataIsLoading && bidderRankingData.results &&
                <div>
                  <table className={'bidder-rankings-table'}>
                    <thead>
                      <tr className={'table-headers'}>
                        {
                          positionTableHeaders.map(item => (
                            <th
                              key={item}
                              className="ab-headers"
                              scope="col"
                            >
                              {item}
                            </th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        bidderRankingData.results.map(pos => (
                          <tr>
                            <td>{pos.ranking || 'unranked'}</td>
                            <td><Link to={`/profile/bureau/positionmanager/available/${pos.position.id}`}>{pos.position.title}</Link></td>
                            <td>{pos.position.post.location.country}</td>
                            <td>{pos.position.skill}</td>
                            <td>{pos.position.grade}</td>
                            <td>{pos.bidcycle}</td>
                            <td>{pos.submitted_date}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  <div>Number of Bids in other Bureau's ShortLists: {bidderRankingData['other-sl-bidcount']}</div>
                </div>
            }
          </div>
      }
    </div>
  );
};

BidderRankings.propTypes = {
  perdet: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default BidderRankings;

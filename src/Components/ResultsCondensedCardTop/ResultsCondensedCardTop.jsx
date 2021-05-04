import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import StaticDevContent from 'Components/StaticDevContent';
import { Tooltip } from 'react-tippy';
import { Handshake, CriticalNeed, HardToFill, ServiceNeedDifferential } from '../Ribbon';
import { POSITION_DETAILS, HOME_PAGE_CARD_TYPE } from '../../Constants/PropTypes';
import { NO_POST } from '../../Constants/SystemMessages';
import { getPostName, getBidStatisticsObject } from '../../utilities';

const ResultsCondensedCardTop = ({
  position,
  isProjectedVacancy,
  isRecentlyAvailable,
  isTandem,
}) => {
  let cardTopClass = '';
  let vacancyClass;
  let vacancyText;

  if (isProjectedVacancy) {
    vacancyClass = 'vacancy--projected';
    vacancyText = 'Projected Vacancy';
    cardTopClass = 'card-top-vacancy';
  } else if (isRecentlyAvailable) {
    vacancyClass = 'vacancy--recent';
    vacancyText = 'Now available';
  }
  const p = position.position || position;
  const stats = getBidStatisticsObject(position.bid_statistics);
  const hasHandshake = get(stats, 'has_handshake_offered', false);
  const isDifficultToStaff = get(position, 'isDifficultToStaff', false);
  const isServiceNeedDifferential = get(position, 'isServiceNeedDifferential', false);

  const title = get(position, 'position.title', '');

  const titleHeader = <h3>{title}</h3>;

  const link = `/${isProjectedVacancy ? 'vacancy' : 'details'}/${position.id}${isTandem ? '?tandem=true' : ''}`;

  const ribbons = (
    <div className="usa-grid-full post-ribbon-container">
      <div className="ribbon-container-condensed">
        {
          hasHandshake &&
          <Tooltip
            title="Handshake"
            offset={-30}
          >
            <Handshake showText={false} className="ribbon-condensed-card" />
          </Tooltip>
        }
        {
          <Tooltip
            title="Critical need"
            offset={-30}
          >
            <StaticDevContent>
              <CriticalNeed showText={false} className="ribbon-condensed-card" />
            </StaticDevContent>
          </Tooltip>
        }
        {
          isDifficultToStaff &&
          <Tooltip
            title="Hard to fill"
            offset={-30}
          >
            <StaticDevContent>
              <HardToFill showText={false} className="ribbon-condensed-card" />
            </StaticDevContent>
          </Tooltip>
        }
        {
          isServiceNeedDifferential &&
          <Tooltip
            title="Serive need differential"
            offset={-30}
          >
            <StaticDevContent>
              <ServiceNeedDifferential showText={false} className="ribbon-condensed-card" />
            </StaticDevContent>
          </Tooltip>
        }
      </div>

    </div>
  );

  const innerContent = (
    <div>
      {
        vacancyText &&
        <div className={`usa-grid-full condensed-card-top-header-container vacancy-text-container ${vacancyClass}`}>
          {vacancyText}
        </div>
      }
      <div className="usa-grid-full condensed-card-top-header-container">
        <div
          className={
            'usa-width-one-whole condensed-card-top-header condensed-card-top-header-left'
          }
        >
          { titleHeader }
        </div>
      </div>
      <div className="usa-grid-full post-ribbon-container">
        <div className="post-container">
          <span><span className="title">Location:</span> <span className="data">
            {
              isProjectedVacancy ?
                (p.organization || NO_POST) : getPostName(p.post, NO_POST)
            }
          </span></span>
        </div>
      </div>
    </div>
  );

  const containerProps = {
    className: `usa-grid-full condensed-card-top ${cardTopClass} condensed-card-top--clickable`,
  };

  return (
    <div {...containerProps}>
      {ribbons}
      <Link to={link} title="View details for this position">
        {innerContent}
      </Link>
    </div>
  );
};

ResultsCondensedCardTop.propTypes = {
  position: POSITION_DETAILS.isRequired,
  type: HOME_PAGE_CARD_TYPE,
  isProjectedVacancy: PropTypes.bool,
  isRecentlyAvailable: PropTypes.bool,
  isTandem: PropTypes.bool,
};

ResultsCondensedCardTop.defaultProps = {
  type: 'default',
  isProjectedVacancy: false,
  isRecentlyAvailable: false,
  isTandem: false,
};

export default ResultsCondensedCardTop;

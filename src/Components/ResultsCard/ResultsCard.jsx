import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get, isNumber } from 'lodash';
import { COMMON_PROPERTIES } from '../../Constants/EndpointParams';
import { Row, Column } from '../Layout';
import DefinitionList from '../DefinitionList';
import Favorite from '../../Containers/Favorite';
import BidListButton from '../../Containers/BidListButton';
import MediaQueryWrapper from '../MediaQuery';
import CompareCheck from '../CompareCheck/CompareCheck';
import LanguageList from '../LanguageList';
import BidCount from '../BidCount';

import { formatDate, propOrDefault, getPostName, getBidStatisticsObject } from '../../utilities';

import { POSITION_DETAILS, FAVORITE_POSITIONS_ARRAY, BID_RESULTS } from '../../Constants/PropTypes';
import {
  NO_BUREAU,
  NO_BID_CYCLE,
  NO_DANGER_PAY,
  NO_GRADE,
  NO_POST_DIFFERENTIAL,
  NO_POSITION_NUMBER,
  NO_POST,
  NO_SKILL,
  NO_TOUR_OF_DUTY,
  NO_UPDATE_DATE,
  NO_DATE,
  NO_USER_LISTED,
} from '../../Constants/SystemMessages';

const getResult = (result, path, defaultValue, isRate = false) => {
  let value = get(result, path, defaultValue);

  if ((/_date|date_/i).test(path) && value !== defaultValue) {
    value = formatDate(value);
  }

  if (isRate && isNumber(value)) {
    value = `${value}%`;
  }

  if (!value) {
    value = defaultValue;
  }

  return value;
};

const ResultsCard = (props) => {
  const options = {};
  const {
    id,
    result,
    onToggle,
    favorites,
    bidList,
  } = props;

  const title = propOrDefault(result, 'title');
  const position = getResult(result, 'position_number', NO_POSITION_NUMBER);
  const languages = getResult(result, 'languages', []);

  const language = (<LanguageList languages={languages} propToUse="representation" />);

  const post = getPostName(result.post, NO_POST);

  const stats = getBidStatisticsObject(result.bid_statistics);

  const sections = [
    /* eslint-disable quote-props */
    {
      'Bid cycle': getResult(result, 'latest_bidcycle.name', NO_BID_CYCLE),
      'Skill': getResult(result, 'skill', NO_SKILL),
      'Grade': getResult(result, 'grade', NO_GRADE),
      'Bureau': getResult(result, 'bureau', NO_BUREAU),
      'Post': post,
    },
    {
      'Tour of duty': getResult(result, 'post.tour_of_duty', NO_TOUR_OF_DUTY),
      'Language': language,
      'Post differential': getResult(result, 'post.differential_rate', NO_POST_DIFFERENTIAL, true),
      'Danger pay': getResult(result, 'post.danger_pay', NO_DANGER_PAY, true),
      'TED': getResult(result, 'current_assignment.estimated_end_date', NO_DATE),
      'Incumbent': getResult(result, 'current_assignment.user', NO_USER_LISTED),
    },
    {
      'Posted': getResult(result, COMMON_PROPERTIES.posted, NO_UPDATE_DATE),
      'Position number': position,
    },
    /* eslint-enable quote-props */
  ];

  options.favorite = {
    compareArray: favorites,
    refKey: result.id,
    hideText: true,
    hasBorder: true,
    useButtonClass: true,
    useButtonClassSecondary: true,
  };

  options.compare = {
    as: 'div',
    refKey: position,
    onToggle,
  };

  options.bidlistButton = {
    className: 'tm-button',
    id: result.id,
    compareArray: bidList,
  };

  return (
    <MediaQueryWrapper breakpoint="screenMdMax" widthType="max">
      {() => (
        <div id={id} className="results-card">
          <Row className="header" fluid>
            <Column columns="6">
              <h3>{title}</h3>
              <Link to={`/details/${result.position_number}`}>View position</Link>
            </Column>
            <Column columns="6">
              <BidCount bidStatistics={stats} altStyle />
            </Column>
          </Row>
          <Row id={`${id}-inner`} fluid>
            <Column columns="6">
              <DefinitionList items={sections[0]} />
            </Column>
            <Column columns="6">
              <DefinitionList items={sections[1]} />
            </Column>
          </Row>
          <Row className="footer results-card-padded-section" fluid>
            <Column>
              <Column className="divider" columns="8" as="section">
                {
                  !!favorites &&
                    <Favorite {...options.favorite} />
                }
                <BidListButton {...options.bidlistButton} />
                <CompareCheck {...options.compare} />
              </Column>
              <Column columns="4" as="section">
                <div>
                  <DefinitionList items={sections[2]} />
                </div>
              </Column>
            </Column>
          </Row>
        </div>
      )}
    </MediaQueryWrapper>
  );
};


ResultsCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  result: POSITION_DETAILS.isRequired,
  onToggle: PropTypes.func.isRequired,
  favorites: FAVORITE_POSITIONS_ARRAY,
  bidList: BID_RESULTS.isRequired,
};

ResultsCard.defaultProps = {
  favorites: [],
};

export default ResultsCard;

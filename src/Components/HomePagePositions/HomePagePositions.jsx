import React from 'react';
import PropTypes from 'prop-types';
import { HOME_PAGE_POSITIONS, USER_PROFILE, BID_RESULTS } from '../../Constants/PropTypes';
import HomePagePositionsSection from '../HomePagePositionsSection';

const HomePagePositions = ({ homePagePositions, homePagePositionsIsLoading,
  userProfile, toggleFavorite, toggleBid, bidList,
  userProfileFavoritePositionIsLoading,
  userProfileFavoritePositionHasErrored }) => {
  // set view more link for skill
  let viewMoreSkill = '/results';
  if (userProfile && userProfile.skills) {
    const ids = userProfile.skills.map(s => s.code);
    viewMoreSkill = `/results?skill__code__in=${ids.join(',')}`;
  }

  // set view more link for grade
  let viewMoreGrade = '/results';
  if (userProfile && userProfile.grade) {
    viewMoreGrade = `/results?grade__code__in=${userProfile.grade}`;
  }

  let positionsInSkillTitle = 'Positions in Skill';
  if (homePagePositions.isSkillCode && homePagePositions.isSkillCode.length) {
    positionsInSkillTitle = `Positions in ${homePagePositions.isSkillCode[0].skill}`;
  }

  let gradeTitle = 'Recently Posted Positions in Grade';
  if (homePagePositions.isGradeAndRecent && homePagePositions.isGradeAndRecent.length) {
    gradeTitle = `${gradeTitle} ${homePagePositions.isGradeAndRecent[0].grade}`;
  }

  // set view more link for service needs
  const serviceNeedsLink = '/results?post__has_service_needs_differential=true';
  return (
    <div className="homepage-positions-section-container">
      <div
        className="usa-grid-full homepage-positions-section-container-inner padded-main-content"
      >
        <HomePagePositionsSection
          title="Service Needs Positions"
          maxLength="3"
          viewMoreLink={serviceNeedsLink}
          icon="bolt"
          favorites={userProfile.favorite_positions}
          toggleFavorite={toggleFavorite}
          userProfileFavoritePositionIsLoading={userProfileFavoritePositionIsLoading}
          userProfileFavoritePositionHasErrored={userProfileFavoritePositionHasErrored}
          positions={homePagePositions.serviceNeedPositions}
          isLoading={homePagePositionsIsLoading}
          toggleBid={toggleBid}
          bidList={bidList}
          type="serviceNeed"
        />
        <HomePagePositionsSection
          title={positionsInSkillTitle}
          maxLength="3"
          viewMoreLink={viewMoreSkill}
          icon="briefcase"
          favorites={userProfile.favorite_positions}
          toggleFavorite={toggleFavorite}
          userProfileFavoritePositionIsLoading={userProfileFavoritePositionIsLoading}
          userProfileFavoritePositionHasErrored={userProfileFavoritePositionHasErrored}
          positions={homePagePositions.userSkillCodePositions}
          isLoading={homePagePositionsIsLoading}
          toggleBid={toggleBid}
          bidList={bidList}
          type="default"
        />
        <HomePagePositionsSection
          title={gradeTitle}
          maxLength="3"
          viewMoreLink={viewMoreGrade}
          icon="flag"
          favorites={userProfile.favorite_positions}
          toggleFavorite={toggleFavorite}
          userProfileFavoritePositionIsLoading={userProfileFavoritePositionIsLoading}
          userProfileFavoritePositionHasErrored={userProfileFavoritePositionHasErrored}
          positions={homePagePositions.userGradeRecentPositions}
          isLoading={homePagePositionsIsLoading}
          toggleBid={toggleBid}
          bidList={bidList}
          type="default"
        />
      </div>
    </div>
  );
};

HomePagePositions.propTypes = {
  homePagePositions: HOME_PAGE_POSITIONS.isRequired,
  homePagePositionsIsLoading: PropTypes.bool,
  userProfile: USER_PROFILE,
  toggleFavorite: PropTypes.func.isRequired,
  userProfileFavoritePositionIsLoading: PropTypes.bool.isRequired,
  userProfileFavoritePositionHasErrored: PropTypes.bool.isRequired,
  toggleBid: PropTypes.func.isRequired,
  bidList: BID_RESULTS.isRequired,
};

HomePagePositions.defaultProps = {
  userProfile: {},
  filtersIsLoading: false,
  homePagePositionsIsLoading: false,
};

export default HomePagePositions;
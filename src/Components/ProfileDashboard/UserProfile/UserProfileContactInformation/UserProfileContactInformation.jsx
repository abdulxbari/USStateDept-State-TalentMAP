import React from 'react';
import { get } from 'lodash';
import { USER_PROFILE } from 'Constants/PropTypes';
import { NO_EMAIL, NO_OFFICE_PHONE, NO_OFFICE_ADDRESS } from 'Constants/SystemMessages';
import SectionTitle from '../../SectionTitle';
import InformationDataPoint from '../../InformationDataPoint';
import StaticDevContent from '../../../StaticDevContent';

const UserProfileContactInformation = ({ userProfile }) => (
  <div className="current-user-section-container">
    <div className="section-padded-inner-container">
      <SectionTitle small title="Contact Information" icon="list-alt" />
      <InformationDataPoint title="Email address" content={<a href={`mailto:${get(userProfile, 'user.email')}`} >{get(userProfile, 'user.email') || NO_EMAIL}</a>} />
      <InformationDataPoint title="Office number" content={<a href={`tel:${get(userProfile, 'user_info.office_phone')}`} rel="nofollow">{get(userProfile, 'user_info.office_phone') || NO_OFFICE_PHONE}</a>} />
      <StaticDevContent>
        <InformationDataPoint title="Personal contact number" content={<a href="tel:+240-331-7189" rel="nofollow">+240-331-7189</a>} />
      </StaticDevContent>
      <InformationDataPoint
        title="Post/Office address"
        content={get(userProfile, 'user_info.office_address') || NO_OFFICE_ADDRESS}
      />
    </div>
  </div>
);

UserProfileContactInformation.propTypes = {
  userProfile: USER_PROFILE.isRequired,
};

UserProfileContactInformation.defaultProps = {
  showEditLink: true,
};

export default UserProfileContactInformation;

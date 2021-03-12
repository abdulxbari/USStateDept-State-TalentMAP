import { orderBy } from 'lodash';
import ClientBadge from '../ClientBadge';
import { CLASSIFICATIONS, CLIENT_CLASSIFICATIONS } from '../../../Constants/PropTypes';

const ClientBadgeList = ({ classifications, clientClassifications }) => (
  <div className="usa-grid-full client-badge-list">
    {orderBy(classifications, c => clientClassifications.includes(c.code), ['desc'])
      .slice(0, 4)
      .map((c) => {
        // need to update with te_id
        let checked = false;
        clientClassifications.forEach((item) => {
          // if (item.te_id === c.te_id) {
          if (item.tp_code === c.code || item.code === c.code) {
            checked = true;
          }
        });
        return (
          <ClientBadge
            key={c.code}
            type={c}
            status={checked}
          />
        );
      })
    }
  </div>
);

ClientBadgeList.propTypes = {
  classifications: CLASSIFICATIONS,
  clientClassifications: CLIENT_CLASSIFICATIONS,
};

ClientBadgeList.defaultProps = {
  classifications: [],
  clientClassifications: [],
};

export default ClientBadgeList;

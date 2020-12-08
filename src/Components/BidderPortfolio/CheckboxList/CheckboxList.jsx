/* eslint-disable no-console */
import { indexOf } from 'lodash';
import PropTypes from 'prop-types';
import CheckBox from '../../CheckBox';
import { CLASSIFICATIONS, CLIENT_CLASSIFICATIONS, EMPTY_FUNCTION } from '../../../Constants/PropTypes';

const CheckboxList = ({ list, clientClassifications, editMode, updateClassifications }) => (

  <div className="client-checkbox-list">
    <CheckBox
      id="key"
      label="Bidder Has Classification"
      small
      value
      key="key"
      disabled
      checked
      className="tm-checkbox-disabled-alternate"
    />
    {list.map((c) => {
      const checked = indexOf(clientClassifications, c.code) > -1;
      console.log(checked);
      return (
        <CheckBox
          id={c.code}
          label={c.text}
          small
          value={checked} // adds check marks when true
          // value
          key={c.code}
          disabled={editMode} // need to toggle when clicking pencil
          checked={checked}
          className="tm-checkbox-disabled-alternate"
          onChange={(h) => updateClassifications(h)}
        />
      );
    })
    }
  </div>
);

CheckboxList.propTypes = {
  list: CLASSIFICATIONS,
  clientClassifications: CLIENT_CLASSIFICATIONS,
  editMode: PropTypes.bool,
  updateClassifications: PropTypes.function,
};

CheckboxList.defaultProps = {
  isDisabled: false,
  list: [],
  clientClassifications: [],
  editMode: false,
  updateClassifications: EMPTY_FUNCTION,
};

export default CheckboxList;

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import FontAwesome from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import { CLASSIFICATIONS, CLIENT_CLASSIFICATIONS, EMPTY_FUNCTION } from 'Constants/PropTypes';
import { Row } from '../../Layout';
import CheckBox from '../../CheckBox';
import ClientBadge from '../ClientBadge';

const CheckboxList = ({ list, editView, updateClassifications,
  input }) => {
  const [showMore, setShowMore] = useState({});

  useEffect(() => {
    // setting up showMore vars
    list.forEach(showMoreVar => {
      if (showMoreVar.seasons.length > 1) {
        setShowMore(prevState => ({ ...prevState, [showMoreVar.text.split(' ')[0]]: false }));
      }
    });
  }, []);

  function updateShowMore(uniqShowMore) {
    const newVal = !showMore[uniqShowMore];
    setShowMore(prevState => ({ ...prevState, [uniqShowMore]: newVal }));
  }

  return (
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
        let checked = false;
        let uniqueShowMore = '';
        const multiBidSeasonFlag = c.seasons.length > 1;
        if (multiBidSeasonFlag) {
          uniqueShowMore = c.text.split(' ')[0];
        }
        input.forEach((item) => {
          c.seasons.forEach((cs) => { if (cs.id === item) checked = true; });
        });

        return (
          <div className="classifications-client-badges">
            {multiBidSeasonFlag &&
            <div>
              <Row className="usa-grid-full">
                <div className="usa-grid-full toggle-more-container">
                  <InteractiveElement className="toggle-more classifications-row" onClick={() => updateShowMore(uniqueShowMore)}>
                    <ClientBadge
                      // need to update key/id
                      // from tenured 4 so onChange/handleInput
                      // works correctly
                      key={'tenured4'}
                      type={c}
                      id={'tenured4'}
                      status={checked}
                      showShortCode={false}
                      editView={editView}
                    />
                    <div className="classifications-badges-text">
                      {c.text}
                    </div>
                    <FontAwesome
                      name={`chevron-${showMore[uniqueShowMore] ? 'down' : 'right'}`}
                    />
                  </InteractiveElement>
                </div>
                {
                  showMore[uniqueShowMore] &&
                  <div className="multiBidSeasonDropdown">
                    {c.seasons.map((m) => {
                      let multiBidSeasonChecked = false;
                      input.forEach((item) => { if (m.id === item) multiBidSeasonChecked = true; });
                      return (
                        <div className="multiBidSeason">
                          <ClientBadge
                            key={m.id}
                            type={c}
                            id={m.id}
                            status={multiBidSeasonChecked}
                            showShortCode={false}
                            onChange={updateClassifications}
                            editView={editView}
                          />
                          <div className="classifications-season-text">
                            {m.season_text}
                          </div>
                        </div>
                      );
                    })
                    }
                  </div>
                }
              </Row>
            </div>
            }
            {!multiBidSeasonFlag &&
              <div>
                <ClientBadge
                  key={c.seasons[0].id}
                  type={c}
                  id={c.seasons[0].id}
                  status={checked}
                  showShortCode={false}
                  onChange={updateClassifications}
                  editView={editView}
                />
                <div className="classifications-badges-text">
                  {c.text}
                </div>
              </div>
            }
          </div>
        );
      })
      }
    </div>
  );
};

CheckboxList.propTypes = {
  list: CLASSIFICATIONS,
  editView: PropTypes.bool,
  updateClassifications: PropTypes.function,
  input: CLIENT_CLASSIFICATIONS,
};

CheckboxList.defaultProps = {
  isDisabled: false,
  list: [],
  input: [],
  editView: false,
  updateClassifications: EMPTY_FUNCTION,
};

export default CheckboxList;

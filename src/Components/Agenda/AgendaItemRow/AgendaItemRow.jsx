import PropTypes from 'prop-types';
import { get } from 'lodash';
import FA from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import AgendaItemLegs from '../AgendaItemLegs';

const AgendaItemRow = props => {
  const {
    isFirst,
    fakeData,
  } = props;

  const pillColors = {
    Withdrawn: '#227c9dff',
    Disapproved: '#17c3b2ff',
    Approved: '#2d6e0eff',
    Deferred: '#E08A00',
    Removed: '#ed2038ff',
    Paused: '#6421a2ff',
    Cancelled: '#BA70FF',
  };

  fakeData.status =
    Object.keys(pillColors)[Math.floor(Math.random() * Object.keys(pillColors).length)];

  // eslint-disable-next-line no-console
  const createAI = () => { console.log('placeholder create AI'); };
  // eslint-disable-next-line no-console
  const editAI = () => { console.log('placeholder edit AI'); };
  return (
    <>
      {
        isFirst &&
        <div className="ai-history-row first-row">
          <div className="plusIcon">
            <InteractiveElement onClick={() => createAI()}>
              <FA name="plus-circle" />
            </InteractiveElement>
          </div>
        </div>
      }
      {
        <div className="ai-history-row" style={{ borderLeft: `20px solid ${pillColors[get(fakeData, 'status')]}` }}>
          <div className="ai-history-row-status-date">
            <div className="pill ai-history-row-pill" style={{ backgroundColor: pillColors[get(fakeData, 'status')] }}>
              {fakeData.status}
            </div>
            <div className="ai-history-row-panel-date">
              Panel Date: {fakeData.panelDate}
            </div>
          </div>
          <AgendaItemLegs fakeLegs={fakeData.legs} />
          <div className="ai-history-footer">
            <InteractiveElement onClick={() => editAI()}>
              <FA name="pencil" />
            </InteractiveElement>
          </div>
        </div>
      }
    </>
  );
};

AgendaItemRow.propTypes = {
  isFirst: PropTypes.bool,
  fakeData: PropTypes.shape({}),
};


AgendaItemRow.defaultProps = {
  isFirst: false,
  fakeData: {},
};

export default AgendaItemRow;

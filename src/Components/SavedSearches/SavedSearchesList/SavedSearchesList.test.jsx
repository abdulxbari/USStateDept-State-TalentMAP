import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import SavedSearchesList from './SavedSearchesList';
import searchObjectParent from '../../../__mocks__/searchObjectParent';

describe('SavedSearchesListComponent', () => {
  const props = {
    savedSearches: searchObjectParent,
    goToSavedSearch: () => {},
    deleteSavedSearch: () => {},
    deleteSearch: () => {},
    cloneSavedSearch: () => {},
    mappedParams: [],
  };

  it('is defined', () => {
    const wrapper = shallow(
      <SavedSearchesList
        {...props}
      />,
    );
    expect(wrapper).toBeDefined();
  });

  it('is defined after componentDidMount', () => {
    const wrapper = shallow(
      <SavedSearchesList
        {...props}
      />,
    );
    window.addEventListener = sinon.spy();
    wrapper.instance().componentDidMount();
    expect(wrapper).toBeDefined();
  });

  it('is defined after componentWillUnmount', () => {
    const wrapper = shallow(
      <SavedSearchesList
        {...props}
      />,
    );
    window.addEventListener = sinon.spy();
    wrapper.instance().componentWillUnmount();
    expect(wrapper).toBeDefined();
  });

  it('can receive props', () => {
    const wrapper = shallow(
      <SavedSearchesList
        {...props}
      />,
    );
    expect(wrapper.instance().props.savedSearches.results[0].id)
      .toBe(searchObjectParent.results[0].id);
  });

  it('displays an alert if there are no results', () => {
    const wrapper = shallow(
      <SavedSearchesList
        {...props}
        savedSearches={{ results: [] }}
      />,
    );
    expect(wrapper.find('NoSavedSearches').exists()).toBe(true);
  });
});

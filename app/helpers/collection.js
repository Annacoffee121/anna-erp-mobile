import _ from 'lodash'

export const find = (items, search) => {
    return _.find(items, {id: search.id});
};

export const findById = (items, id) => {
    return _.find(items, {id});
};

export const findIndex = (items, search) => {
    return _.findIndex(items, item => item.id === search.id);
};

export const findIndexById = (items, id) => {
    return _.findIndex(items, item => item.id === id);
};
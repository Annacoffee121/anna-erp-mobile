import {cloneDeep, pickBy, identity, merge} from 'lodash';
import systemReducers from '../reducers/system/default'

let {configurations} = systemReducers;
export const transformConfiguration = (configuration) => {
    let validConfigurations = pickBy(configuration.configurations, identity);
    return {
        fetched: true,
        ...merge(cloneDeep(configurations), validConfigurations)
    }
};
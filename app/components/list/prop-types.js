import PropTypes from 'prop-types';

export default {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowPress: PropTypes.func
}
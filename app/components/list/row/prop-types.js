import PropTypes from 'prop-types';

export default {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    rowPress: PropTypes.func
}
import PropTypes from 'prop-types';

export default {
    hasError: PropTypes.bool,
    onChange: PropTypes.func,
    onNavigate: PropTypes.func,
    defaultPayment: PropTypes.any,
    totalPaid: PropTypes.any,
    balancePayment: PropTypes.any,
}
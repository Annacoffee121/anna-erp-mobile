import validate from 'validate.js'
import {get, cloneDeep} from 'lodash'
import moment from 'moment'

let responseInterface =  {
    valid: true,
    messages: []
};

export function validateEmptyAnswers(question, value) {
    let response = cloneDeep(responseInterface);
    if (validate.isEmpty(value)) {
        response.valid = false;
        response.messages.push(`${question} is required`);
    }
    return response;
}

export function validateNumberAnswers(question, value) {
    let response = validateEmptyAnswers(question, value);
    if (!response.valid) return response;
    if (!validate.isNumber(value)) {
        response.valid = false;
        response.messages.push(`${question} is invalid`);
    }
    return response;
}

export function validateArrayAnswers(question, values) {
    let response = cloneDeep(responseInterface);
    if (!validate.isArray(values) || !values.length) {
        response.valid = false;
        response.messages.push(`${question} is required`);
    }
    return response;
}

export function validateArrayNumberAnswers(question, values) {
    let response = validateArrayAnswers(question, values);
    if (!response.valid) return response;
    let valid = true;
    values.forEach(value => {
        valid = validateNumberAnswers(value);
    });
    if (valid) return response;
    if (!validate.isArray(value)) {
        response.valid = false;
        response.messages.push(`${question} is invalid`);
    }
}

export function validateDateTimeAnswers(question, value, config = {}) {
    let response = validateEmptyAnswers(question, value);
    if (!response.valid) return response;
    let maxDate = get(config, 'max');
    let minDate = get(config, 'min');
    if (maxDate && moment(value) > moment(maxDate)) {
        response.valid = false;
        response.messages.push(`${question} is invalid`);
    }
    if (minDate && moment(value) < moment(minDate)) {
        response.valid = false;
        response.messages.push(`${question} is invalid`);
    }
    return response;
}

export function validateFileAnswers(question, value, config = {}) {
    return validateEmptyAnswers(question, value);
}

export function validateDropdownAnswers(question, value, config = {}) {
    return validateArrayNumberAnswers(question, value);
}
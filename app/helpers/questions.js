import {get, find, isString, first, map, set} from 'lodash';
import CoreValidate from 'validate.js'

import {
    validateArrayNumberAnswers,
    validateEmptyAnswers,
    validateNumberAnswers,
    validateDateTimeAnswers,
    validateFileAnswers,
    validateDropdownAnswers
} from './validation';

export function getAttributes(question, defaultOutput = []) {
    let attributes = get(question, 'properties.attributes');
    return attributes ? attributes : defaultOutput;
}

export function getAttribute(question, attributeName, defaultOutput = null) {
    let attributes = getAttributes(question);
    let attribute = find(attributes, {name: attributeName});
    return attribute ? get(attribute, 'value') : defaultOutput;
}

export function getOptions(question, defaultOutput = {}) {
    let options = get(question, 'properties.options');
    return options ? options : defaultOutput;
}

export function getOption(question, optionName, defaultOutput = null) {
    let options = getOptions(question);
    let option = get(options, optionName);
    return option ? option : defaultOutput;
}

export function validate(questions, answers) {
    let invalidQuestions = [];
    questions.forEach(formQuestion => {
        if (!getOption(formQuestion, 'required')) return;

        let validated = {};
        let formQuestionId = get(formQuestion, 'id');
        let questionName = getAttribute(formQuestion, 'name', get(formQuestion, 'question.title'));
        let formQuestionAnswers = get(answers, formQuestionId);

        switch (get(formQuestion, 'question.questionType.id')) {
            case 1:
                validated = validateEmptyAnswers(questionName, formQuestionAnswers);
                if (!validated.valid) {
                    invalidQuestions.push({
                        formQuestionId,
                        messages: validated.messages
                    });
                }
                break;
            case 2:
                validated = validateNumberAnswers(questionName, formQuestionAnswers);
                if (!validated.valid) {
                    invalidQuestions.push({
                        formQuestionId,
                        messages: validated.messages
                    });
                }
                break;
            case 3:
                validated = validateArrayNumberAnswers(questionName, formQuestionAnswers);
                if (!validated.valid) {
                    invalidQuestions.push({
                        formQuestionId,
                        messages: validated.messages
                    });
                }
                break;
            case 4:
                validated = validateDateTimeAnswers(questionName, formQuestionAnswers, {
                    mode: getOption(formQuestion, 'mode'),
                    max: getOption(formQuestion, 'max'),
                    min: getOption(formQuestion, 'min'),
                });
                if (!validated.valid) {
                    invalidQuestions.push({
                        formQuestionId,
                        messages: validated.messages
                    });
                }
                break;
            case 5:
                validated = validateFileAnswers(questionName, formQuestionAnswers);
                if (!validated.valid) {
                    invalidQuestions.push({
                        formQuestionId,
                        messages: validated.messages
                    });
                }
                break;
            case 6:
                validated = validateDropdownAnswers(questionName, formQuestionAnswers);
                if (!validated.valid) {
                    invalidQuestions.push({
                        formQuestionId,
                        messages: validated.messages
                    });
                }
                break;
            default:
                break;
        }
    });
    return invalidQuestions;
}

export function validateQuestion(formQuestion, formQuestionAnswers) {
    if (!getOption(formQuestion, 'required')) return {valid: true};
    let questionName = getAttribute(formQuestion, 'name', get(formQuestion, 'question.title'));

    switch (get(formQuestion, 'question.questionType.id')) {
        case 1:
            return validateEmptyAnswers(questionName, formQuestionAnswers);
        case 2:
            return validateNumberAnswers(questionName, formQuestionAnswers);
        case 3:
            return validateArrayNumberAnswers(questionName, formQuestionAnswers);
        case 4:
            return validateDateTimeAnswers(questionName, formQuestionAnswers, {
                mode: getOption(formQuestion, 'mode'),
                max: getOption(formQuestion, 'max'),
                min: getOption(formQuestion, 'min'),
            });
        case 5:
            return validateFileAnswers(questionName, formQuestionAnswers);
        case 6:
            return validateDropdownAnswers(questionName, formQuestionAnswers);
        default:
            return {valid: true}
    }
}

export function validateRuleActionCreator(rule, formAnswers) {
    let dependentAnswers = rule.dependentAnswers;
    let dependentFormAnswers = get(formAnswers, rule.dependentId);
    if (CoreValidate.isArray(dependentFormAnswers)) {
        let validAnswers = [];
        dependentFormAnswers.forEach(dependentAnswer => {
            validAnswers.push(validateActionAnswer(rule.actionCreatorId, dependentAnswers, dependentAnswer));
        });
        return !!validAnswers.filter(validAnswer => !!validAnswer).length;
    } else {
        return validateActionAnswer(rule.actionCreatorId, dependentAnswers, dependentFormAnswers);
    }
}

function validateActionAnswer(actionCreatorId, dependentAnswers, answer) {
    let withActionCreator = true;
    let validDependentAnswerKeys = [];
    switch (actionCreatorId) {
        case 1:
            withActionCreator = !answer;
            break;
        case 2:
            withActionCreator = !!answer;
            break;
        case 3:
            if (!answer) {
                withActionCreator = false;
                break;
            }
            validDependentAnswerKeys = [];
            dependentAnswers.forEach(dependentAnswer => {
                let valid = true;
                if (isNaN(answer)) {
                    valid = (answer === get(dependentAnswer, 'answerable.title'));
                } else {
                    valid = (answer === get(dependentAnswer, 'id'));
                }
                if (valid) validDependentAnswerKeys.push(valid);
            });
            withActionCreator = (validDependentAnswerKeys.length === dependentAnswers.length);
            break;
        case 4:
            if (!answer) {
                withActionCreator = false;
                break;
            }
            validDependentAnswerKeys = [];
            dependentAnswers.forEach(dependentAnswer => {
                let valid = true;
                if (isNaN(answer)) {
                    let title = get(dependentAnswer, 'answerable.title', '');
                    valid = answer.toLowerCase().indexOf(title.toLowerCase()) >= 0;
                } else {
                    valid = (answer === get(dependentAnswer, 'id'));
                }
                if (valid) validDependentAnswerKeys.push(valid);
            });
            withActionCreator = (validDependentAnswerKeys.length === dependentAnswers.length);
            break;
        case 5:
            withActionCreator = answer && map(dependentAnswers, 'id').indexOf(answer) >= 0;
            break;
        default:
            break;
    }
    return withActionCreator;
}

export function validateRuleAction(formQuestion, rule, validActionCreator) {
    let validRule = false;
    switch (rule.actionId) {
        case 1:
            validRule = !validActionCreator;
            break;
        case 2:
            validRule = true;
            if (validActionCreator) {
                set(formQuestion, 'properties.options.required', true);
            } else {
                set(formQuestion, 'properties.options.required', false);
            }
            break;
        case 3:
            validRule = true;
            if (!validActionCreator) break;
            let questionAnswers = get(formQuestion, 'questionAnswers', []);
            let ruleAnswers = map(get(rule, 'answers', []), 'id');
            questionAnswers = questionAnswers.filter(({answer}) => ruleAnswers.indexOf(answer.id) < 0);
            set(formQuestion, 'questionAnswers', questionAnswers);
            break;
        default:
            break;
    }
    return validRule;
}
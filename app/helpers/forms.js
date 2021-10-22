import {has, get, set, pick} from 'lodash';

export function transformForms(forms) {
    return forms.map(form => {
        return transformForm(form);
    });
}

export function transformForm(form) {
    let rowData = pick(form, [
        'id', 'name', 'status', 'description'
    ]);

    if (has(form, 'form_questions')) {
        set(rowData, 'formQuestions', transformFormQuestions(get(form, 'form_questions')));
    }

    return rowData;
}

export function transformFormQuestions(formQuestions) {
    return formQuestions.map(formQuestion => {
        return transformFormQuestion(formQuestion);
    });
}

export function transformFormQuestion(formQuestion) {
    let rowData = pick(formQuestion, [
        'id', 'title', 'properties', 'order'
    ]);

    if (has(formQuestion, 'question')) {
        set(rowData, 'question', transformQuestion(get(formQuestion, 'question')));
    }

    if (has(formQuestion, 'form_answer_groups')) {
        set(rowData, 'answerGroups', transformAnswerGroups(get(formQuestion, 'form_answer_groups')));
    }

    if (has(formQuestion, 'question_answers')) {
        set(rowData, 'questionAnswers', transformQuestionAnswers(get(formQuestion, 'question_answers')));
    }

    if (has(formQuestion, 'rules')) {
        set(rowData, 'rules', transformQuestionRules(get(formQuestion, 'rules')));
    }

    return rowData;
}

export function transformQuestionRules(rules) {
    return rules.map(rule => transformQuestionRule(rule));
}

export function transformQuestionRule(rule) {
    return {
        actionId: get(rule, 'action_id'),
        actionCreatorId: get(rule, 'action_creator_id'),
        answers: rule.answers.map(answer => ({
            id: answer.id,
            title: answer.answerable.title,
        })),
        dependentId: get(rule, 'dependent_id'),
        dependentAnswers: get(rule, 'dependent_answers', []).map(transformAnswer)
    }
}

export function transformQuestion(question) {
    let rowData = pick(question, [
        'id', 'title'
    ]);

    if (has(question, 'question_type')) {
        set(rowData, 'questionType', transformQuestionType(get(question, 'question_type')));
    }

    return rowData;
}

export function transformQuestionType(questionType) {
    return pick(questionType, [
        'id', 'name'
    ]);
}

export function transformQuestionAnswers(questionAnswers) {
    return questionAnswers.map(formQuestion => {
        return transformQuestionAnswer(formQuestion);
    });
}

export function transformQuestionAnswer(questionAnswer) {
    let rowData = pick(questionAnswer, [
        'id', 'title', 'properties'
    ]);

    if (has(questionAnswer, 'answer')) {
        set(rowData, 'answer', transformAnswer(get(questionAnswer, 'answer')));
    }

    return rowData;
}

export function transformAnswer(answer) {
    let rowData = pick(answer, [
        'id', 'properties'
    ]);

    if (has(answer, 'answerable')) {
        switch (get(answer, 'answerable_type')) {
            case 'App\\StateMachine\\TextAnswer':
                set(rowData, 'answerable', transformTextAnswerable(get(answer, 'answerable')));
                break;
            default:
                break;
        }
    }
    return rowData;
}

export function transformTextAnswerable(answerable) {
    return pick(answerable, [
        'id', 'title'
    ]);
}

export function transformAnswerGroups(answerGroups) {
    return answerGroups.map(transformAnswerGroup)
}

export function transformAnswerGroup(answerGroup) {
    return {
        id: get(answerGroup, 'answer_group_id'),
        answers: get(answerGroup, 'answer_group.answers', []).map(transformAnswerGroupAnswer)
    };
}

export function transformAnswerGroupAnswer(answerGroupAnswer) {
    return {
        title: get(answerGroupAnswer, 'pivot.properties.title'),
        answer: {
            id: get(answerGroupAnswer, 'id'),
            answerable: {
                id: get(answerGroupAnswer, 'answerable.id'),
                title: get(answerGroupAnswer, 'answerable.title'),
            }
        }
    };
}
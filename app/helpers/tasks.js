import * as _ from 'lodash';

export const transformTasks = (tasks) => {
    if(!tasks) return [];

    return tasks.map(task => {
        return transformTask(task);
    })
};

export const transformTask = (task, fulfil = true) => ({
    fulfil,
    id: task.id,
    status: task.status,
    name: _.get(task, 'issue.summary'),
    description: _.get(task, 'issue.description'),
    forms: transformTaskForms(_.get(task, 'survey.forms')),
});

export const transformTaskForms = (forms) => {
    if(!forms) return [];
    forms = _.orderBy(forms, ['order'], ['asc']);
    return forms.map(form => transformTaskForm(form))
};

export const transformTaskForm = (form) => {
    if(!form) return {};

    let options = form['answers'];
    if(_.isString(options)) {
        options = JSON.parse(options);
    }

    if (typeof options === 'string') options = [];
    form.options = options;
    form = _transformOptions(form);

    return {
        id: form['id'],
        name: form['id'].toString(),
        label: form['question'],
        options: form['options'],
        properties: form['properties'],
        type: form['form_element']['name'],
        pivot: form['pivot'] ? form['pivot'] : {},
        queue: form['queue'] ? form['queue'] : {},
    }
};

export const transformAttempt = (attempts) => {
    if(!attempts) return {};

    let answers = {};
    let attempt = _.first(attempts);
    attempt.forms.forEach(form => {
        let answer = null;
        try {
            answer = _mapAttemptAnswers(form, JSON.parse(form.pivot.answers));
        }catch (errors) {
            answer = _mapAttemptAnswers(form, form.pivot.answers);
        }
        if(!answer) return;
        answers[form.id] = answer;
    });
    return answers;
};

const _transformOptions = (item) => {
    switch (item['form_element']['name']) {
        default:
            return __basicOptionsTransformer(item);
        case 'Star Rating':
            return __starRatingOptionsTransformer(item);
        case 'Number rate':
            return __numberRateOptionsTransformer(item);
    }
};

const __basicOptionsTransformer = (item) => {
    item.options = item.options.map(option => {
        return {
            value: option,
            name: option
        }
    });
    return item;
};

const __starRatingOptionsTransformer = (item) => {
    if (_.get(item, 'properties.label_available')) {
        item.options = [];
    }
    return __basicOptionsTransformer(item);
};

const __numberRateOptionsTransformer = (item) => {
    if (!_.has(item, 'properties.numbers')) return [];
    let firstText = _.get(item, 'properties.first_text');
    let lastText = _.get(item, 'properties.last_text');

    let numbers = _.get(item, 'properties.numbers');
    numbers = parseInt(numbers);

    let options = _.times(numbers);
    item.options =  options.map((option, index) => {
        if (index === 0) {
            option = firstText + ' ( ' + (index + 1) + ' )';
        } else if (index === (options.length - 1)) {
            option = lastText + ' ( ' + (index + 1) + ' )';
        } else {
            option = (index + 1).toString();
        }

        return {
            value: option,
            name: option
        }
    });

    return item;
};

const _mapAttemptAnswers = (form, answers) => {
    let answer = null;

    if(form['form_element']['id'] === 12) {
        answer = _fileTypeAttemptTransform(answers);
    }else {
        answer = answers
    }

    return answer;
};

const _fileTypeAttemptTransform = (answers) => ({
    added: [],
    removed: [],
    submitted: answers,
});
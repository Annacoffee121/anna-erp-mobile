export function transformFormSubmissions(submissions) {
    return submissions.map(submission => transformFormSubmission(submission));
}

export function transformFormSubmission(submission) {
    return {
        ...submission
    }
}
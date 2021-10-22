export default auth = () => {
    return (next) => {
        return (action) => {
            // Add redirection
            return next(action);
        }
    }
};
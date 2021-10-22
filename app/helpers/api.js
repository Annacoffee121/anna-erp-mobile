export const authRoute = () => {
    return 'oauth/token';
};

export const apiRoute = (route) => {
    return 'api/' + route;
};

export const tenantRoute = (tenantId, route) => {
    return apiRoute('tenants/' + tenantId + '/' + route);
};
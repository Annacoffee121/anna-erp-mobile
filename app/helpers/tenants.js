export function transformTenants(tenants) {
    return tenants.map(transformTenant);
}

export function transformTenant(tenant) {
    return {
        id: tenant.id,
        name: tenant.name,
        isDefault: true
    }
}
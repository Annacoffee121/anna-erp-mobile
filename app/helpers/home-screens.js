import {first} from 'lodash';
import {transformPages} from './pages';
import {transformWards} from './wards';
import {transformForms, transformForm} from './forms';
import {transformContactGroups} from './contact-groups';

export function transformScreens(screens) {
    return screens.map(transformScreen);
}

export function transformScreen(screen) {
    let {
        id, name, description,
        is_default, user_tenant_screens
    } = screen;
    return {
        id,
        name,
        description,
        isDefault: is_default === 'Yes',
        items: [],
        userTenantScreen: user_tenant_screens.length ? first(transformUserTenantScreens(user_tenant_screens)) : null,
    }
}

export function transformScreenItems(items) {
    return items.map(transformScreenItem);
}

export function transformScreenItem(item) {
    let {
        id, name, description,
        icon_url, icon_order,
        forms, form, pages,
        contact_groups, wards,
    } = item;

    return {
        id,
        name,
        description,
        icon: icon_url,
        order: icon_order,
        form: form ? transformForm(form) : null,
        forms: forms.length ? transformForms(forms) : [],
        pages: pages.length ? transformPages(pages) : [],
        contactGroups: contact_groups.length ? transformContactGroups(contact_groups) : [],
        wards: wards.length ? transformWards(wards) : [],
    }
}

export function transformUserTenantScreens(screens) {
    return screens.map(transformUserTenantScreen)
}

export function transformUserTenantScreen({screen_id, user_id, tenant_id}) {
    return {
        screen_id,
        user_id,
        tenant_id
    }
}
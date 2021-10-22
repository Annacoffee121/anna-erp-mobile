import {baseRoute} from '../config/api';

export const profileImage = (id) => {
    return baseRoute + `/api/user/image/${id}`;
};
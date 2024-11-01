import { parseISO, differenceInYears } from 'date-fns';
import _ from 'lodash';

export const isAtLeast16YearsOld = (date: Date | null) => {
    if (!date) return false;
    const age = differenceInYears(new Date(), date);
    return age >= 16;
};

export const formatDateOfBirth = (date: any) => {
    if (!date) return null;
    return typeof date === 'string' ? parseISO(date) : date;
};

export const formatDatesInFormResponse = (data: any, paths: string[]) => {
    const formattedData = _.cloneDeep(data);
    paths.forEach((path) => {
        _.set(formattedData, path, formatDateOfBirth(_.get(formattedData, path)));
    });
    return formattedData;
};

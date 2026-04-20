export const parseFilter = (filter, ctx) => {
    if (typeof filter !== 'string') {
        filter = JSON.stringify(filter);
    }
    Object.keys(ctx).forEach((key) => {
        filter = filter.replaceAll(`"${key}"`, JSON.stringify(ctx[key]));
    });
    return JSON.parse(filter);
};
//# sourceMappingURL=parseFilter.js.map
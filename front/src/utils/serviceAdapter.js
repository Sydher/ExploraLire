export function createServiceAdapter(service) {
    return {
        getAll: service.getAllLabels || service.getAllSites || service.getAllPages,
        create: service.createLabel || service.createSite || service.createPage,
        update: service.updateLabel || service.updateSite || service.updatePage,
        delete: service.deleteLabel || service.deleteSite || service.deletePage,
    };
}

export function createLabelServiceAdapter(service) {
    return {
        getAll: service.getAllLabels,
        create: service.createLabel,
        update: service.updateLabel,
        delete: service.deleteLabel,
    };
}

export function createSiteServiceAdapter(service) {
    return {
        getAll: service.getAllSites,
        create: service.createSite,
        update: service.updateSite,
        delete: service.deleteSite,
    };
}

export function createPageServiceAdapter(service) {
    return {
        getAll: service.getAllPages,
        create: service.createPage,
        update: service.updatePage,
        delete: service.deletePage,
    };
}

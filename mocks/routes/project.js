const _ = require('underscore');

const projects = require('../fixtures/projects.json');
const project = require('../fixtures/project.json');
const tailoringcatalog = require('../fixtures/tailoringcatalog.json');
const signatures = require('../fixtures/signatures.json');

const tailoringstates = {
    CREATED: "AGREED",
    AGREED: "RELEASED",
    RELEASED: "RELEASED"
}

const _deepFind = (object, key, predicate) => {
    if (object.hasOwnProperty(key) && predicate(key, object[key]) === true) {
        return object
    }

    for (const element of Object.keys(object)) {
        const current = object[element];
        if (typeof current === "object" && current != null) {
            const result = _deepFind(current, key, predicate)
            if (result != null) {
                return result;
            }
        }
    }

    return null
}

const updateRequirementsState = (chapter, selected) => {
    _.each(chapter.data, (requirement, index, requirements) => updateRequirementState(requirement, selected));
    _.each(chapter.children, (subchapter, index, subchapters) => updateRequirementsState(subchapter, selected));
}

const updateRequirementState = (requirement, selected) => {
    requirement._links.selected.href = requirement._links.selected.href.replaceAll(
        JSON.parse(requirement.selected) ? 'false' : 'true',
        JSON.parse(selected) ? 'false' : 'true'
    );
    requirement.selected = JSON.parse(selected);
}

const updateTailoringName = (tailoring, newName) => {
    _.each(tailoring._links, (link, index, links) => {
        link.href = link.href.replaceAll(tailoring.name, newName);
    })
    tailoring.name = newName;
}

const updateTailoringState = (tailoring, newState) => {
    tailoring._links.state.href = tailoring._links.state.href.replaceAll(newState, tailoringstates[newState]);
    tailoring.state = newState;
}

const updateSignature = (signature, newSignature) => {
    signature.signee = newSignature.signee;
    signature.state = newSignature.state;
    signature.applicable = newSignature.applicable;
}

const createRequirement = (request) => {
    const position = request.params.requirement + "1";
    return {
        text: request.body.text,
        position: position,
        selected: true,
        changed: false,
        _links: {
            self: {"href":"/api/project/" + request.params.project + "/tailoring/"+ request.params.tailoring + "/catalog/" + request.params.chapter + "/" + position },
            selected: {"href":"/api/project/" + request.params.project + "/tailoring/"+ request.params.tailoring + "/catalog/" + request.params.chapter + "/" + position + "/selected/false" },
            text: {"href":"/api/project/" + request.params.project + "/tailoring/"+ request.params.tailoring + "/catalog/" + request.params.chapter + "/" + position + "/text" },
        }
    };
}

module.exports = [{
        id: "get-projects",
        url: "/api/project",
        method: "GET",
        variants: [{
                id: "json",
                type: "json",
                options: {
                    status: 200,
                    body: projects
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "get-project",
        url: "/api/project/:id",
        method: "GET",
        variants: [{
                id: "json",
                type: "json",
                options: {
                    status: 200,
                    body: project
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },

    {
        id: "post-project",
        url: "/api/catalog/:catalogversion/project",
        method: "POST",
        variants: [{
                id: "status",
                type: "status",
                options: {
                    status: 201
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "put-tailoringstate",
        url: "/api/project/:id/tailoring/:tailoring/state/:state",
        method: "PUT",
        variants: [{
                id: "middleware",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        const tailoring = _deepFind(
                            project.tailorings,
                            'name',
                            (k, v) => v === request.params.tailoring
                        );
                        updateTailoringState(tailoring, request.params.state)

                        response.status(200);
                        response.send(tailoring)
                    }
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "get-tailoringcatalog",
        url: "/api/project/:project/tailoring/:tailoring/catalog",
        method: "GET",
        variants: [{
                id: "json",
                type: "json",
                options: {
                    status: 200,
                    body: tailoringcatalog
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
   {
        id: "get-chapter",
        url: "/api/project/:project/tailoring/:tailoring/catalog/:chapter",
        method: "GET",
        variants: [{
                id: "middleware",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        const chapter = _deepFind(
                            tailoringcatalog.toc,
                            'key',
                            (k, v) => v === request.params.chapter

                        );

                        response.status(200);
                        response.send(chapter)
                    }
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "put-chapterrequirementsstate",
        url: "/api/project/:project/tailoring/:tailoring/catalog/:chapter/selected/:selected",
        method: "PUT",
        variants: [{
                id: "middleware",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        const chapter = _deepFind(
                            tailoringcatalog.toc,
                            'key',
                            (k, v) => v === request.params.chapter

                        );
                        updateRequirementsState(chapter, JSON.parse(request.params.selected));

                        response.status(200);
                        response.send(chapter)
                    }
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "put-requirementsstate",
        url: "/api/project/:project/tailoring/:tailoring/catalog/:chapter/:requirement/selected/:selected",
        method: "PUT",
        variants: [{
                id: "middleware",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        const chapter = _deepFind(
                            tailoringcatalog.toc,
                            'key',
                            (k, v) => v === request.params.chapter
                        );
                        const requirement = _deepFind(
                            chapter.data,
                            'position',
                            (k, v) => v === request.params.requirement
                        );
                        requirement.selected = request.params.selected;

                        response.status(200);
                        response.send(requirement)
                    }
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "put-requirementtext",
        url: "/api/project/:project/tailoring/:tailoring/catalog/:chapter/:requirement/text",
        method: "PUT",
        variants: [{
                id: "middleware",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        const chapter = _deepFind(
                            tailoringcatalog.toc,
                            'key',
                            (k, v) => v === request.params.chapter
                        );
                        const requirement = _deepFind(
                            chapter.data,
                            'position',
                            (k, v) => v === request.params.requirement
                        );
                        requirement.text = request.body.text;

                        response.status(200);
                        response.send(requirement)
                    }
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "post-requirement",
        url: "/api/project/:project/tailoring/:tailoring/catalog/:chapter/:requirement",
        method: "POST",
        variants: [{
                id: "middleware",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        const chapter = _deepFind(
                            tailoringcatalog.toc,
                            'key',
                            (k, v) => v === request.params.chapter
                        );
                        const requirement = _deepFind(
                            chapter.data,
                            'position',
                            (k, v) => v === request.params.requirement
                        );

                        const newRequirement = createRequirement(request)
                        const index = _.indexOf(chapter.data, requirement);
                        chapter.data.splice(index+1, 0, newRequirement);

                        response.status(200);
                        response.send(newRequirement)
                    }
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "put-tailoringname",
        url: "/api/project/:project/tailoring/:tailoring/name",
        method: "PUT",
        variants: [{
                id: "middleware",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        const tailoring = _deepFind(
                            project.tailorings,
                            'name',
                            (k, v) => v === request.params.tailoring
                        );
                        updateTailoringName(tailoring, request.body.name)

                        response.status(200);
                        response.send(tailoring);

                    }
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "get-documents",
        url: "/api/project/:project/tailoring/:tailoring/document",
        method: "GET",
        variants: [{
                id: "file",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        response.set('content-disposition', 'form-data; name="attachment"; filename="' + request.params.project + '-' + request.params.tailoring + '.zip');
                        response.status(200);
                        response.sendFile(process.cwd() + '/mocks/files/DEMO-master.zip')
                    }
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "get-document-catalog",
        url: "/api/project/:project/tailoring/:tailoring/document/catalog",
        method: "GET",
        variants: [{
                id: "file",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        response.set('content-disposition', 'form-data; name="attachment"; filename="' + request.params.project + '-DEMO-TX-1000-DV-Product Assurance Safety Sustainability Requirements-INTERNAL.pdf');
                        response.status(200);
                        response.sendFile(process.cwd() + '/mocks/files/DEMO-DEMO-TX-1000-DV-Product Assurance Safety Sustainability Requirements-INTERNAL.pdf')
                    }
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "get-signatures",
        url: "/api/project/:project/tailoring/:tailoring/signature",
        method: "GET",
        variants: [{
                id: "json",
                type: "json",
                options: {
                    status: 200,
                    body: signatures
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "put-signature",
        url: "/api/project/:project/tailoring/:tailoring/signature/:faculty",
        method: "PUT",
        variants: [{
                id: "middleware",
                type: "middleware",
                options: {
                    middleware: (request, response, next, core) => {
                        const signature = _deepFind(
                            signatures,
                            'faculty',
                            (k, v) => v === request.params.faculty
                        );
                        updateSignature(signature, request.body);

                        response.status(200);
                        response.send(signature);
                    }
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "get-tailoringcompare",
        url: "/api/project/:project/tailoring/:tailoring/compare",
        method: "GET",
        variants: [{
                id: "file",
                type: "file",
                options: {
                    status: 200,
                    headers: {
                        "content-disposition": "form-data; name=\"attachment\"; filename=\"DEMO-DEMO-TX-1000-DV-Tailoring-Diffs.pdf\""
                    },
                    path: "mocks/files/DEMO-DEMO-TX-1000-DV-Tailoring-Diffs.pdf"
                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                   host: "${process.env.API_PROXY}",
                }
            }
        ]
    },
    {
        id: "post-import",
        url: "/api/project/:project/tailoring/:tailoring/requirement/import",
        method: "POST",
        variants: [{
                id: "status",
                type: "status",
                delay: 1000,
                options: {
                    status: 202

                }
            },
            {
                id: "proxy",
                type: "proxy",
                options: {
                    host: "${process.env.API_PROXY}",
                }
            }
        ]
    },



]
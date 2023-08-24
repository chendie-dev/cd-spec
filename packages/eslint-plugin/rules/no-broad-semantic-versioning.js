const path = require('path')
module.exports = {
    name:'no-broad-semantic-versioning',
    meta: {
        type: "problem",
        fixable: null,
        messages: {
            noBroadSemanticVersioning: 'The "{{dependencyName}}" is not recommended to use "{{versioning}}"',
        }
    },

    create(context) {
        if (path.basename(context.filename) !== 'package.json') {
            return {}
        }
        //TODO: return? node?
        return {
            Property: function handleRequires(node) {
                if (
                    node.key &&
                    node.key.value &&
                    (node.key.value === 'dependencies' || node.key.value === 'devDependencies') &&
                    node.value &&
                    node.value.properties
                ) {
                    node.value.properties.forEach(property => {
                        const dependencyName = property.key.value
                        const denpendencyVersion = property.value.value
                        if (
                            denpendencyVersion.indexOf('*') > -1 ||
                            denpendencyVersion.indexOf('x') > -1 ||
                            denpendencyVersion.indexOf('>') > -1
                        ) {
                            context.report({
                                loc: property.loc,
                                messageId: 'noBroadSemanticVersioning',
                                data: {
                                    dependencyName,
                                    versioning: denpendencyVersion
                                }
                            })
                        }
                    });
                }
            }
        }
    }
}
/**
 * This function replaces import/export declarations from scss files with empty objects
 * since babel does not know how to parse SCSS files.
 */
const replace = (babel, path) => {
    const t = babel.types;
    if (path.node.source && path.node.source.value.match('.scss')) {
        // If there are named imports
        if (path.node.specifiers.length > 0) {
            // For each import, replace it with an assignment expression, assigning an empty object to it
            path.replaceWithMultiple(
                path.node.specifiers.map(({local}) => (
                    t.assignmentExpression('=', t.identifier(`const ${local.name}`), t.objectExpression([]))
                ))
            );
            // Otherwise, just remove the import declaration
        } else {
            path.remove();
        }
    }
};

module.exports = babel => ({
    name: 'ignore-styles',
    visitor: {
        ImportDeclaration(path) {
            replace(babel, path);
        },
        ExportDeclaration(path) {
            replace(babel, path);
        },
    },
});

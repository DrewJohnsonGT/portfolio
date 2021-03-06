const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        resolve: {
            modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        },
    });
};

const POSTS_QUERY = `{
    allMdx(
        filter: { fields: { collection: { eq: "posts"} } },
        limit: 500
    ) {
        edges {
            node {
                fields {
                    slug
                }
            }
        }
    }
}`;
const PROJECTS_QUERY = `{
    allMdx(
        filter: { fields: { collection: { eq: "projects"} } },
        limit: 500
    ) {
        edges {
            node {
                fields {
                    slug
                }
            }
        }
    }
}`;
exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;

    const PostComponent = path.resolve('./src/templates/post.js');
    const ProjectComponent = path.resolve('./src/templates/project.js');

    const blogQueryResult = await graphql(POSTS_QUERY);
    const projectQueryResult = await graphql(PROJECTS_QUERY);

    if (blogQueryResult.errors) {
        throw blogQueryResult.errors;
    }
    if (projectQueryResult.errors) {
        throw projectQueryResult.errors;
    }

    const posts = blogQueryResult.data.allMdx.edges;
    const projects = projectQueryResult.data.allMdx.edges;
    generatePages(posts, PostComponent, 'posts', createPage);
    generatePages(projects, ProjectComponent, 'projects', createPage);
};

function generatePages(pages, component, pathPrefix, createPage) {
    pages.forEach((page) => {
        const slug = page.node.fields.slug;
        createPage({
            path: `/${pathPrefix}/${slug}/`,
            component: component,
            context: {
                slug: page.node.fields.slug,
            },
        });
    });
}

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;
    if (node.internal.type === 'Mdx') {
        const fullFilePath = createFilePath({ node, getNode });
        // only want last directory name
        const splitPath = fullFilePath.split('/').filter(Boolean);
        const filePath = `${splitPath[splitPath.length - 1]}`;
        console.log(filePath);
        const parent = getNode(node.parent);
        createNodeField({
            node,
            name: 'slug',
            value: filePath,
        });
        createNodeField({
            node,
            name: 'collection',
            value: parent.sourceInstanceName,
        });
    }
};

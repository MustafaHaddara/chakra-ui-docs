import {
  ComputedFields,
  defineDocumentType,
  makeSource,
} from 'contentlayer/source-files';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import siteConfig from './configs/site-config';
import { getTableOfContents } from './src/utils/mdx-utils';
import { rehypeMdxCodeMeta } from './src/utils/rehype-code-meta';

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  editUrl: {
    type: 'string',
    resolve: (doc) => `${siteConfig.repo.editUrl}/${doc._id}`,
  },
};

const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blogs/**/*.mdx',
  bodyType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
  },
  computedFields: {
    ...computedFields,
    frontMatter: {
      type: 'json',
      resolve: (doc) => ({
        title: doc.title,
        description: doc.description,
        slug: `/${doc._raw.flattenedPath}`,
        headings: getTableOfContents(doc.body.raw),
      }),
    },
  },
}));

const Guides = defineDocumentType(() => ({
  name: 'Guide',
  filePathPattern: 'guides/**/*.mdx',
  bodyType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' } },
    author: { type: 'string', required: true },
  },
  computedFields: {
    ...computedFields,
    frontMatter: {
      type: 'json',
      resolve: (doc) => ({
        title: doc.title,
        description: doc.description,
        tags: doc.tags,
        author: doc.author,
        slug: `/${doc._raw.flattenedPath}`,
        headings: getTableOfContents(doc.body.raw),
      }),
    },
  },
}));

const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: 'docs/**/*.mdx',
  bodyType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    package: { type: 'string' },
    description: { type: 'string', required: true },
    image: { type: 'string' },
    version: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    frontMatter: {
      type: 'json',
      resolve: (doc) => ({
        title: doc.title,
        package: doc.package,
        description: doc.description,
        image: doc.image,
        version: doc.version,
        slug: `/${doc._raw.flattenedPath}`,
        headings: getTableOfContents(doc.body.raw),
      }),
    },
  },
}));

const FAQ = defineDocumentType(() => ({
  name: 'FAQ',
  filePathPattern: 'faqs/*.mdx',
  bodyType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
  },
  computedFields: {
    ...computedFields,
    frontMatter: {
      type: 'json',
      resolve: (doc) => ({
        title: doc.title,
        description: doc.description,
        slug: `/${doc._raw.flattenedPath}`,
        headings: getTableOfContents(doc.body.raw),
      }),
    },
  },
}));

const contentLayerConfig = makeSource({
  contentDirPath: 'pages',
  documentTypes: [Blog, Doc, Guides, FAQ],
  mdx: {
    rehypePlugins: [rehypeMdxCodeMeta],
    remarkPlugins: [remarkSlug, remarkGfm, remarkEmoji],
  },
});

export default contentLayerConfig;

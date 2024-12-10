import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'

import { image1 } from './image-1'
import { image2 } from './image-2'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
const collections = ['categories', 'media', 'posts']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not

  payload.logger.info(`*Clearing media...`)

  const mediaDir = path.resolve(__dirname, '../../media')
  if (fs.existsSync(mediaDir)) {
    fs.rmdirSync(mediaDir, { recursive: true })
  }

  /*payload.logger.info(`*Clearing collections and globals...`)

  // clear the database
  await Promise.all([
    ...collections.map(async collection =>
      payload.delete({
        collection: collection as 'media',
        where: {},
      }),
    ), // eslint-disable-line function-paren-newline
    ...globals.map(async global =>
      payload.updateGlobal({
        slug: global as 'header',
        data: {},
      }),
    ), // eslint-disable-line function-paren-newline
  ])*/

  payload.logger.info(`*Seeding demo author and user...`)

  await Promise.all(
    ['demo-author@payloadcms.com', 'demo-user@payloadcms.com'].map(async email => {
      await payload.delete({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      })
    }),
  )

  let [{ id: demoAuthorID }, { id: demoUserID }] = await Promise.all([
    await payload.create({
      collection: 'users',
      data: {
        email: 'demo-author@payloadcms.com',
        name: 'Demo Author',
        password: 'password',
        roles: ['admin'],
      },
    }),
    await payload.create({
      collection: 'users',
      data: {
        email: 'demo-user@payloadcms.com',
        name: 'Demo User',
        password: 'password',
        roles: ['user'],
      },
    }),
  ])

  // Explicitly convert IDs to strings
  demoAuthorID = String(demoAuthorID)
  demoUserID = String(demoUserID)

  payload.logger.info(`*Seeding media...`)

  const [image1Doc, image2Doc] = await Promise.all([
    await payload.create({
      collection: 'media',
      filePath: path.resolve(__dirname, 'image-1.jpg'),
      data: image1,
    }),
    await payload.create({
      collection: 'media',
      filePath: path.resolve(__dirname, 'image-2.jpg'),
      data: image2,
    }),
  ])

  payload.logger.info(`*Seeding categories...`)

  const [
    technologyCategory,
    newsCategory,
    financeCategory,
    designCat,
    softwareCat,
    engineeringCat,
  ] = await Promise.all([
    await payload.create({
      collection: 'categories',
      data: {
        title: 'Technology',
      },
    }),
    await payload.create({
      collection: 'categories',
      data: {
        title: 'News',
      },
    }),
    await payload.create({
      collection: 'categories',
      data: {
        title: 'Finance',
      },
    }),
    await payload.create({
      collection: 'categories',
      data: {
        title: 'Design',
      },
    }),
    await payload.create({
      collection: 'categories',
      data: {
        title: 'Software',
      },
    }),
    await payload.create({
      collection: 'categories',
      data: {
        title: 'Engineering',
      },
    }),
  ])

  let image1ID: string = String(image1Doc.id)
  let image2ID: string = String(image2Doc.id)

  if (payload.db.defaultIDType === 'text') {
    image1ID = `"${image1Doc.id}"`
    image2ID = `"${image2Doc.id}"`
    demoAuthorID = `"${demoAuthorID}"`
  }

  payload.logger.info(`* Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post1, categories: [technologyCategory.id] })
        .replace(/"\{\{IMAGE\}\}"/g, image1ID)
        .replace(/"\{\{AUTHOR\}\}"/g, demoAuthorID),
    ),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post2, categories: [newsCategory.id] })
        .replace(/"\{\{IMAGE\}\}"/g, image1ID)
        .replace(/"\{\{AUTHOR\}\}"/g, demoAuthorID),
    ),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post3, categories: [financeCategory.id] })
        .replace(/"\{\{IMAGE\}\}"/g, image1ID)
        .replace(/"\{\{AUTHOR\}\}"/g, demoAuthorID),
    ),
  })

  const posts = [post1Doc, post2Doc, post3Doc]

  // update each post with related posts

  try {
    await Promise.all([
      await payload.update({
        collection: 'posts',
        id: String(post1Doc.id),
        data: {
          relatedPosts: [String(post2Doc.id), String(post3Doc.id)],
        },
      }),
      payload.update({
        collection: 'posts',
        id: String(post2Doc.id),
        data: {
          relatedPosts: [String(post1Doc.id), String(post3Doc.id)],
        },
      }),
      payload.update({
        collection: 'posts',
        id: String(post3Doc.id),
        data: {
          relatedPosts: [String(post1Doc.id), String(post2Doc.id)],
        },
      }),
    ])
  } catch (error) {
    payload.logger.error(`Error creating/updating posts: ${error.message}`)
  }

  payload.logger.info('Seeded database successfully!')
}

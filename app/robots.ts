import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: ['https://devgg.me/sitemap.xml', 'https://devgg.me/blogs/sitemap.xml'],
    }
}

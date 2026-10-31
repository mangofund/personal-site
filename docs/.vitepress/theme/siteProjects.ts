/** 项目页正文仍写在 docs/projects/index.md。这里只给顶栏滚动条用，避免再抄一长段介绍。 */
export interface SiteProject {
  id: string
  nameZh: string
  nameEn: string
  pitchZh: string
  pitchEn: string
  /** 站内路径，不含语言前缀 */
  path: string
}

export const siteProjects: readonly SiteProject[] = [
  {
    id: 'xmade',
    nameZh: 'XMade',
    nameEn: 'XMade',
    pitchZh: '下载 X 上的推文、视频和长文',
    pitchEn: 'Save posts, videos, and articles from X',
    path: '/projects/'
  },
  {
    id: 'bing-wallpaper-for-mac',
    nameZh: '必应每日壁纸 for Mac',
    nameEn: 'Bing Wallpaper for Mac',
    pitchZh: '每天自动换上必应每日图片',
    pitchEn: 'The Bing daily photo as your desktop',
    path: '/ai/products/bing-wallpaper-for-mac'
  }
]

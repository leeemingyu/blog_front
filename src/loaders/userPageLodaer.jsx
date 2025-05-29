import { getPostList, getPopularPosts } from '../apis/postApi'

export async function postListLoader() {
  try {
    const [postListData, popularData] = await Promise.all([getPostList(0), getPopularPosts(0)])

    return {
      posts: postListData.posts,
      hasMore: postListData.hasMore,
      popularPosts: popularData.posts,
    }
  } catch (error) {
    throw new Error('데이터를 불러오는 데 실패했습니다.')
  }
}

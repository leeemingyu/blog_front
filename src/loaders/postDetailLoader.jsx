import { getPostDetail } from '../apis/postApi'

export async function postDetailLoader({ params }) {
  const { postId } = params
  try {
    const data = await getPostDetail(postId)
    return data
  } catch (error) {
    throw new Response('Failed to load post detail', { status: 500 })
  }
}

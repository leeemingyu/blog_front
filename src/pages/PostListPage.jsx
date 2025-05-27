import css from './postlistpage.module.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import PostCard from '../components/PostCard'
import { getPopularPosts, getPostList } from '../apis/postApi'
import PopularPost from '../components/PopularPost'
import { getRecentComments } from '../apis/commentApi'
import { useLoaderData, useNavigate } from 'react-router-dom'
import RecentComment from '../components/RecentComment'

export const PostListPage = () => {
  const { posts, hasMore, popularPosts } = useLoaderData()

  const [postList, setPostList] = useState(posts)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMoreState, setHasMoreState] = useState(hasMore)
  const [recentComments, setRecentComments] = useState([])
  const [recentLoading, setRecentLoading] = useState(false)
  const [error, setError] = useState(null)
  const listRef = useRef(null)
  const isLoading = loading && page === 0

  const observer = useRef()
  const lastPostElementRef = useCallback(
    node => {
      if (loading || !node) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMoreState) {
          setPage(prev => prev + 1)
        }
      })
      observer.current.observe(node)
    },
    [loading, hasMoreState]
  )

  useEffect(() => {
    if (page === 0) return
    const fetchNextPage = async () => {
      try {
        setLoading(true)
        const data = await getPostList(page)
        setPostList(prev => [...prev, ...data.posts])
        setHasMoreState(data.hasMore)
      } catch {
        setError('잠시 후 다시 시도해주세요')
      } finally {
        setLoading(false)
      }
    }
    fetchNextPage()
  }, [page])

  useEffect(() => {
    const fetchRecentComments = async () => {
      try {
        setRecentLoading(true)
        const data = await getRecentComments(page)
        setRecentComments(data)
      } catch {
        setError('잠시 후 다시 시도해주세요')
      } finally {
        setRecentLoading(false)
      }
    }
    fetchRecentComments()
  }, [])

  return (
    <div className={css.container}>
      <div className={css.bannerCon}>
        <div className={css.banner}></div>
      </div>
      <main className={css.postlistpage}>
        <div className={css.postListCon}>
          <div className={css.tabsCon}>
            <div className={css.tabs}>
              <div className={css.indicator}></div>
              <div className={`${css.tab} ${css.active}`}>전체</div>
            </div>
          </div>
          {error && <p className={css.errorMessage}>{error}</p>}
          {postList.length === 0 ? (
            <p className={css.noPostMessage}>아직 작성된 글이 없어요!</p>
          ) : (
            // ref
            <ul className={css.postList} ref={listRef}>
              {postList.map((post, i) => (
                <li key={post._id} ref={i === postList.length - 1 ? lastPostElementRef : null}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={css.trending}>
          <div className={css.topPosts}>
            <span className={css.trendingTitle}>인기있는 글</span>
            {popularPosts.map((post, i) => (
              <li key={post._id}>
                <PopularPost post={post} />
              </li>
            ))}
          </div>
          <div className={css.recentComments}>
            <span className={css.trendingTitle}>최근 댓글</span>
            {recentComments.length === 0 && recentLoading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => <RecentComment key={i} isLoading={true} />)
              : recentComments.map(comm => (
                  <RecentComment key={comm._id} comment={comm} isLoading={false} />
                ))}
          </div>
        </div>
      </main>
    </div>
  )
}

import css from './postlistpage.module.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import PostCard from '../components/PostCard'
import { getPopularPosts, getPostList } from '../apis/postApi'
import PopularPost from '../components/PopularPost'
import { getRecentComments } from '../apis/commentApi'
import { useNavigate } from 'react-router-dom'
import RecentComment from '../components/RecentComment'

export const PostListPage = () => {
  const [postList, setPostList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [popularPosts, setPopularPosts] = useState([])
  const [recentComm, setRecentComm] = useState([])

  // 페이지네이션을 위한 상태 추가
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const listRef = useRef(null)
  const observer = useRef()

  const navigate = useNavigate()

  const goDetail = postId => {
    navigate(`/detail/${postId}`)
  }

  // 마지막 게시물 요소를 감지하는 ref 콜백
  const lastPostElementRef = useCallback(
    node => {
      if (isLoading || !node) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1)
        }
      })

      observer.current.observe(node)
    },
    [isLoading, hasMore]
  )

  useEffect(() => {
    const fetchPostList = async () => {
      try {
        // 페이지가 0보다 크면 추가 데이터 로딩
        if (page > 0) setIsLoading(true)
        // 수정된 페이지 정보 전달
        const data = await getPostList(page)
        //
        setPostList(prev => (page === 0 ? data.posts : [...prev, ...data.posts]))
        setHasMore(data.hasMore)
      } catch (error) {
        console.error('목록조회 실패:', error)
        setError('글 목록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPostList()
  }, [page])

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const data = await getPopularPosts(page)
        setPopularPosts(data.posts)
        console.log(data.posts)
      } catch (error) {
        console.error('인기글 조회 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPopularPosts()

    const fetchRecentComments = async () => {
      try {
        const data = await getRecentComments(page)
        setRecentComm(data)
        console.log(data)
      } catch (error) {
        console.error('최신 댓글 조회 실패:', error)
      } finally {
        setIsLoading(false)
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
          {isLoading && page === 0 ? (
            <p>로딩중...</p>
          ) : postList.length === 0 ? (
            <p className={css.noPostMessage}>첫번째 글의 주인공이 되어주세요</p>
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
            {recentComm.map((comm, i) => (
              <li key={comm._id}>
                <RecentComment comment={comm} />
              </li>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

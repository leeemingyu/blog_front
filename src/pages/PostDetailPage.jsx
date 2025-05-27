import css from './postdetailpage.module.css'
import { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { getPostDetail, deletePost } from '../apis/postApi'
import { formatDate } from '../utils/features'
import { useSelector } from 'react-redux'
import { Comments } from '../components/Comments'
//
import LikeButton from '../components/LikeButton'
import commentIcon from '../assets/comment.svg'

export const PostDetailPage = () => {
  const postInfo = useLoaderData() // loader에서 받은 데이터
  const navigate = useNavigate()
  const username = useSelector(state => state.user.user.username)
  const { postId } = useParams()

  // 댓글 수 상태만 컴포넌트에서 관리
  const [commentCount, setCommentCount] = useState(postInfo.commentCount || 0)

  // 댓글 수 업데이트 함수
  const updateCommentCount = count => setCommentCount(count)

  const handleDeletePost = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deletePost(postInfo._id)
        alert('삭제되었습니다.')
        navigate('/') // location.href 대신 navigate 사용 추천
      } catch (error) {
        alert('삭제에 실패했습니다.')
        console.error(error)
      }
    }
  }

  return (
    <main className={css.postdetailpage}>
      <section>
        {postInfo.cover ? (
          <div className={css.detailimg}>
            <img src={`${import.meta.env.VITE_BACK_URL}/${postInfo?.cover}`} alt="" />
          </div>
        ) : (
          ''
        )}

        <h3>{postInfo?.title}</h3>
        <p className={css.count}>
          <span>{postInfo && <LikeButton postId={postId} likes={postInfo.likes} />}</span>
          <span style={{ marginLeft: '10px' }}>
            <img src={commentIcon} alt="commentIcon" />
            &nbsp;{commentCount}
          </span>
        </p>
        <div className={css.info}>
          <p className={css.author}>
            <Link to={`/userpage/${postInfo?.author}`}>{postInfo?.author}</Link>
          </p>
          <p className={css.date}>{formatDate(postInfo?.updatedAt)}</p>
        </div>
        <div className={css.summary}>{postInfo?.summary}</div>
        {/* Quill 에디터로 작성된 HTML 콘텐츠를 렌더링 */}
        <div
          className={`${css.content} ql-content`}
          dangerouslySetInnerHTML={{ __html: postInfo?.content }}
        ></div>
      </section>

      <section className={css.btns}>
        {/* 로그인한 사용자만 글을 수정, 삭제할 수 있습니다. */}
        {username === postInfo?.author && (
          <>
            <Link to={`/edit/${postId}`}>수정</Link>
            <span onClick={handleDeletePost}>삭제</span>
          </>
        )}
        <Link to="/">목록으로</Link>
      </section>

      {/* 업데이트된 Comments 컴포넌트에 commentCount와 updateCommentCount 함수 전달 */}
      <Comments
        postId={postId}
        commentCount={commentCount}
        onCommentCountChange={updateCommentCount}
      />
    </main>
  )
}

import css from './recentcomment.module.css'
import { useNavigate } from 'react-router-dom'

export default function RecentComment({ comment, isLoading }) {
  const navigate = useNavigate()

  const goDetail = () => {
    navigate(`/detail/${comment.postId._id}`)
  }
  if (isLoading) {
    return (
      <div className={css.recentComments}>
        <div className={css.commAuthor}></div>
        <div className={css.commContent}></div>
        <div className={css.commPostTitle}>
          <span></span>
        </div>
      </div>
    )
  }

  return (
    <div onClick={goDetail} className={css.recentComments}>
      <div className={css.commAuthor}>{comment.author}</div>
      <div className={css.commContent}>{comment.content}</div>
      <div className={css.commPostTitle}>
        <span>{comment.postId.title}</span>
      </div>
    </div>
  )
}

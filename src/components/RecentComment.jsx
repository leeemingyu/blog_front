import { Link } from 'react-router-dom'
import css from './recentcomment.module.css'
import { formatDate } from '../utils/features'
import { useNavigate } from 'react-router-dom'
import LikeButton from './LikeButton'

export default function RecentComment({ comment }) {
  const navigate = useNavigate()

  const goDetail = () => {
    navigate(`/detail/${comment.postId._id}`)
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

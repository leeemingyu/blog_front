import { Link } from 'react-router-dom'
import css from './postcard.module.css'
import { formatDate } from '../utils/features'
import { useNavigate } from 'react-router-dom'
import LikeButton from './LikeButton'

export default function PostCard({ post }) {
  const navigate = useNavigate()

  const goDetail = () => {
    navigate(`/detail/${post._id}`)
  }

  const handleAuthorClick = e => {
    e.stopPropagation()
  }

  return (
    <article className={css.postcard} onClick={goDetail}>
      <div className={css.info}>
        <span className={css.title}>{post.title}</span>
        <span className={css.dec}>{post.summary}</span>
        <span className={css.etc}>
          <time className={css.date}>{formatDate(post.createdAt)}</time>·{' '}
          <Link to={`/userpage/${post.author}`} onClick={handleAuthorClick} className={css.author}>
            {post.author}
          </Link>
          <LikeButton postId={post._id} likes={post.likes} />
          <span>💬</span>
          <span>{post.commentCount || 0}</span>
        </span>
      </div>
      <div className={css.post_img}>
        <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
      </div>
    </article>
  )
}

import css from './popularpost.module.css'
import { Link, useNavigate } from 'react-router-dom'

export default function PopularPost({ post }) {
  const navigate = useNavigate()

  const goDetail = () => {
    navigate(`/detail/${post._id}`)
  }

  return (
    <article className={css.postcard} onClick={goDetail}>
      <span className={css.title}>{post.title}</span>
      <span className={css.author}>{post.author}</span>
    </article>
  )
}

import { Header } from '../components/Header'
import css from './errorpage.module.css'

const ErrorPage = () => {
  return (
    <>
      <Header />
      <div className={css.errorCon}>
        오류가 발생했어요. <br />
        잠시 후 다시 시도해주세요.
      </div>
    </>
  )
}

export default ErrorPage

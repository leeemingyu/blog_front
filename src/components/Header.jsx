import css from './header.module.css'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setUserInfo } from '../store/userSlice'
import { getUserProfile, logoutUser } from '../apis/userApi'

export const Header = () => {
  const [isMenuActive, setIsMenuActive] = useState(false)

  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)
  const username = user?.username
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoading(true)
        const userData = await getUserProfile()
        if (userData) {
          dispatch(setUserInfo(userData))
        }
      } catch (err) {
        console.log(err)
        dispatch(setUserInfo(''))
      } finally {
        setIsLoading(false)
      }
    }
    getProfile()
  }, [dispatch])

  const handleLogin = async () => {
    closeMenu()
    navigate('/login')
  }
  const handleLogout = async () => {
    try {
      await logoutUser()
      dispatch(setUserInfo(''))
      setIsMenuActive(false)
      navigate('/', { replace: true })
    } catch (err) {
      console.log('프로필 조회 실패:', err)
      // 401 에러는 로그인 필요 상태이므로 정상 처리
      dispatch(setUserInfo(''))
    }
  }

  // 로딩 중일 때는 메뉴 표시하지 않음
  // if (isLoading) {
  //   return (
  //     <header className={`${css.headerCon} ${isMenuActive ? css.active : ''}`}>
  //       <div className={css.header}>
  //         <h1 className={css.logo}>
  //           <Link to={'/'}>TOKTOKLOG</Link>
  //         </h1>
  //       </div>
  //     </header>
  //   )
  // }

  const toggleMenu = () => {
    setIsMenuActive(prev => !prev)
  }
  const closeMenu = () => {
    setIsMenuActive(false)
  }
  // 배경 영역(gnbCon)만 클릭 시 닫히도록 하는 핸들러
  const handleBackgroundClick = e => {
    // 클릭된 요소가 css.gnbCon 클래스를 가진 요소와 동일할 때만 closeMenu 실행
    if (e.target === e.currentTarget) {
      closeMenu()
    }
  }

  // gnb 영역 클릭 시 이벤트 전파 중단
  const handleGnbClick = e => {
    e.stopPropagation()
  }
  return (
    <header className={`${css.headerCon} ${isMenuActive ? css.active : ''}`}>
      {/* <div className={`${css.header} ${isMenuActive ? css.active : ''}`}> */}
      <div className={css.header}>
        <h1 className={css.logo}>
          <Link to={'/'}>TOKTOKLOG</Link>
        </h1>
        <Hamburger isMenuActive={isMenuActive} toggleMenu={toggleMenu} />
        <nav className={css.gnbCon} onClick={handleBackgroundClick}>
          <div className={css.gnb} onClick={handleGnbClick}>
            {username ? (
              <>
                <MenuLike to="/createPost" label="글쓰기" closeMenu={closeMenu} />
                <MenuLike to={`/userpage/${username}`} label={`마이페이지`} closeMenu={closeMenu} />
                <button onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <>
                <button onClick={handleLogin}>로그인</button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

const MenuLike = ({ to, label, closeMenu }) => (
  <NavLink to={to} className={({ isActive }) => (isActive ? css.active : '')} onClick={closeMenu}>
    {label}
  </NavLink>
)

const Hamburger = ({ isMenuActive, toggleMenu }) => (
  <button className={`${css.hamburger} ${isMenuActive ? css.active : ''}`} onClick={toggleMenu}>
    {isMenuActive ? (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 13.4L7.09999 18.3C6.91665 18.4833 6.68332 18.575 6.39999 18.575C6.11665 18.575 5.88332 18.4833 5.69999 18.3C5.51665 18.1167 5.42499 17.8833 5.42499 17.6C5.42499 17.3167 5.51665 17.0833 5.69999 16.9L10.6 12L5.69999 7.09999C5.51665 6.91665 5.42499 6.68332 5.42499 6.39999C5.42499 6.11665 5.51665 5.88332 5.69999 5.69999C5.88332 5.51665 6.11665 5.42499 6.39999 5.42499C6.68332 5.42499 6.91665 5.51665 7.09999 5.69999L12 10.6L16.9 5.69999C17.0833 5.51665 17.3167 5.42499 17.6 5.42499C17.8833 5.42499 18.1167 5.51665 18.3 5.69999C18.4833 5.88332 18.575 6.11665 18.575 6.39999C18.575 6.68332 18.4833 6.91665 18.3 7.09999L13.4 12L18.3 16.9C18.4833 17.0833 18.575 17.3167 18.575 17.6C18.575 17.8833 18.4833 18.1167 18.3 18.3C18.1167 18.4833 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4833 16.9 18.3L12 13.4Z"
          fill="rgba(176, 184, 193, 1)"
        />
      </svg>
    ) : (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 24.4H25.4M7 16.2H25.4M7 8H25.4"
          stroke="rgba(176, 184, 193, 1)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )}
  </button>
)

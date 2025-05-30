import css from './registerpage.module.css'
import { useEffect, useState } from 'react'
import { loginUser } from '../apis/userApi'
import { Link, useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setUserInfo } from '../store/userSlice'

import KakaoLoginButton from '../components/KakaoLoginButton'

export const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errUsername, setErrUsername] = useState('')
  const [errPassword, setErrPassword] = useState('')

  const [loginStatus, setLoginStatus] = useState('') // 로그인 상태
  const [redirect, setRedirect] = useState(false) // 로그인 상태 메시지

  const isDisabled = !username || !password || !!errUsername || !!errPassword

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validateUsername = value => {
    if (!value) {
      setErrUsername('')
      return
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(value)) {
      setErrUsername('사용자명은 영문자로 시작하는 4자 이상의 영문자 또는 숫자여야 합니다.')
    } else {
      setErrUsername('')
    }
  }
  const validatePassword = value => {
    if (!value) {
      setErrPassword('')
      return
    }
    if (value.length < 4) {
      setErrPassword('비밀번호는 4자 이상이어야 합니다.')
    } else {
      setErrPassword('')
    }
  }
  const handleUsernameChange = e => {
    const value = e.target.value
    setUsername(value)
    validateUsername(value)
  }
  const handlePasswordChange = e => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }
  const login = async e => {
    e.preventDefault()
    setLoginStatus('')
    validateUsername(username)
    validatePassword(password)
    if (errPassword || errUsername || !username || !password) {
      setLoginStatus('아이디와 비밀번호를 확인하세요.')
      return
    }
    try {
      const userData = await loginUser({ username, password })

      if (userData) {
        setLoginStatus('로그인 성공')
        //
        dispatch(setUserInfo(userData))

        setTimeout(() => {
          setRedirect(true)
        }, 500)
      } else {
        setLoginStatus('사용자가 없습니다')
      }
    } catch (err) {
      console.error('로그인 오류---', err)
      return
    } finally {
      setLoginStatus(false)
    }
  }

  useEffect(() => {
    if (redirect) {
      navigate('/')
    }
  }, [redirect, navigate])
  return (
    <main className={css.authpage}>
      <form className={css.container} onSubmit={login}>
        <h2 className={css.title}>로그인</h2>

        <div className={css.inputWrapper}>
          <label htmlFor="userId" className={css.label}>
            아이디
          </label>
          <input
            id="userId"
            value={username}
            onChange={handleUsernameChange}
            type="text"
            className={errUsername ? css.error : ''}
          />
          <strong>{errUsername}</strong>
        </div>

        <div className={css.inputWrapper}>
          <label htmlFor="password" className={css.label}>
            비밀번호
          </label>
          <input
            id="password"
            value={password}
            onChange={handlePasswordChange}
            type="password"
            className={errPassword ? css.error : ''}
          />
          <strong>{errPassword}</strong>
        </div>
        <div className={css.buttonWrapper}>
          <Link to="/register" label="회원가입">
            회원가입
          </Link>
          <button type="submit" disabled={isDisabled}>
            로그인
          </button>
        </div>
      </form>
      {/* 소셜 로그인 섹션 추가 */}
      <div className={css.socialLogin}>
        <p>소셜 계정으로 로그인</p>
        <KakaoLoginButton />
      </div>
    </main>
  )
}

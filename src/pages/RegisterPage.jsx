import css from './registerpage.module.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../apis/userApi'
import KakaoLoginButton from '../components/KakaoLoginButton'

export const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordOk, setPasswordOk] = useState('')
  const [errUsername, setErrUsername] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errPasswordOk, setErrPasswordOk] = useState('')

  const [registerState, setRegisterState] = useState('')

  const isDisabled =
    !username || !password || !passwordOk || !!errUsername || !!errPassword || !!errPasswordOk

  const navigate = useNavigate()

  const validateUsername = value => {
    if (!value) {
      setErrUsername('사용자명을 입력해주세요.')
      return 'error'
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(value)) {
      setErrUsername('사용자명은 영문자로 시작하는 4자 이상의 영문자 또는 숫자여야 합니다.')
      return 'error'
    } else {
      setErrUsername('')
    }
  }
  const validatePassword = value => {
    if (!value) {
      setErrPassword('비밀번호를 입력해주세요.')
      return 'error'
    }
    if (value.length < 4) {
      setErrPassword('비밀번호는 4자 이상이어야 합니다.')
      return 'error'
    } else {
      setErrPassword('')
    }
  }
  const validatePasswordCheck = (value, current = password) => {
    if (!value) {
      setErrPasswordOk('비밀번호를 입력해주세요')
      return 'error'
    }
    if (value !== current) {
      setErrPasswordOk('비밀번호가 일치하지 않습니다.')
      return 'error'
    } else {
      setErrPasswordOk('')
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
  const handlePasswordOkChange = e => {
    const value = e.target.value
    setPasswordOk(value)
    validatePasswordCheck(value)
  }

  // 회원가입 버튼 클릭 시
  // 1. 유효성 검사
  // 2. 회원가입 API 호출
  // 3. 성공 시 로그인 페이지로 이동
  const register = async e => {
    e.preventDefault()
    console.log('회원가입', username, password, passwordOk)
    const usernameError = validateUsername(username)
    const passwordError = validatePassword(password)
    const passwordOkError = validatePasswordCheck(passwordOk, password)

    if (usernameError || passwordError || passwordOkError) {
      return
    }
    try {
      setRegisterState('등록중')

      const response = await registerUser({
        username,
        password,
      })
      console.log('회원가입 성공', response.data)

      setRegisterState('등록완료')
      navigate('/login')
    } catch (err) {
      setRegisterState('회원가입 실패')
      if (err.response) {
        console.log('오류 응답 데이터 --', err.response.data)
      }
    }
  }

  return (
    <main className={css.authpage}>
      <form className={css.container} onSubmit={register}>
        <h2 className={css.title}>회원가입</h2>

        <div className={css.inputWrapper}>
          <label htmlFor="userId" className={css.label}>
            아이디
          </label>
          <input
            id="userId"
            type="text"
            value={username}
            onChange={handleUsernameChange}
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
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className={errPassword ? css.error : ''}
          />
          <strong>{errPassword}</strong>
        </div>

        <div className={css.inputWrapper}>
          <label htmlFor="passwordOk" className={css.label}>
            비밀번호 확인
          </label>
          <input
            id="passwordOk"
            type="password"
            value={passwordOk}
            onChange={handlePasswordOkChange}
            className={errPasswordOk ? css.error : ''}
          />
          <strong>{errPasswordOk}</strong>
        </div>

        <div className={css.buttonWrapper}>
          <Link to="/login">로그인</Link>
          <button type="submit">가입하기</button>
        </div>
      </form>

      {/* 소셜 회원가입 섹션 추가 */}
      <div className={css.socialLogin}>
        <p>소셜 계정으로 간편하게 가입하기</p>
        <KakaoLoginButton />
      </div>
    </main>
  )
}

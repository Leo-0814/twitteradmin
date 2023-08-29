import { Link, useNavigate } from 'react-router-dom'
import AuthInput from '../component/AuthInput'
import logo from '../images/logo.png'
import { AuthContainer, AuthLinkContainer, AuthLinkSpan, AuthLinkText, AuthTitle } from '../component/common/auth.styled'
import { LogoIcon } from '../component/common/logo.styled'
import Button from '../component/Button'
import { useEffect, useState } from 'react'
import { login } from '../api/auth'
import Swal from 'sweetalert2'
import { getInfo } from '../api/info'


const LoginPage = () => {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleClick = async () => {
    if (account.length === 0 || password.length === 0) {
      return
    }

    try {
      const { success, token } = await login({account, password})
      if (success) {
        localStorage.setItem('token', token)
        Swal.fire({
          icon: 'success',
          title: '登入成功',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000,
          position: 'top'
        })
        navigate('/promotion')
        return
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const getInfoAsync = async () => {
      const adminToken = localStorage.getItem('adminToken')
      if (!adminToken) {
        navigate('/adminlogin')
        return
      }
      
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const res = await getInfo(token)
      if (res) {
        navigate('/promotion')
      } else {
        localStorage.removeItem('token')
      }
    }
    getInfoAsync()
  },[navigate])

  return (
    <AuthContainer>
      <LogoIcon src={logo} alt="logo"/>
      <AuthTitle>登入 Alphitter</AuthTitle>
        <AuthInput 
          value={account} name='account' placeholder='請輸入帳號' label='帳號' className='authInput' onChange={(accountInputValue) => setAccount(accountInputValue)}
        />
        <AuthInput 
          value={password} name='password' placeholder='請輸入密碼' label='密碼' type='number' className='authInput' onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />

      <Button className='authBtn' onClick={handleClick}>登入</Button>

      <AuthLinkContainer className='login-linkContainer'>
        <Link to='/signup'>
          <AuthLinkText >註冊</AuthLinkText>
        </Link>
        <AuthLinkSpan >． </AuthLinkSpan>
        <Link to='/admin'>
          <AuthLinkText onClick={() => {
            localStorage.removeItem('adminToken')
            navigate('adminlogin')  
          }}>後台登出</AuthLinkText>
        </Link>
      </AuthLinkContainer>
    </AuthContainer>
  )
}

export default LoginPage
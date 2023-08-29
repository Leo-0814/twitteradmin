import { useNavigate } from 'react-router-dom'
import AuthInput from '../component/AuthInput'
import { AuthContainer, AuthTitle } from '../component/common/auth.styled'
import Button from '../component/Button'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Login, getUsers } from '../api/admin'
import LogoIcon from '../component/LogoIcon'


const LoginPage = () => {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const gcode = 1478963
  const navigate = useNavigate()

  // 點擊登入
  const handleClick = async () => {
    if (account.length === 0 || password.length === 0) {
      return
    }

    try {
      const token = await Login({account, password, gcode})
      if (token) {
        localStorage.setItem('token', token)
        Swal.fire({
          icon: 'success',
          title: '登入成功',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000,
          position: 'top'
        })
        navigate('/posts')
        return
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 判斷token是否生效
  useEffect(() => {
    const getUsersAsync = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      try {
        const res = await getUsers(token)
        if (res) {
          navigate('/posts')
        }
      } catch (error) {
        console.log(error)
      }
    }
    getUsersAsync()
  },[navigate])

  return (
    <AuthContainer>
      <LogoIcon></LogoIcon>
      <AuthTitle>後台登入</AuthTitle>
        <AuthInput 
          value={account} name='account' placeholder='請輸入帳號' label='帳號' className='authInput' onChange={(accountInputValue) => setAccount(accountInputValue)}
        />
        <AuthInput 
          value={password} name='password' placeholder='請輸入密碼' label='密碼' type='number' className='authInput' onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />

      <Button className='authBtn' onClick={handleClick}>登入</Button>
    </AuthContainer>
  )
}

export default LoginPage
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native'
import { COLORS, ROUTES, VARS } from '../../constants'
import LogoImage from '../../../assets/images/logo.png'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setUserToken } from '../../store/reducers/userReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [infoMessage, setInfoMessage] = useState(false)
  const [msg, setMsg] = useState('')
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user')
        const storedToken = await AsyncStorage.getItem('token')
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser)
          const parsedToken = JSON.parse(storedToken)
          if (parsedUser._id && parsedToken) {
            dispatch(setUser(parsedUser))
            dispatch(setUserToken(parsedToken))
            navigation.navigate(ROUTES.HOME)
          }
        }
      } catch (error) {
        console.error('Error checking stored user:', error)
      }
    }
    checkUser()
  }, [])

  const handleLogin = async () => {
    try {
      if (email == '' || password == '') {
        setInfoMessage(false)
        setMsg('Please fill in all fields.')
        return
      }

      console.log(VARS.API_URL)
      const response = await axios.post(`${VARS.API_URL}/auth/login`, {
        email,
        password
      })

      if (!response.data.success) {
        setInfoMessage(false)
        setMsg(response.data.msg)
      } else {
        setInfoMessage(true)
        setMsg(response.data.msg)

        console.log(response.data)
        console.log(response.data.data)
        dispatch(setUserToken(response.data.data))
        try {
          const userSelfResponse = await axios.post(
            `${VARS.API_URL}/user`,
            {
              token: response.data.data
            },
            {
              headers: {
                Authorization: `Bearer ${response.data.data}`
              }
            }
          )
          console.log(userSelfResponse.data)
          if (!userSelfResponse.data.success) {
            setInfoMessage(false)
            setMsg(userSelfResponse.data.msg)
          } else {
            dispatch(setUser(userSelfResponse.data.data))
            navigation.navigate(ROUTES.HOME)
          }
        } catch (err) {
          setInfoMessage(false)
          setMsg(err.message)
        }
      }
    } catch (error) {
      if (error.response) {
        console.error('Server Error:', error.response.data)
        setMsg('Server Error. Please try again later.')
      } else if (error.request) {
        console.error('No Response:', error.request)
        setMsg('No response from server. Please check your connection.')
      } else {
        console.error('Error:', error.message)
        setMsg('Error occurred while logging in.')
      }
    }
  }

  const goToSignup = () => {
    navigation.navigate(ROUTES.SIGNUP) // Navigate to SignupScreen
  }

  return (
    <View style={styles.container}>
      <Image source={LogoImage} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder='Email'
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder='Password'
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSignup}>
        <Text style={styles.signupLink}>
          Don't have an account? Sign up here
        </Text>
      </TouchableOpacity>
      {msg ? (
        <View
          style={[
            styles.messageContainer,
            { backgroundColor: infoMessage ? 'green' : 'red' }
          ]}
        >
          <Text style={styles.messageText}>{msg}</Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#EEE',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.mainYellowL,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  buttonText: {
    color: COLORS.mainDark,
    fontSize: 18,
    fontWeight: 'bold'
  },
  signupLink: {
    marginTop: 20,
    color: '#007BFF'
  },
  messageContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    borderRadius: 5
  },
  messageText: {
    color: '#FFF',
    textAlign: 'center'
  }
})

export default LoginScreen

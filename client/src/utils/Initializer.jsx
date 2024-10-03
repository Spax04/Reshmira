import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { View, ActivityIndicator } from 'react-native'
import { initializeAppState } from './index' // Update the path accordingly

const Initializer = ({ children }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      await dispatch(initializeAppState())
      setLoading(false)
    }
    initialize()
  }, [dispatch])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return children
}

export default Initializer

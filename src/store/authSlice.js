import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: localStorage.getItem('token') !== null,
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload
    },
    userData: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
    },
  },
})

export const { login, userData, logout } = authSlice.actions
export default authSlice.reducer

export const logoutThunk = () => (dispatch) => {
  localStorage.clear()
  dispatch(logout())
}

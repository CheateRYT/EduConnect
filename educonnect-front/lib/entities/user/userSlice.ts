import { backendApiUrl } from '@/src/utils/backendApiUrl'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// Определяем интерфейс для пользователя
interface User {
	id: number
	token?: string
	role: string
	name: string
	login: string
	password?: string // Не обязательно возвращать пароль
	profilePicture?: string
	bio?: string
	subscription?: boolean
	subBuyTime?: Date | null
	subEndTime?: Date | null
}

// Определяем интерфейс для рекомендации
interface Recommendation {
	id: number
	title: string
	rating?: number
	description?: string
	createdAt: Date
	giverId: number // Идентификатор пользователя, который дает рекомендацию
	recipientId: number // Идентификатор пользователя, который получает рекомендацию
}

// Определяем состояние пользователя
interface UserState {
	user: User | null
	loading: boolean
	users: User[]
	recommendations: Recommendation[] // Добавляем массив рекомендаций
	error: string | null
}

const initialState: UserState = {
	user: null,
	users: [],
	recommendations: [], // Инициализируем массив рекомендаций
	loading: false,
	error: null,
}

// Регистрация пользователя
export const registerUser = createAsyncThunk<
	User,
	{ login: string; password: string; name: string; role: string }
>('user/register', async userData => {
	const response = await axios.post(`${backendApiUrl}/user/register`, userData)
	return response.data
})

// Вход пользователя
export const loginUser = createAsyncThunk<
	{ user: User; token: string },
	{ login: string; password: string }
>('user/login', async userData => {
	const response = await axios.post(`${backendApiUrl}/user/login`, userData)
	Cookies.set('token', response.data.token)
	return response.data
})

// Получение данных пользователя
export const getUser = createAsyncThunk<{ user: User }, { id: number }>(
	'user/getUser',
	async userData => {
		const token = Cookies.get('token')
		const response = await axios.get(`${backendApiUrl}/user/${userData.id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	}
)

// Обновление данных пользователя
export const updateUser = createAsyncThunk<
	{ user: User },
	{ updates: Partial<Omit<User, 'id' | 'token'>>; currentPassword?: string }
>('user/update', async ({ updates, currentPassword }) => {
	const token = Cookies.get('token')
	const response = await axios.post(
		`${backendApiUrl}/user/update`,
		{
			updates,
			currentPassword,
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)
	return response.data
})

// Создание рекомендации
export const createRecommendation = createAsyncThunk<
	Recommendation, // Используем тип Recommendation
	{ recipientId: number; title: string; description?: string; rating?: number }
>('user/createRecommendation', async recommendationData => {
	const token = Cookies.get('token')
	const response = await axios.post(
		`${backendApiUrl}/user/recommendation`,
		recommendationData,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)
	return response.data
})

// Получение всех пользователей
export const getUsers = createAsyncThunk<{ users: User[] }>(
	'user/getUsers',
	async () => {
		const token = Cookies.get('token')
		const response = await axios.get(`${backendApiUrl}/user/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	}
)

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			// Регистрация пользователя
			.addCase(registerUser.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || 'Ошибка регистрации'
			})
			// Вход пользователя
			.addCase(loginUser.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload.user
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || 'Вы ввели неправильные данные!'
			})
			// Получение данных пользователя
			.addCase(getUser.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload.user
			})
			.addCase(getUser.rejected, (state, action) => {
				state.loading = false
				state.error =
					action.error.message || 'Ошибка получения данных пользователя'
			})
			// Обновление данных пользователя
			.addCase(updateUser.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload.user
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.loading = false
				state.error =
					action.error.message || 'Ошибка обновления данных пользователя'
			})
			// Создание рекомендации
			.addCase(createRecommendation.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(createRecommendation.fulfilled, (state, action) => {
				state.loading = false
				state.recommendations.push(action.payload) // Добавляем новую рекомендацию в массив
			})
			.addCase(createRecommendation.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || 'Ошибка создания рекомендации'
			})
			// Получение всех пользователей
			.addCase(getUsers.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(getUsers.fulfilled, (state, action) => {
				state.loading = false
				state.users = action.payload.users // Обновляем список пользователей
			})
			.addCase(getUsers.rejected, (state, action) => {
				state.loading = false
				state.error =
					action.error.message || 'Ошибка получения списка пользователей'
			})
	},
})

export default userSlice.reducer

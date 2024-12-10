import axios from 'axios'
import { backendApiUrl } from './backendApiUrl'
export const validateToken = async (token: string) => {
	try {
		const response = await axios.get(`${backendApiUrl}/user/validate-token`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		return response.data.valid // Возвращает true или false
	} catch (error) {
		console.error('Ошибка при проверке токена:', error)
		return false // Если произошлаs ошибка, считаем токен недействительным
	}
}
export const getUser = async (token: string) => {
	try {
		const response = await axios.get(`${backendApiUrl}/user/validate-token`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		return response.data.user
	} catch (error) {
		console.error('Ошибка при получении user:', error)
		return false
	}
}

'use client'
import Header from '@/src/components/Header/Header'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import { getUser } from '@/src/utils/validateToken'
import axios from 'axios'
import Cookies from 'js-cookie'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './Profile.module.css'
import UpdateUserModal from './UpdateUserModal'

const Profile = () => {
	const router = useRouter()
	const [isMyProfile, setIsMyProfile] = useState<boolean>(false)
	const [recommendations, setRecommendations] = useState<any[]>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [user, setUser] = useState<any>(null)
	const [loading, setLoading] = useState<boolean>(true) // Состояние загрузки
	const profileId = useParams().profileId

	// Функция для получения данных пользователя
	const getUserRequest = async () => {
		try {
			const response = await axios.get(
				`${backendApiUrl}/user/getUser/${profileId}`
			)
			return response.data.user // Возвращаем пользователя
		} catch (error) {
			console.error('Ошибка при получении user:', error)
			return null // Возвращаем null в случае ошибки
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true) // Начинаем загрузку
			const token = Cookies.get('token')
			const fetchedUser = await getUserRequest() // Получаем пользователя
			if (fetchedUser) {
				setUser(fetchedUser) // Устанавливаем пользователя
				if (token) {
					const myUser = await getUser(token)
					if (myUser && fetchedUser) {
						if (myUser.id === fetchedUser.id) {
							setIsMyProfile(true) // Проверяем, является ли это мой профиль
						} else {
							setIsMyProfile(false)
						}
					}
				}
				// Получаем рекомендации для пользователя
				const recsResponse = await axios.get(
					`${backendApiUrl}/user/recommendations/${fetchedUser.id}`
				)
				setRecommendations(recsResponse.data.recommendations) // Устанавливаем рекомендации
			}
			setLoading(false) // Завершаем загрузку
		}
		fetchData()
	}, [profileId]) // Зависимость только от profileId

	const handleLogout = () => {
		Cookies.remove('token')
		router.push('/login')
	}

	const handleUpdateUser = (updatedUser: any) => {
		setUser(updatedUser)
		setIsModalOpen(false)
	}

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}
		return new Date(dateString).toLocaleDateString('ru-RU', options)
	}

	const getRoleName = (role: string) => {
		switch (role) {
			case 'EMPLOYER':
				return 'Работодатель'
			case 'TEACHER':
				return 'Преподаватель'
			case 'STUDENT':
				return 'Студент'
			default:
				return role // Если роль не распознана, возвращаем оригинальное значение
		}
	}

	if (loading) {
		return <div>Загрузка...</div> // Индикатор загрузки
	}

	if (!user) {
		return <div>Ошибка загрузки пользователя.</div> // Обработка ошибки, если пользователь не найден
	}

	return (
		<div>
			<Header />
			<div className={styles.profileContainer}>
				<h1 className={styles.profileTitle}>Профиль пользователя</h1>
				<div className={styles.profileInfo}>
					<Image
						src={user.profilePicture || '/default-image.webp'}
						alt='Profile'
						className={styles.profilePicture}
						width={150}
						height={150}
					/>
					<h2 className={styles.userName}>{user.name}</h2>
					<p className={styles.userInfo}>Роль: {getRoleName(user.role)}</p>
					{user.company && (
						<p className={styles.userInfo}>Компания: {user.company}</p>
					)}
					{user.bio && <p className={styles.userInfo}>О себе: {user.bio}</p>}
					{isMyProfile && (
						<>
							<button
								className={styles.updateButton}
								onClick={() => setIsModalOpen(true)}
							>
								Изменить данные
							</button>
							<button className={styles.logoutButton} onClick={handleLogout}>
								Выйти
							</button>
						</>
					)}
				</div>
				{/* Отображение рекомендаций */}
				<div className={styles.recommendationsContainer}>
					<h3 className={styles.recommendationsTitle}>Рекомендации</h3>
					{recommendations.length > 0 ? (
						<ul className={styles.recommendationsList}>
							{recommendations.map(rec => (
								<li key={rec.id} className={styles.recommendationItem}>
									<h4 className={styles.recomentTitle}>{rec.title}</h4>
									<p>{rec.description}</p>
									<p>Дата: {formatDate(rec.createdAt)}</p>
									<p>Рейтинг: {rec.rating}</p>
								</li>
							))}
						</ul>
					) : (
						<p className={styles.notrecomends}>Нет рекомендаций.</p>
					)}
				</div>
				<UpdateUserModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onUserUpdated={handleUpdateUser}
				/>
			</div>
		</div>
	)
}

export default Profile

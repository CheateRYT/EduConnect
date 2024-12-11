'use client'
import Header from '@/src/components/Header/Header'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import axios from 'axios'
import Cookies from 'js-cookie'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './CreateRecomend.module.css'
import CreateRecommendationModal from './CreateRecommendationModal' // Импортируем модальное окно

const CreateRecomend = () => {
	const [users, setUsers] = useState<any[]>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<any>(null)
	const router = useRouter()
	useEffect(() => {
		const fetchUsers = async () => {
			const token = Cookies.get('token')
			try {
				const response = await axios.get(`${backendApiUrl}/user`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}) // Убедитесь, что путь соответствует вашему API
				setUsers(response.data)
			} catch (error) {
				console.error('Ошибка при получении пользователей:', error)
			}
		}
		fetchUsers()
	}, [])

	const openRecommendationModal = (user: any) => {
		setSelectedUser(user)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedUser(null)
	}
	const handleClickCard = (id: string) => {
		router.push(`/profile/${id}`)
	}
	return (
		<div>
			<Header />{' '}
			<div className={styles.listContainer}>
				<h1 className={styles.title}>Список пользователей</h1>
				<div className={styles.usersContainer}>
					{users.map(user => (
						<div key={user.id} className={styles.userCard}>
							<h2
								className={styles.userName}
								onClick={() => {
									handleClickCard(user.id)
								}}
							>
								{user.name}
							</h2>
							<h3 className={styles.userBio}>{user.bio}</h3>
							<Image
								src={user.profilePicture || '/default-image.webp'}
								alt='Profile'
								className={styles.profilePicture}
								width={80} // Размеры для соответствия стилям
								height={80} // Размеры для соответствия стилям
							/>
							<button
								className={styles.recommendationButton}
								onClick={() => openRecommendationModal(user)}
							>
								Рекомендация
							</button>
						</div>
					))}
				</div>
				{isModalOpen && (
					<CreateRecommendationModal
						isOpen={isModalOpen}
						onClose={closeModal}
						user={selectedUser}
					/>
				)}
			</div>
		</div>
	)
}

export default CreateRecomend

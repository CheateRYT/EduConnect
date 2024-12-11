'use client'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import { getUser } from '@/src/utils/validateToken'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import styles from './UpdateUserModal.module.css'

interface UpdateUserModalProps {
	isOpen: boolean
	onClose: () => void
	onUserUpdated: (updatedUser: any) => void
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
	isOpen,
	onClose,
	onUserUpdated,
}) => {
	const [user, setUser] = useState<any>(null)
	const [name, setName] = useState('')
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [currentPassword, setCurrentPassword] = useState('')
	const [bio, setBio] = useState('')
	const [company, setCompany] = useState('')
	const [profilePicture, setProfilePicture] = useState('') // Новое состояние для аватарки

	useEffect(() => {
		const token = Cookies.get('token')
		if (token) {
			getUser(token).then(userData => {
				setUser(userData)
				// Устанавливаем начальные значения
				setName(userData.name)
				setLogin(userData.login)
				setBio(userData.bio)
				setCompany(userData.company)

				setProfilePicture(userData.profilePicture) // Устанавливаем аватарку
			})
		}
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const token = Cookies.get('token')
		const updates: any = {
			name,
			login,
			bio,
			company,

			profilePicture, // Добавляем путь к картинке
		}
		if (password) {
			updates.password = password
			updates.currentPassword = currentPassword
		}
		try {
			const response = await axios.post(
				`${backendApiUrl}/user/update`,
				updates,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			onUserUpdated(response.data.user)
			onClose()
		} catch (error) {
			console.error('Ошибка при обновлении пользователя:', error)
		}
	}

	if (!isOpen) return null
	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<h2 className={styles.modalTitle}>Изменить данные</h2>
				<form onSubmit={handleSubmit}>
					<label className={styles.label}>
						Имя
						<input
							className={styles.modalInput}
							type='text'
							placeholder='Имя'
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</label>
					<label className={styles.label}>
						Логин
						<input
							className={styles.modalInput}
							type='text'
							placeholder='Логин'
							value={login}
							onChange={e => setLogin(e.target.value)}
						/>
					</label>
					<label className={styles.label}>
						Новый пароль
						<input
							className={styles.modalInput}
							type='password'
							placeholder='Новый пароль'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</label>
					<label className={styles.label}>
						Текущий пароль
						<input
							className={styles.modalInput}
							type='password'
							placeholder='Текущий пароль'
							value={currentPassword}
							onChange={e => setCurrentPassword(e.target.value)}
						/>
					</label>
					<label className={styles.label}>
						О себе
						<textarea
							className={styles.modalTextarea}
							placeholder='О себе'
							value={bio}
							onChange={e => setBio(e.target.value)}
						/>
					</label>
					<label className={styles.label}>
						Путь к картинке
						<input
							className={styles.modalInput}
							type='text'
							placeholder='Путь к картинке'
							value={profilePicture}
							onChange={e => setProfilePicture(e.target.value)}
						/>
					</label>

					{user.role === 'EMPLOYER' && (
						<label className={styles.label}>
							Компания
							<input
								className={styles.modalInput}
								type='text'
								placeholder='Компания'
								value={company}
								onChange={e => setCompany(e.target.value)}
							/>
						</label>
					)}
					<button className={styles.modalButton} type='submit'>
						Сохранить
					</button>
					<button
						className={styles.modalButton}
						type='button'
						onClick={onClose}
					>
						Закрыть
					</button>
				</form>
			</div>
		</div>
	)
}

export default UpdateUserModal

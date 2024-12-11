'use client'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import styles from './CreateRecommendationModal.module.css'

interface CreateRecommendationModalProps {
	isOpen: boolean
	onClose: () => void
	user: any
}

const CreateRecommendationModal: React.FC<CreateRecommendationModalProps> = ({
	isOpen,
	onClose,
	user,
}) => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [rating, setRating] = useState<number>(0) // Устанавливаем начальное значение как 0
	const [error, setError] = useState<string | null>(null) // Для отображения ошибок

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null) // Сбрасываем ошибку перед отправкой
		try {
			const token = Cookies.get('token') // Предположим, что токен хранится в localStorage
			const response = await axios.post(
				`${backendApiUrl}/user/recommendation`,
				{
					recipientId: user.id,
					title,
					description,
					rating: rating || undefined, // Отправляем undefined, если rating равен 0
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			console.log(response)
			onClose() // Закрываем модальное окно после успешной отправки
		} catch (error) {
			console.error('Ошибка при создании рекомендации:', error)
			setError(
				'Ошибка при создании рекомендации. Пожалуйста, попробуйте еще раз.'
			) // Устанавливаем сообщение об ошибке
		}
	}

	if (!isOpen) return null
	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h2 className={styles.modalTitle}>
					Создать рекомендацию для {user.name}
				</h2>
				{error && <div className={styles.error}>{error}</div>}{' '}
				{/* Отображаем ошибку, если она есть */}
				<form onSubmit={handleSubmit}>
					<div>
						<label className={styles.label}>Заголовок:</label>
						<input
							type='text'
							className={styles.modalInput}
							value={title}
							onChange={e => setTitle(e.target.value)}
							required
						/>
					</div>
					<div>
						<label className={styles.label}>Описание:</label>
						<textarea
							className={styles.modalTextarea}
							value={description}
							onChange={e => setDescription(e.target.value)}
						/>
					</div>
					<div>
						<label className={styles.label}>Рейтинг:</label>
						<input
							type='number'
							className={styles.modalInput}
							value={rating}
							onChange={e => setRating(Number(e.target.value))}
							min={1}
							max={5}
						/>
					</div>
					<button type='submit' className={styles.modalButton}>
						Отправить
					</button>
					<button
						type='button'
						className={styles.closeButton}
						onClick={onClose}
					>
						Закрыть
					</button>
				</form>
			</div>
		</div>
	)
}

export default CreateRecommendationModal

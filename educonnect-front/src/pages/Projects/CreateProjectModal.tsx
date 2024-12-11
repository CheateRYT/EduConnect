'use client'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import styles from './CreateProjectModal.module.css' // Импортируем CSS модуль

interface CreateProjectModalProps {
	isOpen: boolean
	onClose: () => void
	onProjectCreated: () => void
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
	isOpen,
	onClose,
	onProjectCreated,
}) => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [maxParticipants, setMaxParticipants] = useState<number | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const token = Cookies.get('token')
		try {
			await axios.post(
				`${backendApiUrl}/project`,
				{
					title,
					description,
					maxParticipants,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			onProjectCreated() // Уведомить родительский компонент о создании проекта
			onClose() // Закрыть модальное окно
		} catch (error) {
			console.error('Ошибка при создании проекта:', error)
		}
	}

	if (!isOpen) return null

	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<h2 className={styles.modalTitle}>Создать проект</h2>
				<form onSubmit={handleSubmit}>
					<input
						className={styles.modalInput}
						type='text'
						placeholder='Название'
						value={title}
						onChange={e => setTitle(e.target.value)}
						required
					/>
					<textarea
						className={styles.modalTextarea}
						placeholder='Описание'
						value={description}
						onChange={e => setDescription(e.target.value)}
					/>
					<input
						className={styles.modalInput}
						type='number'
						placeholder='Макс. участники'
						value={maxParticipants ?? ''}
						onChange={e => setMaxParticipants(Number(e.target.value) || null)}
						required
					/>
					<button className={styles.modalButton} type='submit'>
						Создать проект
					</button>
					<button
						className={`${styles.modalButton} ${styles.modalCloseButton}`}
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

export default CreateProjectModal

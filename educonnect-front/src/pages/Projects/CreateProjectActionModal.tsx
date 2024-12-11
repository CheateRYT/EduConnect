'use client'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import styles from './CreateProjectActionModal.module.css' // Импортируем CSS модуль

interface CreateProjectActionModalProps {
	isOpen: boolean
	onClose: () => void
	projectId: string
	onActionCreated: () => void
}

const CreateProjectActionModal: React.FC<CreateProjectActionModalProps> = ({
	isOpen,
	onClose,
	projectId,
	onActionCreated,
}) => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [repositoryUrl, setRepositoryUrl] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const token = Cookies.get('token')
		try {
			await axios.post(
				`${backendApiUrl}/project/${projectId}/action`,
				{
					title,
					description,
					repositoryUrl,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			onActionCreated() // Уведомить родительский компонент о создании действия
			onClose() // Закрыть модальное окно
		} catch (error) {
			console.error('Ошибка при создании действия проекта:', error)
		}
	}

	if (!isOpen) return null

	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<h2 className={styles.modalTitle}>Создать действие проекта</h2>
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
						type='text'
						placeholder='URL репозитория'
						value={repositoryUrl}
						onChange={e => setRepositoryUrl(e.target.value)}
					/>
					<button className={styles.modalButton} type='submit'>
						Создать действие
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

export default CreateProjectActionModal

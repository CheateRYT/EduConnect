'use client'
// CreateVacancyModal.tsx
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import styles from './CreateVacancyModal.module.css' // Импортируем CSS модуль

interface CreateVacancyModalProps {
	isOpen: boolean
	onClose: () => void
	onVacancyCreated: () => void
}

const CreateVacancyModal: React.FC<CreateVacancyModalProps> = ({
	isOpen,
	onClose,
	onVacancyCreated,
}) => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [salary, setSalary] = useState<number | null>(null)
	const [workFormat, setWorkFormat] = useState<string | null>(null)
	const [address, setAddress] = useState<string | null>(null)
	const [schedule, setSchedule] = useState<string | null>(null)
	const [employmentType, setEmploymentType] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const token = Cookies.get('token')
		try {
			await axios.post(
				`${backendApiUrl}/vacancy`,
				{
					title,
					description,
					salary,
					workFormat,
					address,
					schedule,
					employmentType,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			onVacancyCreated() // Уведомить родительский компонент о создании вакансии
			onClose() // Закрыть модальное окно
		} catch (error) {
			console.error('Ошибка при создании вакансии:', error)
		}
	}

	if (!isOpen) return null

	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<h2 className={styles.modalTitle}>Создать вакансию</h2>
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
						placeholder='Зарплата'
						value={salary ?? ''}
						onChange={e => setSalary(Number(e.target.value) || null)}
					/>
					<input
						className={styles.modalInput}
						type='text'
						placeholder='Формат работы'
						value={workFormat ?? ''}
						onChange={e => setWorkFormat(e.target.value)}
					/>
					<input
						className={styles.modalInput}
						type='text'
						placeholder='Адрес'
						value={address ?? ''}
						onChange={e => setAddress(e.target.value)}
					/>
					<input
						className={styles.modalInput}
						type='text'
						placeholder='График работы'
						value={schedule ?? ''}
						onChange={e => setSchedule(e.target.value)}
					/>
					<input
						className={styles.modalInput}
						type='text'
						placeholder='Тип занятости'
						value={employmentType ?? ''}
						onChange={e => setEmploymentType(e.target.value)}
					/>
					<button className={styles.modalButton} type='submit'>
						Создать вакансию
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

export default CreateVacancyModal

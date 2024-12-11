'use client'
import Header from '@/src/components/Header/Header'
import { backendApiUrl } from '@/src/utils/backendApiUrl'
import { getUser } from '@/src/utils/validateToken'
import axios from 'axios'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import CreateProjectModal from './CreateProjectModal'
import styles from './Projects.module.css'

interface Project {
	id: number
	title: string
	description: string
	maxParticipants: number
	isCompleted: boolean
	creatorId: number
}

export default function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([])
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [userId, setUserId] = useState<number | null>(null)
	const [isTeacherOrEmployer, setIsTeacherOrEmployer] = useState<boolean>(false)
	const token = Cookies.get('token')
	async function fetchProjects() {
		try {
			const response = await axios.get<Project[]>(`${backendApiUrl}/project`)
			setProjects(response.data)
		} catch (error) {
			console.error('Error fetching projects:', error)
		}
	}

	useEffect(() => {
		fetchProjects()
	}, [])

	useEffect(() => {
		const token = Cookies.get('token')
		if (token) {
			getUser(token).then(user => {
				if (user.role === 'TEACHER' || user.role === 'EMPLOYER') {
					setIsTeacherOrEmployer(true)
				}
				setUserId(user.id) // Store the user's ID
			})
		}
	}, [])

	const handleProjectCreated = () => {
		fetchProjects() // Refresh the projects list after a new project is created
	}

	const handleDeleteProject = async (id: number) => {
		try {
			await axios.delete(`${backendApiUrl}/project/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			fetchProjects() // Refresh the list after deletion
		} catch (error) {
			console.error('Error deleting project:', error)
		}
	}

	const handleCompleteProject = async (id: number) => {
		try {
			await axios.put(
				`${backendApiUrl}/project/${id}/complete`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			fetchProjects() // Refresh the list after completion
		} catch (error) {
			console.error('Error completing project:', error)
		}
	}

	return (
		<div>
			<Header />
			<div className={styles.listContainer}>
				<h1 className={styles.title}>Список проектов</h1>
				{isTeacherOrEmployer && (
					<button
						onClick={() => setIsModalOpen(true)}
						className={styles.createProjectButton}
					>
						Создать проект
					</button>
				)}
				{projects.map(project => (
					<div key={project.id} className={styles.projectItem}>
						<Link className={styles.link} href={`/projects/${project.id}`}>
							{project.title}
						</Link>
						<p className={styles.projectDescription}>{project.description}</p>
						<p className={styles.projectMeta}>
							<span>Макс. участники: {project.maxParticipants}</span> |
							<span>
								{' '}
								Статус: {project.isCompleted ? 'Завершен' : 'В процессе'}
							</span>
						</p>
						{userId === project.creatorId && (
							<div>
								<button
									onClick={() => handleCompleteProject(project.id)}
									className={styles.completeProjectButton}
								>
									Завершить проект
								</button>
								<button
									onClick={() => handleDeleteProject(project.id)}
									className={styles.deleteProjectButton}
								>
									Удалить проект
								</button>
							</div>
						)}
						<hr />
					</div>
				))}
			</div>
			<CreateProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onProjectCreated={handleProjectCreated}
			/>
		</div>
	)
}

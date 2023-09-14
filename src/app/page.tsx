'use client'
import { useRouter, useSearchParams } from 'next/navigation'

import axios from 'axios'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ingredients } from '@/data/data'
import { getRandomFloat } from '@/lib/helpers'
import { useState } from 'react'

export default function Home() {
	const [weight, setWeight] = useState<string | null>(null)

	const router = useRouter()
	const searchParams = useSearchParams()
	console.log(searchParams.get('id'))

	const searchId = searchParams.get('id')

	const generateAndSetWeight = (): void => {
		const randomFloat = getRandomFloat()
		setWeight(randomFloat)
	}

	const saveWeight = async (): Promise<void> => {
		if (!weight) return

		try {
			const functionResponse = await axios.post(
				'https://doe-server-rtqm-dev.fl0.io/executeFunction',
				{
					searchId: searchId,
					weight,
				}
			)
			console.log('Function executed:', functionResponse.data)
			alert('Executed successfully and saved in OnBase')
		} catch (error) {
			console.error('Error executing the function', error)
			alert('Failed to execute the function.')
		}
	}

	return (
		<main className='py-12 px-24 bg-slate-900 text-slate-200'>
			<Table>
				<TableCaption>Caluclated Weight: {weight}</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[150px]'>Name</TableHead>
						<TableHead className=''>Description</TableHead>
						<TableHead>Price</TableHead>
						<TableHead className=''>Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{ingredients.map((item) => {
						return (
							<TableRow key={item.id}>
								<TableCell className='font-medium'>{item.name}</TableCell>
								<TableCell>{item.description}</TableCell>
								<TableCell>${item.price}</TableCell>
								<TableCell>{item.amount}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
			<div className='flex justify-center mt-2'>
				<Button
					variant='outline'
					className='mt-12 mx-2 rounded text-black hover:bg-black hover:text-white'
					onClick={generateAndSetWeight}
				>
					Calculate Weight
				</Button>

				<Button
					variant='outline'
					className='mt-12 mx-2 rounded text-black hover:bg-black hover:text-white'
					onClick={saveWeight}
				>
					Save Weight
				</Button>
			</div>
		</main>
	)
}

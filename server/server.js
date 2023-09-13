const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')

const config = require('./config/config.json')
const identity = require('./identity/identity')
const ApiTask = require('./apitasks/apitask')

app.use(express.json())
app.use(cors())

function executeFunction(searchId, weight) {
	identity
		.connect('nps.svc', 'P@ssw0rd')
		.then((token) => {
			console.log(token)
			identity
				.getCookie()
				.then((resp) => {
					//console.log(resp);
					const task = new ApiTask(
						identity,
						'API: Return Weight from Application'
					)
					task
						.getTask()
						.then((resp) => {
							console.log(resp.data)
							let item = resp.data.items.find(
								(item) => item.systemName == task.taskname
							)
							task.taskid = item.id
							console.log('TASK ID: ' + task.taskid)
							reqData = {
								allowedInteractions: [],
								data: {
									Relation: {
										TaskId: `${searchId}`,
									},
									Prop: {
										Weight: `${weight}`,
									},
								},
							}
							task
								.run(reqData)
								.then((resp) => console.log(resp))
								.catch((err) => console.error(err))
								.finally(() => {
									identity
										.disconnect()
										.then((resp) => console.log('Disconnected...'))
										.catch((err) => console.log('err'))
								})
						})
						.catch((err) => console.error(err))
				})
				.catch((err) => console.log(err))
				.finally(() => {
					identity
						.disconnect()
						.then((resp) => console.log('Disconnected...'))
						.catch((err) => console.log('err'))
				})
		})
		.catch((err) => console.error('err'))
}

app.post('/executeFunction', async (req, res) => {
	const { searchId, weight } = req.body

	if (!searchId || !weight) {
		return res.status(400).send({ error: 'searchId and weight are required.' })
	}

	try {
		await executeFunction(searchId, weight) // Pass the values to the function
		res.status(200).send({ message: 'Function executed successfully.' })
	} catch (error) {
		console.error('Error executing the function', error)
		res.status(500).send({ error: 'Failed to execute the function.' })
	}
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

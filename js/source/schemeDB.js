//схема данных
export default {
	column:{
		name:0,
		desc:1,
		create:2,
		end:3,
		fact_end:4,
		priority:5,
		status:6,
		user:7
	},
	status:{
		wait:0,
		do:1,
		done:2,
		lose:3
	},
	priority:{
		low:0,
		medium:1,
		high:2
	},
	user:{
		id:0,
		name:1,
		pass:2
	}
}
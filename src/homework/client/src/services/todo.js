import axios from "axios";

export default class{
		
	static create = async obj => {
		
		let result = {
			data: null,
			error: null
		};

		await axios
			.post(`${process.env.REACT_APP_API_URL}/item/`, obj)
			.then(resp => {
				if (resp.status === 200 || resp.status === 201) {
					result.data = resp.data;
				}
			})
			.catch(err => {
				result.error = err.response.data;
			});
		if(Array.isArray(result.data)){
		result.data=result.data[0];	
		}
		return result;
	
	};

	static updateStatus = async obj => {
		let result = {
			data: null,
			error: null
		};

		await axios
			.patch(`${process.env.REACT_APP_API_URL}/item/${obj.id}`, obj)
			.then(resp => {
				if (resp.status === 200 || resp.status === 201) {
					result.data = resp.data;
				}
			})
			.catch(err => {
				result.error = err.response.data;
			});

		return result;
	};

	static updateDate = async obj => {
		let result = {
			data: null,
			error: null
		};

		await axios
			.put(`${process.env.REACT_APP_API_URL}/item/date/${obj.id}`, obj)
			.then(resp => {
				if (resp.status === 200 || resp.status === 201) {
					result.data = resp.data;
				}
			})
			.catch(err => {
				result.error = err.response.data;
			});

		return result;
	};

	static getById = async itemId => {
		let result = {
			data: null,
			error: null
		};

		await axios
			.get(`${process.env.REACT_APP_API_URL}/item/${itemId}`)
			.then(resp => {
				if (resp.status === 200 || resp.status === 201) {
					result.data = resp.data;
				}
			})
			.catch(err => {
				result.error = err.response.data;
			});

		return result;
	};

	static getList = async () => {
		let result = {
			data: null,
			error: null
		};

		await axios
			.get(`${process.env.REACT_APP_API_URL}/item/`)
			.then(resp => {
				if (resp.status === 200 || resp.status === 201) {
					result.data = resp.data;
				}
			})
			.catch(err => {
				result.error = err.response.data;
			});

		return result;
	};

	static getSorted = async type => {
		let result = {
			data: null,
			error: null
		};

		await axios
			.get(`${process.env.REACT_APP_API_URL}/item/sort/${type}`)
			.then(resp => {
				if (resp.status === 200 || resp.status === 201) {
					result.data = resp.data;
				}
			})
			.catch(err => {
				result.error = err.response.data;
			});

		return result;
	};

	static getCount = async itemId => {
		let result = {
			data: null,
			error: null
		};

		await axios
			.get(`${process.env.REACT_APP_API_URL}/item/count/${itemId}`)
			.then(resp => {
				if (resp.status === 200 || resp.status === 201) {
					result.data = resp.data;
				}
			})
			.catch(err => {
				result.error = err.response.data;
			});

		return result;
	};

	static remove = async itemId => {
		let result = {
			data: null,
			error: null
		};

		await axios
			.delete(`${process.env.REACT_APP_API_URL}/item/${itemId}`)
			.then(resp => {
				if (resp.status === 200 || resp.status === 201) {
					result.data = resp.data;
				}
			})
			.catch(err => {
				result.error = err.response.data;
			});
		
		return result;
	};

	static removeAll = async () => {
		let result = {
			data: null,
			error: null
		};
		await axios
			.delete(`${process.env.REACT_APP_API_URL}/item`)
			.then(resp => {
				if (resp.status === 200 || resp.status === 201) {
					result.data = resp.data;
				}
			})
			.catch(err => {
				result.error = err.response.data;
			});

		return result;
		

	};
}

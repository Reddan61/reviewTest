import axios from "axios"

const instance = axios.create({
    withCredentials:true,
    baseURL:`http://localhost:8888/`
})


export const reviewsAPI = {
    getReviews: () => {
        return instance.get('/review/query').then(response => response.data)
    },
    addReview: (review,files) => {
        const formData = new FormData();
        for (let key in review){
            formData.append(key,review[key])
        }
        [].forEach.call(files,el => {
            formData.append('files',el)
        })
        return instance.post('/review/create',formData).then((response) => response.data)
    }
}
class ReviewModel {
    constructor() {
        this.reviews = []
    }

    getReviews() {
        return this.reviews;
    }
    addReview(review) {
        this.reviews.push(review);
        return this.reviews;
    }
}


const Reviews = new ReviewModel();


export default Reviews;
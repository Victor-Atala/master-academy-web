export class Review {
  constructor({
    id,
    courseId,
    courseTitle,
    userName,
    userAvatar,
    rating = 5,
    reviewText,
    tags = [],
    createdAt = null
  }) {
    this.id = id;
    this.courseId = courseId;
    this.courseTitle = courseTitle;
    this.userName = userName;
    this.userAvatar = userAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120';
    this.rating = Number(rating) || 5;
    this.reviewText = reviewText;
    this.tags = tags;
    this.createdAt = createdAt || new Date().toISOString().split('T')[0];
  }
}

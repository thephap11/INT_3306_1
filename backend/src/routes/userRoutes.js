
import { Router } from "express";
import { ping } from "../controllers/userController.js";
import { listFields, getField, createBooking, getBooking, updateBooking } from "../controllers/fieldController.js";
import { getReviews, createReview, getReviewStats, uploadImages } from "../controllers/reviewController.js";
import { uploadReviewImages, handleUploadErrors } from "../middleware/upload.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const r = Router();

r.get("/ping", ping);

r.get('/fields', listFields);
r.get('/fields/:id', getField);
r.post('/bookings', requireAuth, createBooking);
r.get('/bookings/:id', getBooking);
r.put('/bookings/:id', updateBooking);

r.post('/reviews/upload', requireAuth, uploadReviewImages, handleUploadErrors, uploadImages);
r.get('/reviews', getReviews);
r.post('/reviews', requireAuth, createReview);
r.get('/reviews/stats/:fieldId', getReviewStats);

export default r;

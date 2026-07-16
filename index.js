const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const initDB = require('./initDb');
const initBlogDB = require('./initBlogDb');
const initJobsDB = require('./initJobsDb');
const initCaseStudiesDB = require('./initCaseStudiesDb');
const initCtaDB = require('./initCtaDb');
const initProductsDB = require('./initProductsDb');
const initProductFiltersDB = require('./initProductFiltersDb');
const initAuthDB = require('./initAuthDb');
const initBlogSubscribersDB = require('./initBlogSubscribersDb');
require('dotenv').config();

// Route Imports
const contactRoutes = require('./routes/contactRoutes');
const blogRoutes = require('./routes/blogRoutes');
const jobRoutes = require('./routes/jobRoutes');
const caseStudyRoutes = require('./routes/caseStudyRoutes');
const ctaRoutes = require('./routes/ctaRoutes');
const productRoutes = require('./routes/productRoutes');
const productFilterRoutes = require('./routes/productFilterRoutes');
const authRoutes = require('./routes/authRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Databases
initDB();
initBlogDB();
initJobsDB();
initCaseStudiesDB();
initCtaDB();
initProductsDB();
initProductFiltersDB();
initAuthDB();
initBlogSubscribersDB();

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactMessage:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *         email: { type: string }
 *         country_code: { type: string }
 *         phone: { type: string }
 *         subject: { type: string }
 *         message: { type: string }
 *         created_at: { type: string, format: date-time }
 */

// Use Routes
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/cta', ctaRoutes);
app.use('/api/product-filters', productFilterRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscribers', subscriberRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

# Prime HR Solutions

A comprehensive HR management platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Complete admin panel for managing jobs and users
- **Job Management**: Add, edit, and delete job postings
- **Responsive Design**: Modern, mobile-friendly interface
- **Professional UI**: Clean and professional design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prime_hr_solution
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# Admin Credentials (REQUIRED)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/prime_hr_solutions

# Environment
NODE_ENV=development
```

**Important**: Replace `your_admin_username` and `your_secure_password` with secure credentials. These will be used to access the admin dashboard.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

- **Admin Login**: Navigate to `/admin` or `/admin/login`
- **Admin Dashboard**: `/admin/dashboard`
- **Job Management**: `/admin/dashboard/job`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_USERNAME` | Admin login username | Yes |
| `ADMIN_PASSWORD` | Admin login password | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Project Structure

```
src/
├── components/          # React components
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   ├── admin/          # Admin pages
│   └── auth/           # Authentication pages
├── models/             # MongoDB models
├── styles/             # Global styles
└── utils/              # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security Notes

- Admin credentials are stored in environment variables
- Never commit `.env.local` to version control
- Use strong, unique passwords for admin accounts
- Regularly update admin credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

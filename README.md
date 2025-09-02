# SharePay Restaurant Management System

A full-stack restaurant management system that handles menu management, order processing, and payment integration. Built with Django REST Framework for the backend and React for the frontend, with Odoo integration for advanced order management.

## Features

### Backend (Django REST Framework)
- **Menu Management**
  - Categorize menu items (Beef, Chicken, Vegan)
  - Detailed item descriptions and pricing
  - Image support for menu items

- **Order Processing**
  - Create and manage customer orders
  - Track order status (Pending, Preparing, Ready, Delivered, Cancelled)
  - Handle multiple order items per order
  - Real-time order status updates

- **Payment Integration**
  - Multiple payment methods (Cash, Card, Online)
  - Payment status tracking
  - Secure payment processing

- **Odoo Integration**
  - Sync menu items and categories
  - Order synchronization
  - Inventory management

### Frontend (React)
- Responsive user interface
- Intuitive menu browsing
- Shopping cart functionality
- Order tracking
- Admin dashboard

## Tech Stack

### Backend
- Python 3.8+
- Django 4.0+
- Django REST Framework
- PostgreSQL
- XML-RPC (for Odoo integration)

### Frontend
- React 18+
- React Router
- Axios for API calls
- Styled Components

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Odoo instance (for full functionality)

### Backend Setup

1. Clone the repository
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the backend directory with the following variables:
   ```
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   ODOO_URL=your_odoo_url
   DB=your_odoo_database
   USERNAME=your_odoo_username
   PASSWORD=your_odoo_password
   ```
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Menu Items
- `GET /api/menu-items/` - List all menu items
- `GET /api/menu-items/{id}/` - Get menu item details
- `POST /api/menu-items/` - Create new menu item (Admin only)
- `PUT /api/menu-items/{id}/` - Update menu item (Admin only)
- `DELETE /api/menu-items/{id}/` - Delete menu item (Admin only)

### Orders
- `GET /api/orders/` - List all orders (Admin) or user's orders (Customer)
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `PUT /api/orders/{id}/` - Update order status (Admin only)

### Payments
- `POST /api/payments/` - Process payment
- `GET /api/payments/{id}/` - Get payment details

## Environment Variables

### Backend
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `DB_*`: Database connection settings
- `ODOO_URL`: Odoo instance URL
- `DB`: Odoo database name
- `USERNAME`: Odoo username
- `PASSWORD`: Odoo password

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For support or questions, please contact the development team.

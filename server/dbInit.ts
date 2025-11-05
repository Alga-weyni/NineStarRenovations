import { AuthService } from './services/authService';

/**
 * Initialize database with default admin user if none exists
 * Default credentials: admin / Admin123!
 */
export async function initializeDatabase() {
  try {
    const adminExists = await AuthService.checkIfAdminExists();
    
    if (!adminExists) {
      console.log('No admin user found. Creating default admin user...');
      await AuthService.createAdminUser('admin', 'Admin123!');
      console.log('✓ Default admin user created successfully');
      console.log('  Username: admin');
      console.log('  Password: Admin123!');
      console.log('  Please change the password after first login');
    } else {
      console.log('✓ Admin user exists');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

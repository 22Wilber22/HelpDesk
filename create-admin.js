// Script para crear un usuario administrador por defecto
// Uso: node create-admin.js

import bcrypt from 'bcryptjs';
import pool from './config/db.js';

const adminData = {
  nombre_completo: 'Administrador',
  correo: 'admin@helpdesk.com',
  telefono: '0000-0000',
  rol: 'Admin',
  password: 'admin123', // Contraseña por defecto
  estado: 'activo'
};

async function createAdmin() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Verificar si el admin ya existe
    const [existing] = await connection.query(
      'SELECT usuario_id, correo FROM Usuarios WHERE correo = ?',
      [adminData.correo]
    );
    
    if (existing.length > 0) {
      console.log('⚠️  El administrador ya existe. Actualizando contraseña...');
      
      // Actualizar contraseña
      const password_hash = await bcrypt.hash(adminData.password, 10);
      await connection.query(
        'UPDATE Usuarios SET password_hash = ?, estado = ? WHERE correo = ?',
        [password_hash, adminData.estado, adminData.correo]
      );
      
      console.log('✅ Contraseña del administrador actualizada');
    } else {
      // Crear nuevo admin
      const password_hash = await bcrypt.hash(adminData.password, 10);
      
      const [result] = await connection.query(
        `INSERT INTO Usuarios (nombre_completo, correo, telefono, rol, password_hash, estado) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [adminData.nombre_completo, adminData.correo, adminData.telefono, adminData.rol, password_hash, adminData.estado]
      );
      
      console.log('✅ Administrador creado exitosamente');
      console.log('   ID:', result.insertId);
    }
    
    console.log('\n📝 Credenciales de acceso:');
    console.log('   Correo:', adminData.correo);
    console.log('   Password:', adminData.password);
    console.log('\n🔗 Ruta de login:');
    console.log('   POST http://localhost:4000/auth/login');
    console.log('\n📋 Body JSON:');
    console.log(JSON.stringify({
      correo: adminData.correo,
      password: adminData.password
    }, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

createAdmin();


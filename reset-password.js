// Script temporal para resetear contraseña de un usuario
// Uso: node reset-password.js correo@ejemplo.com nuevaContraseña

import bcrypt from 'bcryptjs';
import pool from './config/db.js';

const correo = process.argv[2];
const nuevaPassword = process.argv[3];

if (!correo || !nuevaPassword) {
  console.error('Uso: node reset-password.js correo@ejemplo.com nuevaContraseña');
  process.exit(1);
}

async function resetPassword() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Verificar si el usuario existe
    const [rows] = await connection.query(
      'SELECT usuario_id, correo, nombre_completo FROM Usuarios WHERE correo = ?',
      [correo]
    );
    
    if (rows.length === 0) {
      console.error('❌ Usuario no encontrado con el correo:', correo);
      process.exit(1);
    }
    
    const user = rows[0];
    console.log('✅ Usuario encontrado:', user.nombre_completo, `(${user.correo})`);
    
    // Generar nuevo hash
    const password_hash = await bcrypt.hash(nuevaPassword, 10);
    console.log('✅ Hash generado (primeros 30 chars):', password_hash.substring(0, 30) + '...');
    
    // Actualizar contraseña
    await connection.query(
      'UPDATE Usuarios SET password_hash = ? WHERE correo = ?',
      [password_hash, correo]
    );
    
    console.log('✅ Contraseña actualizada exitosamente');
    console.log('\n📝 Ahora puedes hacer login con:');
    console.log('   Correo:', correo);
    console.log('   Password:', nuevaPassword);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

resetPassword();


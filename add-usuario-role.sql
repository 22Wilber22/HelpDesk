-- Script para agregar el rol "Usuario" a la tabla Usuarios
-- Este rol es para personas que solicitan apoyo (crean tickets)

USE railway;

-- Modificar el ENUM de la columna 'rol' para incluir 'Usuario'
ALTER TABLE Usuarios 
MODIFY COLUMN rol ENUM('Agente', 'Supervisor', 'Admin', 'Usuario') NOT NULL;

-- Verificar el cambio
SHOW COLUMNS FROM Usuarios WHERE Field = 'rol';

-- Ejemplo: Crear un usuario de prueba con rol "Usuario"
-- INSERT INTO Usuarios (nombre_completo, correo, telefono, rol, password_hash, estado)
-- VALUES ('Usuario Prueba', 'usuario@test.com', '0000-0000', 'Usuario', '$2b$10$hash...', 'activo');

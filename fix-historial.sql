-- Script para permitir NULL en usuario_id de Historial_Tickets
-- Esto es necesario para cuando se cancelan tickets sin agente asignado

USE railway;

-- Modificar la columna usuario_id para permitir NULL
ALTER TABLE Historial_Tickets 
MODIFY COLUMN usuario_id INT NULL;

-- Verificar el cambio
SHOW COLUMNS FROM Historial_Tickets WHERE Field = 'usuario_id';

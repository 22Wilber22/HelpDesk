-- Script para corregir triggers con DEFINER inválido
-- Problema: Los triggers tienen DEFINER 'uhjd30dgvb8lsdzv'@'%' que ya no existe
-- Solución: Eliminar y recrear con DEFINER 'root'@'%'

USE railway;

-- 1. Eliminar triggers existentes
DROP TRIGGER IF EXISTS trg_comentario_actividad;
DROP TRIGGER IF EXISTS trg_ticket_validar_agente;
DROP TRIGGER IF EXISTS trg_ticket_fecha_cierre;
DROP TRIGGER IF EXISTS trg_ticket_historial;

-- 2. Recrear trigger: Actualizar última actividad cuando se crea un comentario
DELIMITER $$
CREATE DEFINER=`root`@`%` TRIGGER trg_comentario_actividad
AFTER INSERT ON Comentarios
FOR EACH ROW
BEGIN
    UPDATE Tickets
    SET ultima_actividad = NOW()
    WHERE ticket_id = NEW.ticket_id;
END$$
DELIMITER ;

-- 3. Recrear trigger: Validar agente antes de crear ticket
DELIMITER $$
CREATE DEFINER=`root`@`%` TRIGGER trg_ticket_validar_agente
BEFORE INSERT ON Tickets
FOR EACH ROW
BEGIN
    DECLARE vRol VARCHAR(20);
    DECLARE vEstado VARCHAR(20);

    IF NEW.agente_id IS NOT NULL THEN
        SELECT rol, estado INTO vRol, vEstado
        FROM Usuarios
        WHERE usuario_id = NEW.agente_id;

        IF vRol <> 'Agente' OR vEstado <> 'activo' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El agente asignado no es válido o no está activo';
        END IF;
    END IF;
END$$
DELIMITER ;

-- 4. Recrear trigger: Actualizar fecha de cierre cuando cambia estado
DELIMITER $$
CREATE DEFINER=`root`@`%` TRIGGER trg_ticket_fecha_cierre
BEFORE UPDATE ON Tickets
FOR EACH ROW
BEGIN
    -- Si el ticket se marca como Resuelto o Cancelado, establecer fecha_cierre
    IF NEW.estado IN ('Resuelto', 'Cancelado') AND OLD.estado NOT IN ('Resuelto', 'Cancelado') THEN
        SET NEW.fecha_cierre = NOW();
    END IF;

    -- Si el ticket se reabre, limpiar fecha_cierre
    IF NEW.estado NOT IN ('Resuelto', 'Cancelado') AND OLD.estado IN ('Resuelto', 'Cancelado') THEN
        SET NEW.fecha_cierre = NULL;
    END IF;
END$$
DELIMITER ;

-- 5. Recrear trigger: Registrar cambios de estado en historial
DELIMITER $$
CREATE DEFINER=`root`@`%` TRIGGER trg_ticket_historial
AFTER UPDATE ON Tickets
FOR EACH ROW
BEGIN
    IF NEW.estado <> OLD.estado THEN
        INSERT INTO Historial_Tickets (
            ticket_id,
            usuario_id,
            estado_anterior,
            estado_nuevo,
            comentario,
            fecha_cambio
        ) VALUES (
            NEW.ticket_id,
            NEW.agente_id,
            OLD.estado,
            NEW.estado,
            CONCAT('Cambio automático de estado: ', OLD.estado, ' → ', NEW.estado),
            NOW()
        );
    END IF;
END$$
DELIMITER ;

-- Verificar que los triggers se crearon correctamente
SHOW TRIGGERS WHERE `Table` IN ('Tickets', 'Comentarios');

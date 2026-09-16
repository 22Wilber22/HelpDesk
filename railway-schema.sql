USE railway;

-- =========================================================
-- TABLAS PRINCIPALES
-- =========================================================

DROP TABLE IF EXISTS Historial_Tickets;
DROP TABLE IF EXISTS Comentarios;
DROP TABLE IF EXISTS Tickets;
DROP TABLE IF EXISTS Categorias;
DROP TABLE IF EXISTS Clientes;
DROP TABLE IF EXISTS Usuarios;

CREATE TABLE Usuarios (
  usuario_id INT NOT NULL AUTO_INCREMENT,
  nombre_completo VARCHAR(150) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(30) NULL,
  rol ENUM('Admin', 'Supervisor', 'Agente', 'Usuario') NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id)
);

CREATE TABLE Clientes (
  cliente_id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(30) NULL,
  password_hash VARCHAR(255) NULL,
  empresa VARCHAR(150) NULL,
  area VARCHAR(100) NULL,
  direccion VARCHAR(255) NULL,
  notas TEXT NULL,
  activo TINYINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (cliente_id)
);

CREATE TABLE Categorias (
  categoria_id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT NULL,
  activo TINYINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (categoria_id)
);

CREATE TABLE Tickets (
  ticket_id INT NOT NULL AUTO_INCREMENT,
  numero_ticket VARCHAR(30) NOT NULL UNIQUE,
  cliente_id INT NOT NULL,
  agente_id INT NULL,
  categoria_id INT NOT NULL,
  prioridad ENUM('Baja', 'Media', 'Alta', 'Urgente') NOT NULL DEFAULT 'Media',
  descripcion TEXT NOT NULL,
  estado ENUM('Abierto', 'En Proceso', 'Pendiente', 'Resuelto', 'Cancelado') NOT NULL DEFAULT 'Abierto',
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_cierre TIMESTAMP NULL,
  ultima_actividad TIMESTAMP NULL,
  PRIMARY KEY (ticket_id),
  CONSTRAINT fk_tickets_cliente FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id) ON DELETE RESTRICT,
  CONSTRAINT fk_tickets_agente FOREIGN KEY (agente_id) REFERENCES Usuarios(usuario_id) ON DELETE SET NULL,
  CONSTRAINT fk_tickets_categoria FOREIGN KEY (categoria_id) REFERENCES Categorias(categoria_id) ON DELETE RESTRICT
);

CREATE TABLE Comentarios (
  comentario_id INT NOT NULL AUTO_INCREMENT,
  ticket_id INT NOT NULL,
  usuario_id INT NOT NULL,
  texto TEXT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comentario_id),
  CONSTRAINT fk_comentarios_ticket FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
  CONSTRAINT fk_comentarios_usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE
);

CREATE TABLE Historial_Tickets (
  historial_id INT NOT NULL AUTO_INCREMENT,
  ticket_id INT NOT NULL,
  usuario_id INT NULL,
  estado_anterior VARCHAR(50) NULL,
  estado_nuevo VARCHAR(50) NULL,
  comentario TEXT NULL,
  fecha_cambio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (historial_id),
  CONSTRAINT fk_historial_ticket FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
  CONSTRAINT fk_historial_usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE SET NULL
);

-- =========================================================
-- ÍNDICES
-- =========================================================
CREATE INDEX idx_usuarios_correo ON Usuarios(correo);
CREATE INDEX idx_clientes_correo ON Clientes(correo);
CREATE INDEX idx_tickets_estado ON Tickets(estado);
CREATE INDEX idx_tickets_cliente ON Tickets(cliente_id);
CREATE INDEX idx_tickets_agente ON Tickets(agente_id);
CREATE INDEX idx_comentarios_ticket ON Comentarios(ticket_id);
CREATE INDEX idx_historial_ticket ON Historial_Tickets(ticket_id);

-- =========================================================
-- DATOS INICIALES
-- =========================================================
INSERT INTO Categorias (nombre, descripcion, activo) VALUES
  ('General', 'Consultas generales del sistema', 1),
  ('Tecnico', 'Incidentes técnicos y errores', 1),
  ('Cuenta', 'Problemas de acceso, seguridad y cuentas', 1);

-- Hash para la contraseña: admin123
INSERT INTO Usuarios (nombre_completo, correo, telefono, rol, password_hash, estado)
VALUES (
  'Administrador',
  'admin@helpdesk.com',
  '0000-0000',
  'Admin',
  '$2b$10$U9Ns.Dmkg92PNO1icyWiLuhewuBfTcWEmrJ4lGIM4/EJMXfpP2cGK',
  'activo'
);

-- =========================================================
-- TRIGGERS
-- =========================================================
DELIMITER $$
DROP TRIGGER IF EXISTS trg_comentario_actividad$$
CREATE DEFINER=`root`@`%` TRIGGER trg_comentario_actividad
AFTER INSERT ON Comentarios
FOR EACH ROW
BEGIN
    UPDATE Tickets
    SET ultima_actividad = NOW()
    WHERE ticket_id = NEW.ticket_id;
END$$

DROP TRIGGER IF EXISTS trg_ticket_validar_agente$$
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

DROP TRIGGER IF EXISTS trg_ticket_fecha_cierre$$
CREATE DEFINER=`root`@`%` TRIGGER trg_ticket_fecha_cierre
BEFORE UPDATE ON Tickets
FOR EACH ROW
BEGIN
    IF NEW.estado IN ('Resuelto', 'Cancelado') AND OLD.estado NOT IN ('Resuelto', 'Cancelado') THEN
        SET NEW.fecha_cierre = NOW();
    END IF;

    IF NEW.estado NOT IN ('Resuelto', 'Cancelado') AND OLD.estado IN ('Resuelto', 'Cancelado') THEN
        SET NEW.fecha_cierre = NULL;
    END IF;
END$$

DROP TRIGGER IF EXISTS trg_ticket_historial$$
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

-- =========================================================
-- VALIDACIÓN
-- =========================================================
SELECT 'DB inicializada correctamente' AS status;

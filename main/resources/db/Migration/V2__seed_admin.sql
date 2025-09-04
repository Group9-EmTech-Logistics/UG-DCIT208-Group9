-- V2__seed_admin.sql
-- Insert default admin user and role

-- Create roles table if not already existing
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert default roles
INSERT INTO roles (name) VALUES ('ADMIN') 
    ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (name) VALUES ('USER') 
    ON CONFLICT (name) DO NOTHING;

-- Insert default admin user
INSERT INTO users (username, password, role) 
VALUES (
    'admin',
    -- BCrypt hash for 'Admin@123' (you can generate a new one later)
    '$2a$10$1rmxAc3K5tDyyj8DRP9GHeZ/n3Oe.1sXgFjcM0m0XAf3YTOF9qEe6',
    'ADMIN'
)
ON CONFLICT (username) DO NOTHING;

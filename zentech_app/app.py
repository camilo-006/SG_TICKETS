from flask import Flask, render_template, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv(override=True)

app = Flask(__name__)
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

def obtener_conexion():
    try:
        conexion = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        return conexion
    except Exception as e:
        print(f"🔴 Error al conectar a la base de datos: {e}")
        return None

@app.route('/')
def inicio():
    return render_template('index.html')

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    conn = obtener_conexion()
    if not conn:
        return jsonify({'error': 'Database error'}), 500
        
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute('''
                SELECT u.id, u.nombre, u.apellido, u.username, u.correo, u.password, r.nombre_rol as rol_nombre
                FROM usuarios u
                LEFT JOIN roles r ON u.rol_id = r.id
                WHERE u.username = %s AND u.nombre_estado_id = 1
            ''', (username,))
            user = cursor.fetchone()
            
            if user and check_password_hash(user['password'], password):
                return jsonify({
                    'id': user['id'],
                    'name': user['nombre'],
                    'lastName': user['apellido'],
                    'email': user['correo'],
                    'role': user['rol_nombre'] or 'cliente'
                })
            else:
                return jsonify({'error': 'Credenciales inválidas'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    nombre = data.get('name')
    apellido = data.get('lastName')
    username = data.get('username')
    correo = data.get('email')
    password = data.get('password')
    
    hashed_password = generate_password_hash(password)
    
    conn = obtener_conexion()
    if not conn:
        return jsonify({'error': 'Database error'}), 500
        
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute('SELECT id FROM usuarios WHERE username = %s', (username,))
            if cursor.fetchone():
                return jsonify({'error': 'El usuario ya está registrado.'}), 400
                
            cursor.execute('SELECT id FROM roles WHERE nombre_rol = %s OR nombre_rol = %s LIMIT 1', ('cliente', 'Cliente'))
            rol = cursor.fetchone()
            rol_id = rol['id'] if rol else None
            
            cursor.execute('''
                INSERT INTO usuarios (nombre, apellido, correo, password, rol_id, estado_user_id)
                VALUES (%s, %s, %s, %s, %s, 1) RETURNING id
            ''', (nombre, apellido, correo, hashed_password, rol_id))
            
            new_id = cursor.fetchone()['id']
            conn.commit()
            
            return jsonify({
                'id': new_id,
                'name': nombre,
                'lastName': apellido,
                'username': username,
                'email': correo,
                'role': 'cliente'
            })
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/estados', methods=['GET'])
def get_estados():
    conn = obtener_conexion()
    if not conn:
        return jsonify({'error': 'Database error'}), 500
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute('SELECT id, nombre_estado FROM estados')
            estados = cursor.fetchall()
            return jsonify(estados)
    finally:
        conn.close()

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    email = request.args.get('email')
    role = request.args.get('role')
    
    conn = obtener_conexion()
    if not conn:
        return jsonify({'error': 'Database error'}), 500
        
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            query = '''
                SELECT t.id, t.titulo as title, t.descripcion as description, 
                       e.nombre_estado as status, e.id as status_id,
                       u.correo as author
                FROM tickets t
                LEFT JOIN estados e ON t.estado_id = e.id
                LEFT JOIN usuarios u ON t.creador_id = u.id
            '''
            
            if role == 'cliente':
                query += ' WHERE u.correo = %s'
                cursor.execute(query, (email,))
            else:
                cursor.execute(query)
                
            tickets = cursor.fetchall()
            return jsonify(tickets)
    finally:
        conn.close()

@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    data = request.json
    titulo = data.get('title')
    descripcion = data.get('description')
    email = data.get('author')
    
    conn = obtener_conexion()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute('SELECT id FROM usuarios WHERE correo = %s', (email,))
            user = cursor.fetchone()
            if not user:
                return jsonify({'error': 'Usuario no encontrado'}), 404
            creador_id = user['id']
            
            cursor.execute('SELECT id, nombre_estado FROM estados ORDER BY id ASC LIMIT 1')
            estado = cursor.fetchone()
            estado_id = estado['id'] if estado else None
            status_name = estado['nombre_estado'] if estado else 'Pendiente'
            
            cursor.execute('''
                INSERT INTO tickets (titulo, descripcion, estado_id, creador_id)
                VALUES (%s, %s, %s, %s) RETURNING id
            ''', (titulo, descripcion, estado_id, creador_id))
            
            new_id = cursor.fetchone()['id']
            conn.commit()
            
            return jsonify({
                'id': new_id,
                'title': titulo,
                'description': descripcion,
                'status': status_name,
                'status_id': estado_id,
                'author': email
            })
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/tickets/<int:id>', methods=['PUT'])
def update_ticket(id):
    data = request.json
    estado_id = data.get('status_id')
    
    conn = obtener_conexion()
    try:
        with conn.cursor() as cursor:
            cursor.execute('''
                UPDATE tickets SET estado_id = %s WHERE id = %s
            ''', (estado_id, id))
            conn.commit()
            
            # Fetch the new status name to return
            cursor.execute('SELECT nombre_estado FROM estados WHERE id = %s', (estado_id,))
            st = cursor.fetchone()
            return jsonify({'success': True, 'status': st[0] if st else ''})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/tickets/<int:id>', methods=['DELETE'])
def delete_ticket(id):
    conn = obtener_conexion()
    try:
        with conn.cursor() as cursor:
            cursor.execute('DELETE FROM tickets WHERE id = %s', (id,))
            conn.commit()
            return jsonify({'success': True})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/roles', methods=['GET'])
def get_roles():
    conn = obtener_conexion()
    if not conn:
        return jsonify({'error': 'Database error'}), 500
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute('SELECT id, nombre_rol as nombre FROM roles')
            return jsonify(cursor.fetchall())
    finally:
        conn.close()

@app.route('/api/departamentos', methods=['GET'])
def get_departamentos():
    conn = obtener_conexion()
    if not conn:
        return jsonify({'error': 'Database error'}), 500
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute('SELECT id, nombre_departamento FROM departamento')
            return jsonify(cursor.fetchall())
    finally:
        conn.close()

@app.route('/api/empleados', methods=['POST'])
def create_empleado():
    data = request.json
    nombre = data.get('name')
    apellido = data.get('lastName')
    username = data.get('username')
    correo = data.get('email')
    password = data.get('password')
    rol_id = data.get('rol_id')
    departamento_id = data.get('departamento_id')
    
    hashed_password = generate_password_hash(password)
    
    conn = obtener_conexion()
    if not conn:
        return jsonify({'error': 'Database error'}), 500
        
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute('SELECT id FROM usuarios WHERE username = %s', (username,))
            if cursor.fetchone():
                return jsonify({'error': 'El usuario ya está registrado.'}), 400
            
            # Insert User
            cursor.execute('''
                INSERT INTO usuarios (nombre, apellido, correo, password, rol_id, nombre_estado_id)
                VALUES (%s, %s, %s, %s, %s, 1) RETURNING id
            ''', (nombre, apellido, correo, hashed_password, rol_id))
            new_user_id = cursor.fetchone()['id']
            
            # Insert Empleado relation
            cursor.execute('''
                INSERT INTO empleados (usuario_id, departamento_id)
                VALUES (%s, %s) RETURNING id
            ''', (new_user_id, departamento_id))
            
            # Verificar si el rol asignado es "Gerente" para enlazarlo como gerente_id del departamento
            cursor.execute('SELECT nombre_rol FROM roles WHERE id = %s', (rol_id,))
            rol_result = cursor.fetchone()
            if rol_result and rol_result['nombre_rol'].lower() == 'gerente':
                cursor.execute('''
                    UPDATE departamento 
                    SET gerente_id = %s 
                    WHERE id = %s
                ''', (new_user_id, departamento_id))
                
            conn.commit()
            return jsonify({'success': True, 'usuario_id': new_user_id})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/empleados', methods=['GET'])
def get_empleados():
    conn = obtener_conexion()
    if not conn:
        return jsonify({'error': 'Database error'}), 500
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute('''
                SELECT u.id, u.nombre, u.apellido, u.username, u.correo, u.nombre_estado_id,
                       r.id as rol_id, r.nombre_rol,
                       d.id as departamento_id, d.nombre_departamento
                FROM usuarios u
                LEFT JOIN roles r ON u.rol_id = r.id
                LEFT JOIN empleados e ON u.id = e.usuario_id
                LEFT JOIN departamento d ON e.departamento_id = d.id
                ORDER BY u.id DESC
            ''')
            return jsonify(cursor.fetchall())
    finally:
        conn.close()

@app.route('/api/empleados/<int:id>', methods=['PUT'])
def update_empleado(id):
    data = request.json
    nombre = data.get('name')
    apellido = data.get('lastName')
    correo = data.get('email')
    password = data.get('password')
    rol_id = data.get('rol_id')
    departamento_id = data.get('departamento_id')
    estado = data.get('estado') # 1 o 2
    
    conn = obtener_conexion()
    if not conn:
        return jsonify({'error': 'Database error'}), 500
        
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Update User (except password if blank)
            if password:
                hashed_password = generate_password_hash(password)
                cursor.execute('''
                    UPDATE usuarios 
                    SET nombre = %s, apellido = %s, correo = %s, rol_id = %s, nombre_estado_id = %s, password = %s
                    WHERE id = %s
                ''', (nombre, apellido, correo, rol_id, estado, hashed_password, id))
            else:
                cursor.execute('''
                    UPDATE usuarios 
                    SET nombre = %s, apellido = %s, correo = %s, rol_id = %s, nombre_estado_id = %s
                    WHERE id = %s
                ''', (nombre, apellido, correo, rol_id, estado, id))
                
            # Upsert Empleado relation
            cursor.execute('SELECT id FROM empleados WHERE usuario_id = %s', (id,))
            emp = cursor.fetchone()
            if emp:
                cursor.execute('''
                    UPDATE empleados SET departamento_id = %s WHERE usuario_id = %s
                ''', (departamento_id, id))
            else:
                cursor.execute('''
                    INSERT INTO empleados (usuario_id, departamento_id) VALUES (%s, %s)
                ''', (id, departamento_id))
            
            # Check if role is Gerente
            cursor.execute('SELECT nombre_rol FROM roles WHERE id = %s', (rol_id,))
            rol_result = cursor.fetchone()
            if rol_result and rol_result['nombre_rol'].lower() == 'gerente':
                cursor.execute('''
                    UPDATE departamento 
                    SET gerente_id = %s 
                    WHERE id = %s
                ''', (id, departamento_id))
                
            conn.commit()
            return jsonify({'success': True})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
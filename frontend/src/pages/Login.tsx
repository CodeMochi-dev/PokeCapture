import React, { useState } from 'react'

export default function Login({ onLogin }: { onLogin: (name: string) => void }){
  const [name, setName] = useState('')
  const [error, setError] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (name.trim()) {
      setError(false)
      onLogin(name.trim())
    } else {
      setError(true)
    }
  }

  return (
    <div style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 180px)',
      padding: 24,
      animation: 'fadeIn 0.5s ease'
    }}>
      <style>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .login-card {
          background: var(--panel-bg);
          border: 2px solid var(--panel-border);
          border-radius: 24px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.2);
          text-align: center;
          animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .login-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.3);
        }
        .avatar-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), #f5a623);
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          box-shadow: 0 8px 24px rgba(255, 209, 102, 0.4);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .avatar-circle.focused {
          transform: scale(1.1) rotate(5deg);
        }
        .login-input {
          width: 100%;
          padding: 14px 20px;
          border-radius: 12px;
          border: 2px solid var(--input-border);
          background: var(--input-bg);
          color: var(--text-main);
          font-size: 16px;
          outline: none;
          transition: all 0.2s ease;
          margin-bottom: 8px;
        }
        .login-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(255, 209, 102, 0.15);
        }
        .login-input.error {
          border-color: #ef4444;
          animation: shake 0.4s ease;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          margin-top: 16px;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }
        .login-btn:active {
          transform: scale(0.98);
        }
      `}</style>

      <div className="login-card">
        <div className={`avatar-circle ${isFocused ? 'focused' : ''}`}>
          👤
        </div>
        
        <h2 style={{ margin: '0 0 8px', fontSize: 28, color: 'var(--text-main)' }}>
          ¡Bienvenido Entrenador!
        </h2>
        <p style={{ margin: '0 0 24px', color: 'var(--text-muted)', fontSize: 15 }}>
          Ingresa tu nombre para comenzar tu aventura Pokémon.
        </p>

        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            placeholder="¿Cuál es tu nombre?" 
            value={name} 
            onChange={e => { setName(e.target.value); setError(false); }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`login-input ${error ? 'error' : ''}`}
            autoFocus
          />
          <div style={{ 
            height: 20, 
            color: '#ef4444', 
            fontSize: 13, 
            textAlign: 'left', 
            paddingLeft: 4,
            opacity: error ? 1 : 0,
            transition: 'opacity 0.2s'
          }}>
            Por favor, escribe tu nombre.
          </div>

          <button type="submit" className="login-btn">
            Comenzar Aventura
          </button>
        </form>
      </div>
    </div>
  )
}

'use client';
import React, { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/login.module.css';
import LogoLogin from '@/public/LoginLogo.png';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    try {
      const signinResponse = await signIn("credentials", {
        redirect: false,
        username: formData.get("email") as string,
        password: formData.get("password") as string,
      });

      if (signinResponse?.error) {
        setError(signinResponse.error);
      } else if (signinResponse?.ok) {
        router.push('/inicio');
      } else {
        console.log(signinResponse);
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred.");
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      const response = await fetch('/api/auth/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setResetMessage('Correo electrónico enviado. Por favor revisa tu bandeja de entrada.');
        Swal.fire('Correo enviado', 'Por favor revisa tu bandeja de entrada.', 'success');
      } else {
        setResetMessage(`Error: ${data.message}`);
        Swal.fire('Error', data.message, 'error');
      }
    } catch (error) {
      console.error(error);
      setResetMessage('Error enviando el correo electrónico.');
      Swal.fire('Error', 'Error enviando el correo electrónico.', 'error');
    }
  };

  const confirmPasswordReset = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se enviará un correo electrónico para restablecer tu contraseña.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
        const email = emailInput?.value;
        if (email) {
          handlePasswordReset(email);
        } else {
          Swal.fire('Error', 'Por favor ingresa tu correo electrónico.', 'error');
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logo}>HydroP</div>
        <Image src={LogoLogin} alt="Plant" className={styles.image} />
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.loginBox}>
          <h2 className={styles.title}>Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <span className={styles.icon}>👤</span>
              <input name="email" type="email" placeholder="Correo Electrónico" className={styles.input} required />
            </div>
            <div className={styles.inputContainer}>
              <span className={styles.icon}>🔒</span>
              <input name="password" type="password" placeholder="Contraseña" className={styles.input} required />
              <div style={{ textAlign: 'right' }}>
                <button type="button" onClick={confirmPasswordReset} className="btn btn_recovery">¿Olvidaste la contraseña?</button>
              </div>
            </div>
            <button type="submit" className={styles.loginButton}>Login</button>
          </form>
          {resetMessage && <div className="alert alert-info">{resetMessage}</div>}
          <hr className={styles.divider} />
          <div className={styles.purchaseSection}>
            <p>Aun no adquieres tu estación Hydrop?</p>
            <a href="#" className={styles.purchaseLink}>Consigue la tuya aquí</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

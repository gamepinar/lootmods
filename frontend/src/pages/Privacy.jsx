function Privacy() {
  return (
    <div className="legal-page" style={{maxWidth: '900px', margin: '2rem auto', padding: '0 2rem'}}>
      <h1 style={{marginBottom: '2rem'}}>Política de Privacidad</h1>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>1. Introducción</h2>
        <p>
          En LOOTMODS nos comprometemos a proteger tu privacidad. Esta política explica cómo recopilamos, usamos 
          y protegemos tus datos personales.
        </p>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>2. Información que Recopilamos</h2>
        <p>Recopilamos la siguiente información:</p>
        <ul style={{marginLeft: '1rem'}}>
          <li><strong>Datos de Registro:</strong> Nombre, email y contraseña (hasheada)</li>
          <li><strong>Datos de Actividad:</strong> Descargas, donaciones y comentarios</li>
          <li><strong>Datos Técnicos:</strong> Dirección IP, navegador, historial de navegación</li>
        </ul>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>3. Cómo Usamos tu Información</h2>
        <p>Usamos tus datos para:</p>
        <ul style={{marginLeft: '1rem'}}>
          <li>Autenticar tu cuenta de usuario</li>
          <li>Procesar donaciones y registrar descargas</li>
          <li>Mejorar la experiencia del sitio</li>
          <li>Prevenir fraude y abuso</li>
          <li>Cumplir con obligaciones legales</li>
        </ul>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>4. Seguridad de Datos</h2>
        <p>
          Empleamos medidas de seguridad estándar incluyendo encriptación (SSL/TLS), hashing de contraseñas con bcrypt 
          y validación de entrada. Sin embargo, ningún sistema es 100% seguro.
        </p>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>5. Cookies y Almacenamiento Local</h2>
        <p>
          Usamos localStorage para almacenar tu token de autenticación. Esto te permite mantener tu sesión activa. 
          Puedes limpiar este almacenamiento desde la configuración de tu navegador.
        </p>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>6. Servicios de Terceros</h2>
        <p>
          Utilizamos Firebase para almacenamiento de imágenes. Firebase tiene su propia política de privacidad que 
          puedes revisar en firebase.google.com.
        </p>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>7. Tus Derechos</h2>
        <p>
          Tienes derecho a acceder, modificar o eliminar tus datos personales. Contacta a nuestro equipo para solicitudes 
          de privacidad.
        </p>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>8. Cambios en esta Política</h2>
        <p>
          Podemos actualizar esta política periódicamente. Los cambios serán efectivos cuando se publiquen en esta página.
        </p>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>9. Contacto</h2>
        <p>
          Si tienes preguntas sobre esta política o nuestras prácticas de privacidad, no dudes en comunicarte con nosotros.
        </p>
      </section>

      <p style={{textAlign: 'center', opacity: 0.5, fontSize: '0.9rem', marginTop: '3rem'}}>
        Última actualización: Mayo 2026
      </p>
    </div>
  );
}

export default Privacy;

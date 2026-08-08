function Terms() {
  return (
    <div className="legal-page" style={{maxWidth: '900px', margin: '2rem auto', padding: '0 2rem'}}>
      <h1 style={{marginBottom: '2rem'}}>Términos y Condiciones</h1>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>1. Aceptación de Términos</h2>
        <p>
          Al acceder y utilizar LOOTMODS, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo, 
          no puedes utilizar nuestro sitio.
        </p>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>2. Uso Responsable</h2>
        <p>
          Te comprometes a usar LOOTMODS solo para fines legales y legítimos. No puedes:
        </p>
        <ul style={{marginLeft: '1rem'}}>
          <li>Descargar contenido con fines de lucro sin autorización</li>
          <li>Redistribuir mods o contenido sin crédito a los creadores originales</li>
          <li>Intentar hackear, modificar o dañar el sitio</li>
          <li>Usar bots o scripts para automatizar descargas excesivas</li>
        </ul>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>3. Contenido de Terceros</h2>
        <p>
          LOOTMODS aloja contenido creado por terceros. No nos hacemos responsables por:
        </p>
        <ul style={{marginLeft: '1rem'}}>
          <li>La precisión o legitimidad del contenido</li>
          <li>Daños causados por la instalación o uso de mods</li>
          <li>Violaciones de derechos de autor de terceros</li>
        </ul>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>4. Marcas Registradas</h2>
        <p>
          Todos los nombres de juegos, marcas y logotipos mencionados pertenecen a sus respectivos propietarios.
          LOOTMODS no está afiliado con estas marcas.
        </p>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>5. Limitación de Responsabilidad</h2>
        <p>
          LOOTMODS se proporciona "tal cual". No garantizamos que el sitio esté libre de errores o accesible en todo momento.
        </p>
      </section>

      <section style={{marginBottom: '2rem'}}>
        <h2 style={{color: 'var(--accent-cyan)', marginBottom: '1rem'}}>6. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos inmediatamente 
          al ser publicados.
        </p>
      </section>

      <p style={{textAlign: 'center', opacity: 0.5, fontSize: '0.9rem', marginTop: '3rem'}}>
        Última actualización: Mayo 2026
      </p>
    </div>
  );
}

export default Terms;

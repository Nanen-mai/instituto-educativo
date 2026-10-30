<script>
  import { supabase } from '$lib/supabase.js';

  let nombre = $state('');
  let correo = $state('');
  let mensaje = $state('');
  let enviado = $state(false);
  let errorMensaje = $state('');
  let cargando = $state(false);

  async function enviarMensaje(event) {
    event.preventDefault();

    enviado = false;
    errorMensaje = '';

    if (!nombre.trim() || !correo.trim() || !mensaje.trim()) {
      errorMensaje = 'Completa todos los campos antes de enviar.';
      return;
    }

    cargando = true;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: nombre.trim(),
          email: correo.trim(),
          subject: 'Consulta desde la página web',
          message: mensaje.trim()
        });

      if (error) {
        console.error('Error de Supabase:', error.message);
        errorMensaje =
          'No se pudo enviar el mensaje. Comprueba la tabla y sus permisos.';
        return;
      }

      enviado = true;
      nombre = '';
      correo = '';
      mensaje = '';
    } catch (error) {
      console.error('Error de conexión:', error);
      errorMensaje = 'No se pudo conectar. Inténtalo de nuevo.';
    } finally {
      cargando = false;
    }
  }
</script>

<svelte:head>
  <title>Nosotros y Contacto | Instituto Educativo</title>
  <meta
    name="description"
    content="Conoce nuestra misión, visión y valores. Contacta con nuestro instituto educativo."
  />
</svelte:head>

<header class="encabezado">
  <a href="/" class="logo">
    <span class="logo-icono">IE</span>
    <span>Instituto Educativo</span>
  </a>

  <nav>
    <a href="/">Inicio</a>
    <a href="/#programas">Programas</a>
    <a href="/#nosotros">Nosotros</a>
    <a href="/about">Contacto</a>
  </nav>
</header>

<main>
  <section class="portada">
    <span class="etiqueta">CONÓCENOS</span>
    <h1>Educación para un mejor futuro</h1>
    <p>
      Trabajamos para ofrecer oportunidades de aprendizaje y contribuir
      al desarrollo de nuestros estudiantes.
    </p>
  </section>

  <section class="informacion">
    <article class="tarjeta">
      <div class="icono">🎯</div>
      <h2>Nuestra misión</h2>
      <p>
        Ofrecer una educación de calidad que ayude a los estudiantes
        a desarrollar sus conocimientos, valores y habilidades.
      </p>
    </article>

    <article class="tarjeta">
      <div class="icono">🌟</div>
      <h2>Nuestra visión</h2>
      <p>
        Ser una institución reconocida por su compromiso con el aprendizaje,
        la innovación y la formación integral.
      </p>
    </article>

    <article class="tarjeta">
      <div class="icono">🤝</div>
      <h2>Nuestros valores</h2>
      <p>
        Promovemos el respeto, la responsabilidad, la honestidad,
        la solidaridad y el trabajo en equipo.
      </p>
    </article>
  </section>

  <section class="contacto">
    <div class="contacto-info">
      <span class="etiqueta">ESTAMOS PARA AYUDARTE</span>
      <h2>Contáctanos</h2>
      <p>
        Envíanos tus preguntas o comentarios mediante el siguiente formulario.
      </p>

      <div class="dato">
        <span>📚</span>
        <div>
          <strong>Información</strong>
          <p>Solicita información sobre nuestra institución.</p>
        </div>
      </div>

      <div class="dato">
        <span>✉️</span>
        <div>
          <strong>Mensajes</strong>
          <p>Escríbenos y podremos revisar tu consulta.</p>
        </div>
      </div>
    </div>

    <form class="formulario" onsubmit={enviarMensaje}>
      <label for="nombre">Nombre completo</label>
      <input
        id="nombre"
        type="text"
        bind:value={nombre}
        placeholder="Escribe tu nombre"
        autocomplete="name"
        required
      />

      <label for="correo">Correo electrónico</label>
      <input
        id="correo"
        type="email"
        bind:value={correo}
        placeholder="ejemplo@correo.com"
        autocomplete="email"
        required
      />

      <label for="mensaje">Tu mensaje</label>
      <textarea
        id="mensaje"
        bind:value={mensaje}
        placeholder="Escribe aquí tu consulta..."
        rows="5"
        required
      ></textarea>

      {#if errorMensaje}
        <p class="mensaje-error" role="alert">{errorMensaje}</p>
      {/if}

      {#if enviado}
        <p class="mensaje-exito" role="status">
          ¡Tu mensaje se guardó correctamente!
        </p>
      {/if}

      <button type="submit" disabled={cargando}>
        {cargando ? 'Enviando...' : 'Enviar mensaje'}
      </button>

      <p class="nota">
        Tus datos se utilizarán para atender tu consulta.
      </p>
    </form>
  </section>
</main>

<footer>
  <p>© 2026 Instituto Educativo. Todos los derechos reservados.</p>
  <a href="/">Volver al inicio</a>
</footer>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: #23334b;
    background: #fff;
  }

  :global(a) {
    text-decoration: none;
  }

  .encabezado {
    min-height: 78px;
    padding: 15px 7%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    border-bottom: 1px solid #e4ebf0;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #183b60;
    font-weight: bold;
    font-size: 18px;
  }

  .logo-icono {
    padding: 10px;
    background: #148f88;
    border-radius: 10px;
    color: white;
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  nav a {
    color: #34445b;
  }

  nav a:hover,
  footer a:hover {
    color: #148f88;
  }

  .portada {
    padding: 65px 8%;
    text-align: center;
    background: linear-gradient(120deg, #eff7fc, #dff1ef);
  }

  .etiqueta {
    color: #148f88;
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 1px;
  }

  h1 {
    font-size: clamp(32px, 5vw, 46px);
    margin: 18px 0;
  }

  .portada p {
    max-width: 650px;
    margin: 0 auto;
    line-height: 1.8;
    color: #66768a;
  }

  .informacion {
    padding: 55px 8%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
  }

  .tarjeta {
    padding: 25px;
    border: 1px solid #e4ebf0;
    border-radius: 14px;
  }

  .icono {
    font-size: 35px;
  }

  .tarjeta h2 {
    font-size: 21px;
  }

  .tarjeta p {
    color: #66768a;
    line-height: 1.8;
  }

  .contacto {
    padding: 65px 8%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
    gap: 55px;
    background: #f0f6fb;
  }

  .contacto-info h2 {
    font-size: 38px;
    margin: 18px 0;
  }

  .contacto-info > p {
    color: #66768a;
    line-height: 1.8;
  }

  .dato {
    display: flex;
    gap: 15px;
    align-items: flex-start;
    margin-top: 30px;
  }

  .dato > span {
    font-size: 25px;
  }

  .dato p {
    margin-top: 8px;
    color: #66768a;
    line-height: 1.6;
  }

  .formulario {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px #23334b0c;
  }

  .formulario label {
    margin-top: 8px;
    font-weight: bold;
    font-size: 14px;
  }

  .formulario input,
  .formulario textarea {
    width: 100%;
    padding: 13px;
    border: 1px solid #ccd8e3;
    border-radius: 8px;
    background: #fff;
    color: #23334b;
    font: inherit;
  }

  .formulario input:focus,
  .formulario textarea:focus {
    outline: 2px solid #148f8844;
    border-color: #148f88;
  }

  .formulario textarea {
    resize: vertical;
  }

  .formulario button {
    margin-top: 12px;
    padding: 15px;
    border: none;
    border-radius: 8px;
    background: #148f88;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }

  .formulario button:hover {
    background: #10766f;
  }

  .formulario button:disabled {
    opacity: 0.65;
    cursor: wait;
  }

  .mensaje-error,
  .mensaje-exito {
    padding: 12px;
    border-radius: 8px;
    line-height: 1.5;
  }

  .mensaje-error {
    color: #9f2525;
    background: #fff0f0;
  }

  .mensaje-exito {
    color: #126b3a;
    background: #eaf8ef;
  }

  .nota {
    font-size: 12px;
    line-height: 1.6;
    color: #66768a;
  }

  footer {
    padding: 25px;
    text-align: center;
    background: #183b60;
    color: white;
    font-size: 14px;
  }

  footer a {
    color: white;
  }

  @media (max-width: 750px) {
    .encabezado {
      align-items: flex-start;
      flex-direction: column;
    }

    nav {
      gap: 15px;
    }

    .informacion,
    .contacto {
      grid-template-columns: 1fr;
    }

    .contacto {
      padding: 45px 6%;
      gap: 30px;
    }
  }
</style>
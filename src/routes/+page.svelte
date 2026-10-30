<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase.js';

  let menuAbierto = $state(false);
  let modo = $state('login');

  let nombre = $state('');
  let email = $state('');
  let password = $state('');

  let mensaje = $state('');
  let error = $state(false);
  let cargando = $state(false);
  let usuario = $state(null);

  onMount(() => {
    supabase.auth.getSession().then(({ data }) => {
      usuario = data.session?.user ?? null;
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_evento, session) => {
        usuario = session?.user ?? null;
      }
    );

    return () => data.subscription.unsubscribe();
  });

  function cambiarModo(nuevoModo) {
    modo = nuevoModo;
    mensaje = '';
    error = false;
    password = '';
  }

  async function manejarFormulario(event) {
    event.preventDefault();

    mensaje = '';
    error = false;
    cargando = true;

    try {
      if (modo === 'registro') {
        const { data, error: errorRegistro } =
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                nombre: nombre.trim()
              }
            }
          });

        if (errorRegistro) {
          throw errorRegistro;
        }

        if (data.session) {
          usuario = data.user;
          mensaje = '¡Tu cuenta se ha creado correctamente!';
          password = '';
        } else {
          mensaje =
            '¡Registro realizado! Revisa tu correo para confirmar la cuenta antes de iniciar sesión.';
          modo = 'login';
          password = '';
        }
      } else {
        const { data, error: errorLogin } =
          await supabase.auth.signInWithPassword({
            email,
            password
          });

        if (errorLogin) {
          throw errorLogin;
        }

        usuario = data.user;
        mensaje = '¡Bienvenido al Instituto Educativo!';
        password = '';
      }
    } catch (err) {
      error = true;
      mensaje = err.message || 'Ocurrió un error. Inténtalo nuevamente.';
    } finally {
      cargando = false;
    }
  }

  async function cerrarSesion() {
    const { error: errorLogout } = await supabase.auth.signOut();

    if (errorLogout) {
      error = true;
      mensaje = 'No se pudo cerrar la sesión.';
      return;
    }

    usuario = null;
    nombre = '';
    email = '';
    password = '';
    mensaje = 'Has cerrado sesión correctamente.';
    error = false;
  }
</script>

<svelte:head>
  <title>Instituto Educativo | Inicio</title>
  <meta
    name="description"
    content="Conoce nuestro instituto educativo y accede a tu cuenta."
  />
</svelte:head>

<header class="encabezado">
  <a href="/" class="logo">
    <span class="logo-icono">IE</span>
    <span>Instituto Educativo</span>
  </a>

  <button
    class="menu-boton"
    onclick={() => (menuAbierto = !menuAbierto)}
    aria-label="Abrir menú"
  >
    ☰
  </button>

  <nav class:abierto={menuAbierto}>
    <a href="/">Inicio</a>
    <a href="#programas">Programas</a>
    <a href="#nosotros">Nosotros</a>
    <a href="/about">Contacto</a>
    <a href="#login">Mi cuenta</a>
  </nav>
</header>

<main>
  <section class="hero">
    <div class="hero-contenido">
      <span class="etiqueta">APRENDER PARA CRECER</span>

      <h1>Construimos un futuro lleno de oportunidades</h1>

      <p>
        En nuestro instituto educativo promovemos el aprendizaje,
        la creatividad y el desarrollo de habilidades para la vida.
      </p>

      <a href="#login" class="boton">Acceder a mi cuenta</a>
    </div>

    <div class="hero-imagen">
      <div class="tarjeta-imagen">
        <span>📚</span>
        <h2>El conocimiento abre puertas</h2>
        <p>Aprende hoy, prepárate para mañana.</p>
      </div>
    </div>
  </section>

  <section class="programas" id="programas">
    <span class="etiqueta">NUESTRAS ÁREAS</span>
    <h2>Aprende con nosotros</h2>

    <p class="descripcion">
      Ofrecemos espacios de aprendizaje para desarrollar tus capacidades.
    </p>

    <div class="tarjetas">
      <article class="tarjeta">
        <div class="icono">💻</div>
        <h3>Informática</h3>
        <p>
          Aprende sobre tecnología, herramientas digitales y programación.
        </p>
      </article>

      <article class="tarjeta">
        <div class="icono">📖</div>
        <h3>Formación académica</h3>
        <p>
          Fortalece tus conocimientos y desarrolla buenos hábitos de estudio.
        </p>
      </article>

      <article class="tarjeta">
        <div class="icono">🎯</div>
        <h3>Desarrollo personal</h3>
        <p>
          Fomenta la responsabilidad, la creatividad y el trabajo en equipo.
        </p>
      </article>
    </div>
  </section>

  <section class="nosotros" id="nosotros">
    <div>
      <span class="etiqueta">SOBRE NOSOTROS</span>
      <h2>Una educación que inspira</h2>
    </div>

    <p>
      Creemos que cada estudiante tiene capacidades que puede desarrollar.
      Por eso promovemos una educación basada en el respeto, la participación
      y el deseo de superación.
    </p>

    <a href="/about" class="boton boton-claro">Conoce más</a>
  </section>

  <!-- INICIO DE SESIÓN Y REGISTRO -->
  <section class="login-seccion" id="login">
    <div class="login-tarjeta">
      <span class="etiqueta">ÁREA DE USUARIOS</span>

      {#if usuario}
        <h2>¡Bienvenido!</h2>

        <p>Has iniciado sesión con esta cuenta:</p>

        <p class="correo">{usuario.email}</p>

        <button class="boton boton-login" onclick={cerrarSesion}>
          Cerrar sesión
        </button>
      {:else}
        <h2>
          {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </h2>

        <p>
          {modo === 'login'
            ? 'Ingresa tus datos para acceder a tu cuenta.'
            : 'Completa tus datos para registrarte en el instituto.'}
        </p>

        <form onsubmit={manejarFormulario}>
          {#if modo === 'registro'}
            <label for="nombre">Nombre completo</label>

            <input
              id="nombre"
              type="text"
              placeholder="Escribe tu nombre"
              bind:value={nombre}
              required
              minlength="2"
              autocomplete="name"
            />
          {/if}

          <label for="email">Correo electrónico</label>

          <input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            bind:value={email}
            required
            autocomplete="email"
          />

          <label for="password">Contraseña</label>

          <input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            bind:value={password}
            required
            minlength="6"
            autocomplete={modo === 'login'
              ? 'current-password'
              : 'new-password'}
          />

          <button
            class="boton boton-login"
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? 'Procesando...'
              : modo === 'login'
                ? 'Iniciar sesión'
                : 'Crear mi cuenta'}
          </button>
        </form>

        <div class="cambiar-modo">
          {#if modo === 'login'}
            <p>¿Todavía no tienes una cuenta?</p>

            <button
              class="boton-secundario"
              onclick={() => cambiarModo('registro')}
            >
              Crear cuenta
            </button>
          {:else}
            <p>¿Ya tienes una cuenta?</p>

            <button
              class="boton-secundario"
              onclick={() => cambiarModo('login')}
            >
              Iniciar sesión
            </button>
          {/if}
        </div>
      {/if}

      {#if mensaje}
        <p class="mensaje" class:error={error} role="status">
          {mensaje}
        </p>
      {/if}
    </div>
  </section>

  <section class="llamada">
    <h2>¿Tienes alguna pregunta?</h2>
    <p>Estamos aquí para ayudarte y ofrecerte más información.</p>
    <a href="/about" class="boton">Escríbenos</a>
  </section>
</main>

<footer>
  <p>© 2026 Instituto Educativo. Todos los derechos reservados.</p>
</footer>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: #23334b;
    background: #ffffff;
  }

  :global(a) {
    text-decoration: none;
  }

  .encabezado {
    min-height: 78px;
    padding: 15px 7%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    background: white;
    border-bottom: 1px solid #e7edf3;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #183b60;
    font-size: 19px;
    font-weight: bold;
  }

  .logo-icono {
    background: #148f88;
    color: white;
    padding: 10px;
    border-radius: 10px;
  }

  nav {
    display: flex;
    gap: 25px;
  }

  nav a {
    color: #34445b;
    font-size: 15px;
  }

  nav a:hover {
    color: #148f88;
  }

  .menu-boton {
    display: none;
    border: 0;
    background: none;
    font-size: 25px;
    cursor: pointer;
  }

  .hero {
    padding: 80px 8%;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    align-items: center;
    gap: 50px;
    background: linear-gradient(120deg, #f0f7fc, #e0f2f0);
  }

  .etiqueta {
    color: #148f88;
    font-weight: bold;
    font-size: 13px;
    letter-spacing: 1px;
  }

  h1 {
    max-width: 650px;
    font-size: clamp(36px, 5vw, 56px);
    line-height: 1.15;
    margin: 20px 0;
  }

  .hero-contenido p,
  .descripcion {
    color: #66768a;
    line-height: 1.8;
  }

  .boton {
    display: inline-block;
    margin-top: 15px;
    padding: 14px 24px;
    border: none;
    border-radius: 8px;
    background: #148f88;
    color: white;
    font-weight: bold;
    cursor: pointer;
    font-size: 15px;
  }

  .boton:hover {
    background: #10766f;
  }

  .boton:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .hero-imagen {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #c9e6e7;
    border-radius: 25px;
    padding: 25px;
  }

  .tarjeta-imagen {
    background: white;
    border-radius: 18px;
    padding: 35px;
    text-align: center;
    box-shadow: 0 12px 35px #23334b12;
  }

  .tarjeta-imagen span {
    font-size: 65px;
  }

  .tarjeta-imagen p {
    color: #66768a;
    line-height: 1.6;
  }

  .programas {
    padding: 75px 8%;
    text-align: center;
  }

  .programas h2,
  .nosotros h2,
  .llamada h2 {
    font-size: 34px;
    margin: 15px 0;
  }

  .tarjetas {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 25px;
    margin-top: 40px;
    text-align: left;
  }

  .tarjeta {
    padding: 30px;
    border: 1px solid #e4ebf0;
    border-radius: 15px;
    background: white;
  }

  .tarjeta:hover {
    border-color: #148f88;
  }

  .icono {
    font-size: 35px;
  }

  .tarjeta p {
    color: #66768a;
    line-height: 1.7;
  }

  .nosotros {
    padding: 60px 8%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 30px;
    background: #183b60;
    color: white;
  }

  .nosotros p {
    line-height: 1.8;
    color: #e2eaf2;
  }

  .boton-claro {
    justify-self: start;
    background: white;
    color: #183b60;
  }

  .login-seccion {
    padding: 75px 20px;
    background: #f0f7fc;
    display: flex;
    justify-content: center;
  }

  .login-tarjeta {
    width: 100%;
    max-width: 430px;
    padding: 35px;
    border-radius: 16px;
    background: white;
    box-shadow: 0 8px 30px #23334b12;
  }

  .login-tarjeta h2 {
    margin: 15px 0 10px;
    font-size: 30px;
  }

  .login-tarjeta > p {
    color: #66768a;
    line-height: 1.6;
  }

  .login-tarjeta form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 25px;
  }

  .login-tarjeta label {
    font-size: 14px;
    font-weight: bold;
  }

  .login-tarjeta input {
    width: 100%;
    padding: 13px;
    border: 1px solid #d6e0e8;
    border-radius: 8px;
    font-size: 15px;
  }

  .login-tarjeta input:focus {
    outline: 2px solid #148f88;
    border-color: transparent;
  }

  .boton-login {
    width: 100%;
    font-size: 16px;
  }

  .cambiar-modo {
    margin-top: 22px;
    text-align: center;
  }

  .cambiar-modo p {
    color: #66768a;
    font-size: 14px;
  }

  .boton-secundario {
    padding: 10px 16px;
    background: white;
    color: #148f88;
    border: 1px solid #148f88;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }

  .boton-secundario:hover {
    background: #eaf7f5;
  }

  .correo {
    overflow-wrap: anywhere;
    font-weight: bold;
  }

  .mensaje {
    margin-top: 18px;
    color: #148f88;
    font-size: 14px;
    line-height: 1.6;
  }

  .mensaje.error {
    color: #c0392b;
  }

  .llamada {
    padding: 65px 8%;
    text-align: center;
    background: #f3f8fb;
  }

  .llamada p {
    color: #66768a;
  }

  footer {
    padding: 25px;
    text-align: center;
    background: #102a43;
    color: white;
    font-size: 14px;
  }

  @media (max-width: 750px) {
    .encabezado {
      flex-wrap: wrap;
    }

    .menu-boton {
      display: block;
    }

    nav {
      display: none;
      width: 100%;
      flex-direction: column;
      gap: 18px;
      padding: 15px 0;
    }

    nav.abierto {
      display: flex;
    }

    .hero {
      grid-template-columns: 1fr;
      padding: 50px 7%;
    }

    .tarjetas {
      grid-template-columns: 1fr;
    }

    .nosotros {
      grid-template-columns: 1fr;
    }
  }
</style>
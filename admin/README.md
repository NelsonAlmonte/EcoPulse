<br />
<div align="center">
  <a href="https://github.com/NelsonAlmonte/EcoPulse">
    <img src="images/logo.png" alt="Logo" width="90">
  </a>

  <h2 align="center">EcoPulse API</h2>

  <h4 align="center">
    API REST para la gestión de incidencias urbanas y servicios de la plataforma EcoPulse
  </h4>
</div>

<details>
  <summary>Tabla de contenido</summary>
  <ol>
    <li>
      <a href="#acerca-del-proyecto">Acerca del proyecto</a>
    </li>
    <li>
      <a href="#características">Características</a>
    </li>
    <li>
      <a href="#tecnologías-utilizadas">Tecnologías utilizadas</a>
    </li>
    <li>
      <a href="#primeros-pasos">Primeros pasos</a>
      <ul>
        <li><a href="#prerrequisitos">Prerrequisitos</a></li>
        <li><a href="#instalación">Instalación</a></li>
        <li><a href="#variables-de-entorno">Variables de entorno</a></li>
      </ul>
    </li>
    <li>
      <a href="#configuración-inicial">Configuración inicial</a>
    </li>
    <li><a href="#uso">Uso</a></li>
    <li><a href="#contribuciones">Contribuciones</a></li>
    <li><a href="#licencia">Licencia</a></li>
    <li><a href="#contacto">Contacto</a></li>
    <li><a href="#agradecimientos">Agradecimientos</a></li>
  </ol>
</details>

## Acerca del proyecto

EcoPulse API es el backend de la plataforma EcoPulse. Está desarrollado con NestJS y proporciona una API REST encargada de centralizar toda la lógica de negocio, autenticación, gestión de incidencias y comunicación entre la aplicación móvil y el panel de administración.

La API administra el ciclo de vida completo de los reportes ciudadanos, incluyendo la autenticación de usuarios, almacenamiento de imágenes, envío de notificaciones, administración de categorías y consulta de estadísticas. Además, integra Supabase como proveedor de base de datos PostgreSQL, autenticación y almacenamiento de archivos, mientras que Prisma ORM facilita el acceso y la gestión de los datos.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Características

- **API REST** desarrollada con NestJS siguiendo una arquitectura modular y escalable.
- **Gestión completa de incidencias**, incluyendo creación, consulta, actualización y seguimiento de reportes.
- **Administración de categorías** de incidencias.
- **Almacenamiento de imágenes** utilizando Supabase Storage.
- **Obtención de estadísticas** para el panel administrativo.
- **Consultas geográficas** para mapas, mapas de calor y análisis geoespacial.
- **Validación y autorización** mediante Guards, Pipes e Interceptors de NestJS.
- **Persistencia de datos** utilizando Prisma ORM sobre PostgreSQL.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Tecnologías utilizadas

[![NestJS][NestJS]][NestJS-url]
[![Prisma][Prisma]][Prisma-url]
[![Supabase][Supabase]][Supabase-url]

### Librerías utilizadas

- [Supabase](https://supabase.com/)
- [Prisma ORM](https://www.prisma.io/)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Primeros pasos

### Prerrequisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado lo siguiente:

- Node.js 20 o superior
- npm (incluido con Node.js)
- Una cuenta en Supabase
- Un proyecto creado en Supabase

### Instalación

1. Clona el repositorio.

```bash
git clone https://github.com/NelsonAlmonte/EcoPulse.git
```

2. Accede al directorio de la API.

```bash
cd api
```

3. Instala las dependencias.

```bash
npm install
```

4. Renombra el archivo `.env.example` a `.env` y completa las variables de entorno.

---

### Variables de entorno

Antes de ejecutar la API, configura las siguientes variables en el archivo `.env`:

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL utilizada por Prisma mediante PgBouncer. | Dashboard de Supabase → **Connect**. |
| `DIRECT_URL` | URL de conexión directa a PostgreSQL utilizada por Prisma para ejecutar migraciones. | Dashboard de Supabase → **Connect**. |
| `PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase. | Dashboard de Supabase → **Settings → API**. |
| `PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | Clave **Service Role** del proyecto de Supabase utilizada por la API para realizar operaciones privilegiadas. | Dashboard de Supabase → **Settings → API**. |
| `PUBLIC_BUCKET_URL` | URL pública del bucket donde se almacenan las imágenes de los reportes. | Dashboard de Supabase → **Storage**. |

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Configuración inicial

### Aplicar las migraciones de Prisma

Una vez creado el proyecto en Supabase y configuradas las variables `DATABASE_URL` y `DIRECT_URL`, aplica todas las migraciones ejecutando:

```bash
npx prisma migrate deploy
```

Este comando creará automáticamente todas las tablas, relaciones e índices necesarios para el funcionamiento de la aplicación.

Documentación oficial:

https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

### Crear el bucket para las imágenes

Desde el Dashboard de Supabase navega a:

```
Storage
└── Buckets
```

Crea un nuevo bucket llamado:

```
issues
```

Este bucket será utilizado para almacenar las imágenes asociadas a los reportes enviados desde la aplicación móvil.

Documentación oficial:

https://supabase.com/docs/guides/storage

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

### Configurar SMTP

La autenticación mediante correo electrónico utiliza un servidor SMTP para enviar los correos de recuperación de contraseña.

Desde el Dashboard de Supabase navega a:

```
Authentication
└── Emails
    └── SMTP Settings
```

Configura un proveedor SMTP. Se recomienda utilizar Gmail SMTP para proyectos personales o de desarrollo.

Documentación oficial:

https://supabase.com/docs/guides/auth/auth-smtp

Tutorial recomendado:

https://www.youtube.com/results?search_query=supabase+gmail+smtp

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

### Configurar las URLs de autenticación

El proceso de recuperación y restablecimiento de contraseña se realiza desde el panel administrativo, por lo que es necesario configurar las URLs utilizadas por Supabase Authentication.

Desde el Dashboard de Supabase navega a:

```
Authentication
└── URL Configuration
```

En **Site URL** agrega:

```
http://localhost:5173/*
```

En **Redirect URLs** agrega las siguientes direcciones:

```
http://localhost:5173/auth/update-password

http://localhost:5173/auth/reset-password
```

> **Importante:** Una vez la aplicación sea desplegada en producción, recuerda agregar también las URLs correspondientes a tu dominio de producción.

Documentación oficial:

https://supabase.com/docs/guides/auth/redirect-urls

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

### Crear la función `insert_notification`

Cada vez que cambia el estado de un reporte, la API registra automáticamente una notificación para informar al usuario. Para ello es necesario crear la siguiente función en la base de datos.

Desde el Dashboard de Supabase navega a:

```
Database
└── Functions
    └── New Function
```

Configura la función con los siguientes valores:

| Propiedad | Valor |
|-----------|-------|
| Nombre | `insert_notification` |
| Schema | `public` |
| Tipo | `Trigger Function` |
| Retorno | `trigger` |

Utiliza el siguiente código:

```sql
begin
    if OLD.status is distinct from NEW.status then
        insert into "Notification" (
            id,
            "recipientId",
            "issueId",
            "statusFrom",
            "statusTo"
        )
        values (
            gen_random_uuid()::text,
            NEW."userId",
            NEW.id,
            OLD.status,
            NEW.status
        );
    end if;

    return NEW;
end;
```

Documentación oficial:

https://supabase.com/docs/guides/database/functions

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

### Crear el Trigger

Una vez creada la función, crea el trigger que la ejecutará automáticamente cuando cambie el estado de un reporte.

Desde el Dashboard de Supabase navega a:

```
Database
└── Triggers
    └── New Trigger
```

Configura el trigger con los siguientes valores:

| Propiedad | Valor |
|-----------|-------|
| Nombre | `insert_notification` |
| Tabla | `Issue` |
| Evento | `AFTER UPDATE` |
| Orientation | `ROW` |
| Función | `insert_notification` |

Este trigger generará automáticamente una notificación cada vez que el estado de un reporte sea modificado.

Documentación oficial:

https://supabase.com/docs/guides/database/postgres/triggers

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Uso

### Ejecutar la API en desarrollo

Inicia el servidor de desarrollo con:

```bash
nest start --dev
```

La API estará disponible en:

```
http://localhost:3000
```

---

### Compilar para producción

Genera la versión compilada de la aplicación ejecutando:

```bash
npm run build
```

---

### Ejecutar la versión compilada

```bash
npm run start:prod
```

---

### Documentación oficial

Para obtener más información sobre las tecnologías utilizadas, consulta la documentación oficial:

- [NestJS](https://docs.nestjs.com/)
- [Prisma ORM](https://www.prisma.io/docs)
- [Supabase](https://supabase.com/docs)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Contribuciones

Si tienes alguna sugerencia para mejorar este proyecto, haz un fork del repositorio y crea un Pull Request. También puedes abrir un Issue utilizando la etiqueta **enhancement**.

Si este proyecto te resulta útil, considera darle una ⭐ al repositorio.

1. Haz un Fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios (`git commit -m 'Agrega nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Licencia

Distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Contacto

Nelson Almonte - almontetejedanelson@gmail.com

Repositorio del proyecto:

https://github.com/NelsonAlmonte/EcoPulse

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Agradecimientos

- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [Shields.io](https://shields.io/)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

[NestJS]: https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[NestJS-url]: https://nestjs.com/

[Prisma]: https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/

[Supabase]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
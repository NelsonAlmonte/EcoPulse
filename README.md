<br />
<div align="center">
  <a href="https://github.com/NelsonAlmonte/EcoPulse">
    <img src="admin/images/logo.png" alt="Logo" width="90">
  </a>

  <h2 align="center">EcoPulse</h2>

  <h4 align="center">
    Plataforma de participación ciudadana para el reporte y gestión de incidencias urbanas
  </h4>
</div>

<details>
  <summary>Tabla de contenido</summary>
  <ol>
    <li>
      <a href="#acerca-del-proyecto">Acerca del proyecto</a>
    </li>
    <li>
      <a href="#arquitectura">Arquitectura</a>
    </li>
    <li>
      <a href="#componentes-del-proyecto">Componentes del proyecto</a>
    </li>
    <li>
      <a href="#características-principales">Características principales</a>
    </li>
    <li>
      <a href="#capturas">Capturas</a>
    </li>
    <li>
      <a href="#tecnologías-utilizadas">Tecnologías utilizadas</a>
    </li>
    <li>
      <a href="#primeros-pasos">Primeros pasos</a>
    </li>
    <li><a href="#contribuciones">Contribuciones</a></li>
    <li><a href="#licencia">Licencia</a></li>
    <li><a href="#contacto">Contacto</a></li>
    <li><a href="#agradecimientos">Agradecimientos</a></li>
  </ol>
</details>

## Acerca del proyecto

EcoPulse es una plataforma de participación ciudadana diseñada para facilitar la comunicación entre los ciudadanos y las entidades responsables de la gestión de incidencias urbanas. Permite reportar problemas en espacios públicos mediante fotografías y geolocalización, realizar seguimiento de su estado y proporcionar herramientas de análisis que apoyan la toma de decisiones.

La plataforma está compuesta por una aplicación móvil para los ciudadanos, un panel administrativo para la gestión y análisis de la información y una API REST que centraliza toda la lógica de negocio y la comunicación entre los diferentes componentes del sistema.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Arquitectura

```
                    EcoPulse

      ┌──────────────────────────────┐
      │      Mobile (Ionic)          │
      └──────────────┬───────────────┘
                     │
                     │ REST API
                     ▼
      ┌──────────────────────────────┐
      │        API (NestJS)          │
      └──────────────┬───────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
 PostgreSQL                 Supabase Storage
 (Prisma ORM)               Authentication

                     ▲
                     │
      ┌──────────────┴───────────────┐
      │      Admin (SvelteKit)       │
      └──────────────────────────────┘
```

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Componentes del proyecto

| Proyecto | Descripción |
|----------|-------------|
| **Mobile** | Aplicación móvil utilizada por los ciudadanos para reportar y consultar incidencias. |
| **Admin** | Panel de administración para gestionar reportes, usuarios, categorías y estadísticas. |
| **API** | Backend desarrollado con NestJS encargado de la lógica de negocio, autenticación y acceso a los datos. |

Cada componente cuenta con su propio README donde se describe su instalación, configuración y uso.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Características principales

- Reporte de incidencias mediante fotografías y geolocalización.
- Consulta de reportes en un mapa interactivo.
- Sistema de apoyos para priorizar incidencias relevantes.
- Gestión y seguimiento del estado de los reportes.
- Funcionamiento sin conexión con sincronización automática.
- Panel administrativo para la gestión de reportes y usuarios.
- Estadísticas dinámicas mediante gráficos y análisis geoespacial.
- Visualización de mapas de calor.
- Administración de categorías de incidencias.
- Notificaciones sobre cambios en el estado de los reportes.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Capturas

<table align="center">
<tr>
<td align="center">
<img src="mobile/images/image-1.jpg" width="260"><br>
<b>Aplicación móvil</b>
</td>

<td align="center">
<img src="admin/images/image-1.png" width="260"><br>
<b>Panel administrativo</b>
</td>

<td align="center">
<img src="admin/images/image-2.png" width="260"><br>
<b>Mapa interactivo</b>
</td>
</tr>
</table>

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Tecnologías utilizadas

### Frontend

[![Ionic][Ionic]][Ionic-url]
[![Angular][Angular]][Angular-url]
[![SvelteKit][SvelteKit]][SvelteKit-url]
[![Tailwindcss][Tailwindcss]][Tailwindcss-url]

### Backend

[![NestJS][NestJS]][NestJS-url]
[![Prisma][Prisma]][Prisma-url]

### Base de datos y servicios

[![Supabase][Supabase]][Supabase-url]

- [PostgreSQL](https://www.postgresql.org/)
- [Google Maps Platform](https://www.npmjs.com/package/@googlemaps/js-api-loader)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Primeros pasos

Cada componente de EcoPulse posee su propia guía de instalación, configuración y uso. Consulta el README correspondiente según el componente que desees ejecutar.

| Componente | Documentación |
|------------|---------------|
| Mobile | [mobile/README.md](mobile/README.md) |
| Admin | [admin/README.md](admin/README.md) |
| API | [api/README.md](api/README.md) |

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Contribuciones

Si tienes alguna sugerencia para mejorar este proyecto, haz un fork del repositorio y crea un Pull Request. También puedes abrir un Issue utilizando la etiqueta **enhancement**.

Si este proyecto te resulta útil, considera darle una estrella al repositorio.

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

Este proyecto ha sido desarrollado utilizando las siguientes tecnologías y recursos:

- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.dev/)
- [SvelteKit](https://svelte.dev/docs/kit/introduction)
- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [Google Maps Platform](https://developers.google.com/maps)
- [Deck.gl](https://deck.gl/)
- [Flowbite Svelte](https://flowbite-svelte.com/)
- [Lucide Icons](https://lucide.dev/)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [Shields.io](https://shields.io/)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

[Ionic]: https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white
[Ionic-url]: https://ionicframework.com/

[Angular]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.dev/

[SvelteKit]: https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white
[SvelteKit-url]: https://svelte.dev/docs/kit/introduction

[Tailwindcss]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwindcss-url]: https://tailwindcss.com/

[NestJS]: https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[NestJS-url]: https://nestjs.com/

[Prisma]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/

[Supabase]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
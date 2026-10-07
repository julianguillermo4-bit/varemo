# Varemo: sitio listo para Render

Esta copia conserva la versión pública de prelanzamiento, con español e inglés, banderas, franja 24/7, precios orientativos, WhatsApp, Instagram, Google Maps, pagos y reprogramación gratuita. La agenda todavía no está abierta.

## Publicación

1. Crear un repositorio para esta carpeta en la cuenta de GitHub del propietario.
2. En Render, crear un **Static Site**, conectar ese repositorio y elegir la rama principal. No crear un Web Service ni una base de datos.
3. Comando de preparación: `node build.mjs`. Directorio para publicar: `dist`.
4. Nombre propuesto: `varemo` o `varemo-panama`, según disponibilidad. El nombre y la URL definitiva solo se confirman cuando Render crea el sitio.
5. Verificar el despliegue y la página pública antes de compartir el nuevo enlace.

Render proporciona `RENDER_EXTERNAL_URL` al construir sitios estáticos. El script usa esa dirección para la URL canónica y las imágenes para compartir, sin depender de un nombre personal. Si posteriormente se conecta un dominio propio, configurar `SITE_URL` con ese origen HTTPS y volver a publicar.

No requiere dependencias, base de datos ni un servicio de pago. El alojamiento estático está sujeto a los límites gratuitos de Render. No habilitar extras de pago para esta publicación.

## Comprobación local

Con Node.js 20 o posterior, definir `SITE_URL` con el origen HTTPS asignado y ejecutar `node build.mjs`. Los archivos listos estarán en `dist`. La carpeta `site` contiene las fuentes y no debe publicarse directamente, porque sus metadatos esperan la URL asignada.

## Mantenimiento

Editar los archivos de `site` y publicar los cambios en la rama `main`. Render reconstruye el sitio desde esa rama cuando la publicación automática está habilitada. La URL pública y el estado de cada publicación se consultan en Render.

## Referencias

- https://render.com/docs/static-sites
- https://render.com/docs/environment-variables
- Logo de Yappy, archivo horizontal oficial sin modificar: https://www.yappy.com.pa/comercial/uso-del-logo-de-yappy/

Las fotografías actuales son ilustrativas. Los datos de contacto y condiciones comerciales fueron proporcionados por el propietario.

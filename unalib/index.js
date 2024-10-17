module.exports = {

  // Función para validar si es una URL
  is_url: function (text) {
    console.log("Verificando si es una URL:", text);  
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    const isUrl = urlRegex.test(text);
    console.log("Es una URL:", isUrl);  
    return isUrl;
  },

  // Función para validar si es una imagen (por su extensión)
  is_image_url: function (url) {
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url);
    console.log("Es una imagen:", isImage, " URL:", url);  
    return isImage;
  },

  // Función para validar si es un video (YouTube, Vimeo, etc.)
  is_video_url: function (url) {
    const isVideo = /(youtube\.com|youtu\.be|vimeo\.com)/.test(url);
    console.log("Es un video:", isVideo, " URL:", url);  
    return isVideo;
  },

  // Función para prevenir inyecciones de scripts (escapar caracteres peligrosos)
  sanitize_input: function (input) {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  // Función para validar si es un número de teléfono
  is_valid_phone: function (phone) {
    console.log("Verificando si es un número de teléfono:", phone);
  
    // Expresión regular más estricta para números de teléfono de Costa Rica
    var re = /^\+?506?\s?-?\(?\d{4}\)?\s?-?\d{4}$/;
  
    var isValid = false;
  
    // validación Regex
    try {
      isValid = re.test(phone);
    } catch (e) {
      console.log(e);
    } finally {
      console.log("Es un número de teléfono válido:", isValid);
      return isValid;
    }
  },

  // Obtener el código embebido para mostrar la imagen o el video
  getEmbeddedCode: function (url) {
    console.log("Generando código embebido para la URL:", url);  

    if (this.is_image_url(url)) {
      console.log("Mostrando imagen embebida para la URL:", url);  
      return '<img src="' + this.sanitize_input(url) + '" width="200" />';
    } 
    else if (this.is_video_url(url)) {
      console.log("Mostrando video embebido para la URL:", url);  
      if (url.includes('youtu.be')) {
        var videoId = url.split('youtu.be/')[1];
        var ampersandPosition = videoId.indexOf('?');
        if (ampersandPosition != -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
        return '<iframe width="200" height="150" src="https://www.youtube.com/embed/' + this.sanitize_input(videoId) + '" frameborder="0" allowfullscreen></iframe>';
      } else if (url.includes('youtube.com')) {
        var videoId = url.split('v=')[1];
        var ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition != -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
        return '<iframe width="200" height="150" src="https://www.youtube.com/embed/' + this.sanitize_input(videoId) + '" frameborder="0" allowfullscreen></iframe>';
      }
    }
    console.log("No es ni imagen ni video, mostrando enlace simple.");  
    return '<a href="' + this.sanitize_input(url) + '" target="_blank">' + this.sanitize_input(url) + '</a>';
  },

  // Validación del mensaje, revisa si es una URL (imagen o video) o número de teléfono
  validateMessage: function (msg) {
    console.log("Validando mensaje:", msg);  
    var obj = JSON.parse(msg);

    // Sanitizar cualquier inyección de scripts en el mensaje
    obj.mensaje = this.sanitize_input(obj.mensaje);

    // Verificar si es un número de teléfono
    if (this.is_valid_phone(obj.mensaje)) {
      console.log("El mensaje es un número de teléfono");
      obj.mensaje = "Número de teléfono válido: " + obj.mensaje;  // Aquí puedes decidir cómo mostrar el teléfono.
    } 
    // Verificar si contiene una URL válida
    else if (this.is_url(obj.mensaje)) {
      console.log("Contiene una URL, generando código HTML...");  
      obj.mensaje = this.getEmbeddedCode(obj.mensaje);
    } else {
      console.log("El mensaje no contiene una URL ni un teléfono válido.");  
    }

    console.log("Mensaje validado:", JSON.stringify(obj));  
    return JSON.stringify(obj);
  }
};

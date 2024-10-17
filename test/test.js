var unalib = require('../unalib/index');
var assert = require('assert');

// Pruebas
describe('unalib', function(){

    // Prueba de validación de números de teléfono
    describe('función is_valid_phone', function(){
        it('debería devolver true para 8628-8165', function(){
            assert.equal(unalib.is_valid_phone('+506 8628-8165'), true);
        });

        it('debería devolver false para un número inválido como 123', function(){
            assert.equal(unalib.is_valid_phone('123'), false);
        });
    });

    // Prueba de validación de URLs de imágenes
    describe('función is_image_url', function(){
        it('debería devolver true para una URL de imagen', function(){
            assert.equal(unalib.is_image_url('https://www.shutterstock.com/shutterstock/photos/2265632523/display_1500/stock-photo-david-street-style-graphic-design-textile-artwork-for-t-shirts-pop-art-david-statue-illustration-2265632523.jpg'), true);
        });

        it('debería devolver false para una URL que no es una imagen', function(){
            assert.equal(unalib.is_image_url('https://www.shutterstock.com/es/image-illustration/david-street-style-graphic-design-artwork-2265632523'), false);
        });
    });

    // Prueba de validación de URLs de videos
    describe('función is_video_url', function(){
        it('debería devolver true para una URL de YouTube', function(){
            assert.equal(unalib.is_video_url('https://www.youtube.com/watch?v=boOEg604wf8'), true);
        });

        it('debería devolver true para una URL corta de YouTube', function(){
            assert.equal(unalib.is_video_url('https://youtu.be/boOEg604wf8?si=BIVtjK7seUrn9qs3'), true);
        });

        it('debería devolver false para una URL que no es de video', function(){
            assert.equal(unalib.is_video_url('https://www.shutterstock.com/shutterstock/photos/2222666693/display_1500/stock-photo-painting-by-raphael-in-vatican-museum-italy-famous-wall-fresco-school-of-athens-philosophers-2222666693.jpg'), false);
        });
    });

    // Prueba de prevención de inyección de scripts
    describe('función sanitize_input', function(){
        it('debería prevenir inyección de scripts en <script>', function(){
            assert.equal(unalib.sanitize_input('<script>alert("XSS")</script>'), '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
        });

        it('debería permitir texto normal sin cambios', function(){
            assert.equal(unalib.sanitize_input('Texto normal'), 'Texto normal');
        });

        it('debería sanitizar caracteres peligrosos', function(){
            assert.equal(unalib.sanitize_input('<img src="x" onerror="alert(\'XSS\')">'), '&lt;img src=&quot;x&quot; onerror=&quot;alert(&#039;XSS&#039;)&quot;&gt;');
        });
    });

});

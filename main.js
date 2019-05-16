

/* Decodificar URL en base64 manteniendo UTF-8 */
function b64DecodeUnicode(str) {
	return decodeURIComponent( atob(str).split('').map( function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	} ).join('') )
}

/* Extrae parametros de la URL utilizando la funcion de decodificacion
   El argumento n indica el punto de corte en caso de que los paramentros
   incluyan un hash */
function getUrlParameter(n) {

   	let pageURL = decodeURIComponent(window.location.search.substring(n))
   	pageURL = JSON.parse( this.b64DecodeUnicode(pageURL) )

}


/* Agrega separador de miles a un numero */
function parseNumber(str) {
   	let n = 3
   	let ret = []
   	let parsedStr = str.toString().split('').reverse()

   	let count = Math.ceil( parsedStr.length / n )

   	for( let i = 0; i < count; i++ ) {		
   		parsedStr.splice( n, 0, '.' )
   		n += n + 1
   	}

   	parsedStr.pop()

   	let finalStr = parsedStr.reverse().join('')

   	return finalStr

}


/* Descargar elemento html como PDF (Requiere JQuery, jsPDF y html2canvas) - 
   El argumento el es un string que representa la clase o id del elemento.
   El argumento name es el nombre que tendra el archivo, sin la extensión.
*/
function toPDF(el, name) {
   	let HTML_Width = $(el).width()
   	let HTML_Height = $(el).height()
   	let top_left_margin = 15
   	let PDF_Width = HTML_Width + ( top_left_margin * 2 )
   	let PDF_Height = ( HTML_Height ) + ( top_left_margin * 2 )
   	let canvas_image_width = HTML_Width
   	let canvas_image_height = HTML_Height

   	let totalPDFPages = Math.ceil( HTML_Height / PDF_Height ) - 1

   	html2canvas( $(el)[0], {
   		allowTaint: true, 
   		dpi: 300, 
   		scale: 1
   	}).then( (canvas)=> {
   		let ctx = canvas.getContext('2d')

   		ctx.webkitImageSmoothingEnabled = false;
   		ctx.mozImageSmoothingEnabled = false;
   		ctx.imageSmoothingEnabled = false;

   		let imgData = canvas.toDataURL( "image/jpeg", 1.0 )
   		let pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height] )
   		pdf.addImage( imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height )

   		for ( let i = 1; i <= totalPDFPages; i++ ) { 
   			pdf.addPage( PDF_Width, PDF_Height )
   			pdf.addImage( imgData, 'JPG', top_left_margin, -( PDF_Height * i ) + ( top_left_margin * 4 ), canvas_image_width, canvas_image_height )
   		}

   		let filename = name + '.pdf'
   		pdf.save( filename )

   	})

}
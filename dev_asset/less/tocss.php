<?php
/* =========================================================
 * [tocss.php]
 * Project:			wip_boilerplate_2.1.1
 * Description:		compiler and compress less to css
 * Start on:		14/10/2013
 * Copyright:   	2014 Wip Italia S.r.l.
 * Author URI:    	http://www.wipitalia.it/
 * ========================================================= *
 * this file minimized less file to css
 * ========================================================= */
?>
<?php
	error_reporting(E_ERROR | E_WARNING | E_PARSE);
	$lessFileVer= "1.6.3";

if (!$_GET['file'] && !$_POST['file']) {
?>
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8">
			<meta http-equiv="personal" content="no-cache">
			<title>ATTENTION need to get filename to compile</title>
			<link rel='shortcut icon' type='image/png' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAoklEQVQ4ja2TMQ7CMBAER9Ag0YBoaBNRI6iTFFT5/0OSLyzNRTLWOgkQSydZ673x+WxDNgStYBQMWYyCNvfnybVAC1GXkqsVyVNUv+zsKxH0ZvFhtMZoPdGgVDwF+JZoXVJt6h0cQIJzmO+CV8x3xlcEfHRbcCl4ZgHNiiYXAV0kHgo9mQU8zZknyNUB3DXujXa01/j3Q9rkKW/ymRLIV9/5DV+BbmvD2DmTAAAAAElFTkSuQmCC'>
		</head>
		<body>
			<p>ATTENTION need to get filename to compile</p></body>
			<p>p.s.: just file name not estension like <i>?file=style</i> or  <i>?file=desktop</i>.</p>
		</body>
	</html>


<?php
} elseif ($_GET['file']) {
		$fileName=$_GET['file']
?>
	<!DOCTYPE html>
	<html>
		<head>
				<meta charset="utf-8">
				<meta http-equiv="personal" content="no-cache">
				<title>WIP LESS COMPILER</title>
				<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
				<script>window.jQuery || document.write('<script src="../../js/vendor/jquery-1.11.0.min.js"><\/script>')</script>
				<link rel='shortcut icon' type='image/png' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtklEQVQ4jcWRTQrCMBCFv2P4h+DPRtK0CF5AENy79YzFZlqvo7aKQi9RNwpNWkvtQh/MZvK+eckE/qEgYdsZ1kKmhcI7MOsCp1oo3uUZdq1hT7iUYS2ktsGwakg+O3BmGyL06yAv9/2QkRZOFmy42nDM3pmeAwQxQ6dfaOFWvV7ExjWqmHElWSh8YVL7RnWkV5NmV8K0ccuLkP4nuPWfLw0DZ2F3ZZi3gmuGPL4Cy1KGdWf453oC0FyEF/4/YeUAAAAASUVORK5CYII='>
		</head>
		<body>
			<script src="less-<?php echo $lessFileVer ?>.min.js" type="text/javascript"></script>
			<script>window.less || document.write("<h1>ATTENTION - NO LESS FILE</h1>")</script>
			<script type="text/javascript">
			$(document).ready(function(){

				/* ---------------- DA CONFIGRARE: ----------------------------------- */

				/* pathToLess: percorso da questo file alla cartella dei sorgenti less */
				/* serve al configuratore per gli @import che trova nello style.less */
				var pathToLessFolder = '';


				// lessFile: la sorgente da compilare: importerà in @import tutti gli altri less
				var lessFile = pathToLessFolder+'<?php echo $fileName?>.less';

				// cssFile: il percorso di salvataggio del file finale compilato e minifizzato
				var cssFile = '../../css/<?php echo $fileName?>.min';   //output css SOLO il nome del file senza il formnato .css

				/* ------------------------------------------------------------------- */

				var checkDelay = 1000;
				var adesso = new Date(Date.now()).toISOString();
				var saverFile = 'tocss.php'



				var getMTime = function() {
					var check = $.ajax({
						url: lessFile,
						type: "GET",
						cache: false,
						success: function (data, status) {
							var modifica = new Date(check.getResponseHeader('Last-Modified')).toISOString();
							if(modifica > adesso ) {
								//console.log('oggi:'+adesso+' - ora: '+modifica);
								//creo il css compilato e minifizzato
								var lessCode = data, parser = new less.Parser({
									paths: [pathToLessFolder],
								});
								parser.parse(lessCode, function (error, root) {
									if (error) {
										//informo del mancato parsing
										$('title').text('ATTENZIONE! LESS IN ERRORE.');
										$('#rev').html('<i>Errore: </i><span>'+error.message+'</span><br/><i>Alla linea: </i><span>'+error.line+'</span>');
										setFavicon('error');
									} else {
										// inizializzo l'ajax che lo salva
										saveCss(root.toCSS({compress:true,comments:true}));
									}
								});

								//riciclo la data modifica
								adesso = modifica;
							}
						},
						error: function (xhr, err) {
						},
						complete: function(){
						}
					});
				}

				var saveCss = function(compiledCode){
					var saver = $.ajax({
						url: saverFile,
						type: "POST",
						data: {file: cssFile, content: compiledCode},
						cache: false,
						success: function (data, status) {
							$('title').text('<?php echo $fileName?> - OK! LESS COMPILATO.');
							$('#rev').html('<i>File compilato: </i><span>'+adesso+'</span> | '+cssFile);
							setFavicon('confirm');
						},
						error: function (xhr, err) {
							//informo del mancato salvataggio
							$('title').text('ATTENZIONE! CSS NON SALVATO.');
							$('#rev').html('<i>Errore: </i><span>Non è riuscito il salvataggio del file <?php echo $fileName?>.css.</span>');
							setFavicon('error');
						},
						complete: function(){
						}
					});
				}

				var getContrastYIQ = function(hexcolor){
					var r = parseInt(hexcolor.substr(0,2),16);
					var g = parseInt(hexcolor.substr(2,2),16);
					var b = parseInt(hexcolor.substr(4,2),16);
					var yiq = ((r*299)+(g*587)+(b*114))/1000;
					return (yiq >= 128) ? 'black' : 'white';
				}

				var setFavicon = function(status){
					switch(status) {
						case 'error':
							$('link[rel="shortcut icon"]').attr('href','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAoklEQVQ4ja2TMQ7CMBAER9Ag0YBoaBNRI6iTFFT5/0OSLyzNRTLWOgkQSydZ673x+WxDNgStYBQMWYyCNvfnybVAC1GXkqsVyVNUv+zsKxH0ZvFhtMZoPdGgVDwF+JZoXVJt6h0cQIJzmO+CV8x3xlcEfHRbcCl4ZgHNiiYXAV0kHgo9mQU8zZknyNUB3DXujXa01/j3Q9rkKW/ymRLIV9/5DV+BbmvD2DmTAAAAAElFTkSuQmCC');
							$('body').css('background','white');
						break;
						case 'confirm':
							$('link[rel="shortcut icon"]').attr('href','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtklEQVQ4jcWRTQrCMBCFv2P4h+DPRtK0CF5AENy79YzFZlqvo7aKQi9RNwpNWkvtQh/MZvK+eckE/qEgYdsZ1kKmhcI7MOsCp1oo3uUZdq1hT7iUYS2ktsGwakg+O3BmGyL06yAv9/2QkRZOFmy42nDM3pmeAwQxQ6dfaOFWvV7ExjWqmHElWSh8YVL7RnWkV5NmV8K0ccuLkP4nuPWfLw0DZ2F3ZZi3gmuGPL4Cy1KGdWf453oC0FyEF/4/YeUAAAAASUVORK5CYII=');
							var bgcolor= '#'+((1<<24)*Math.random()|0).toString(16);
							var txtcolor = getContrastYIQ(bgcolor);
							$('body').css({background:bgcolor,color:txtcolor});

						break;
					}
				}


				var init = function(){
					// intervallo di verifica, ogni N millisecondi
					var lesschecker = self.setInterval(function(){
						getMTime();
					},checkDelay);

					window.onerror = function(msg) {
						$('title').text('ATTENZIONE! CONSOLE IN ERRORE');
						$('#rev').html('<i>Errore: </i><span>'+msg+'</span><br/>Qualcosa e\' andato storto, probabilmente un mixin less usato con parametri a cazzo oppure una variabile less usata ma non valorizzata inizialmente.</span>');
						setFavicon('error');
					}
				}

				init();
			});
			</script>

			<div id="rev">START | <?php echo $fileName  ?> </div>
		</body>
	</html>
<?php
	} elseif (!$_GET['file'] && $_POST['file']) {
		$date = date('m/d/Y h:i:s a', time());
		$file = $_POST["file"].'.css';
		$nfile = str_replace('../../css/','',$file);
		$content ="@charset 'utf-8';
/* =========================================================
 * File:			".$nfile."
 * Last change:		".$date."
 * Copyright:       2014 Wip Italia S.r.l.
 * Author URI:		http://www.wipitalia.it/
 * ---------------------------------------------------------
 * this file is minimized from .less extension files
 * Using less version: ".$lessFileVer. "
 * ---------------------------------------------------------
 * ========================================================= */
".$_POST["content"];

		$fp = fopen($file, 'w');
		$fw = fwrite($fp, $content);
	//	$fw = fwrite($fp, stripslashes($content));
		fclose($fp);
	} else {
?>
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8">
			<meta http-equiv="personal" content="no-cache">
			<title>OPS</title>
			<link rel='shortcut icon' type='image/png' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAoklEQVQ4ja2TMQ7CMBAER9Ag0YBoaBNRI6iTFFT5/0OSLyzNRTLWOgkQSydZ673x+WxDNgStYBQMWYyCNvfnybVAC1GXkqsVyVNUv+zsKxH0ZvFhtMZoPdGgVDwF+JZoXVJt6h0cQIJzmO+CV8x3xlcEfHRbcCl4ZgHNiiYXAV0kHgo9mQU8zZknyNUB3DXujXa01/j3Q9rkKW/ymRLIV9/5DV+BbmvD2DmTAAAAAElFTkSuQmCC'>
		</head>
		<body>
			<p>OPS</p></body>
		</body>
	</html>
<?php
	}
?>
